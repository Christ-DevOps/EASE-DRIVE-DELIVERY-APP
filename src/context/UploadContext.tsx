import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

type NormalizedFile = {
  uri: string;
  name: string;
  size?: number;
  mime?: string;
  kind: 'image' | 'document';
};

type PickOptions = {
  maxFileSize?: number; // bytes
  maxImageWidth?: number;
  accept?: string[];    // allowed mime types
};

type UploadContextValue = {
  pickImage: (opts?: PickOptions) => Promise<NormalizedFile | null>;
  pickDocument: (opts?: PickOptions) => Promise<NormalizedFile | null>;
  uploadToServer: (file: NormalizedFile, uploadUrl?: string) => Promise<{ ok: boolean; url?: string; error?: string }>;
  recentFiles: NormalizedFile[]; // helpful for UI/debug
};

const UploadContext = createContext<UploadContextValue | undefined>(undefined);

/* Defaults */
const DEFAULT_MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const DEFAULT_MAX_IMAGE_WIDTH = 1200;
const DEFAULT_ACCEPT_DOCS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [recentFiles, setRecentFiles] = useState<NormalizedFile[]>([]);

  const addRecent = (f: NormalizedFile) => setRecentFiles(prev => [f, ...prev].slice(0, 10));

  async function sanitizeImage(uri: string, maxWidth = DEFAULT_MAX_IMAGE_WIDTH, maxSize = DEFAULT_MAX_FILE_SIZE) {
    // Resize + compress
    const manipulated = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxWidth } }], {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    const info = await FileSystem.getInfoAsync(manipulated.uri);
    if (info.size && info.size > maxSize) {
      throw new Error(`Image too large after processing (${(info.size / (1024 * 1024)).toFixed(1)} MB).`);
    }
    return { uri: manipulated.uri, size: info.size, name: manipulated.uri.split('/').pop(), mime: 'image/jpeg' } as const;
  }

  // Picks an image from library, sanitizes, returns NormalizedFile or null
const pickImage = async (opts?: PickOptions): Promise<NormalizedFile | null> => {
  try {
    const maxFileSize = opts?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
    const maxImageWidth = opts?.maxImageWidth ?? DEFAULT_MAX_IMAGE_WIDTH;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo access to attach images.');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return null;

    // Handle both old and new response formats
    const asset = result.assets && result.assets.length > 0 
      ? result.assets[0] 
      : result;
    
    const uri = asset.uri;
    if (!uri) return null;

    // sanitize + validate
    const processed = await sanitizeImage(uri, maxImageWidth, maxFileSize);
    const normalized: NormalizedFile = {
      uri: processed.uri,
      name: processed.name || processed.uri.split('/').pop() || 'image.jpg',
      size: processed.size,
      mime: processed.mime,
      kind: 'image',
    };
    addRecent(normalized);
    return normalized;
  } catch (err: any) {
    console.error('pickImage error', err);
    Alert.alert('Error', err?.message ?? 'Could not pick image');
    return null;
  }
};

  // Picks a document & normalizes. Includes fallback size check via FileSystem.
const pickDocument = async (opts?: PickOptions): Promise<NormalizedFile | null> => {
  const accept = opts?.accept ?? [];
  const maxFileSize = opts?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    console.log('DocumentPicker result:', result);

    // Handle cancellation
    if (result.canceled || result.type === 'cancel') {
      return null;
    }

    // Handle the new assets array format (used in newer Expo versions)
    let fileData: any;
    if (result.assets && result.assets.length > 0) {
      fileData = result.assets[0];
    } else {
      // Fallback to old format
      fileData = result;
    }

    // Extract file information
    const uri = fileData.uri;
    const name = fileData.name;
    const size = fileData.size;
    const mime = fileData.mimeType;

    if (!uri) {
      console.warn('pickDocument: no uri found in DocumentPicker result.');
      Alert.alert('Error', 'Could not get a file URI from the picker.');
      return null;
    }

    // Validate file type
    const extension = name?.split('.').pop()?.toLowerCase() ?? '';
    const allowed =
      accept.length === 0 ||
      (mime && accept.includes(mime)) ||
      (extension && accept.some(a => a.toLowerCase().includes(extension)));

    if (!allowed) {
      Alert.alert('Invalid file type', 'Selected file type is not allowed.');
      return null;
    }

    // Validate file size
    if (size && size > maxFileSize) {
      Alert.alert('File too large', `Maximum allowed file size is ${(maxFileSize / (1024 * 1024)).toFixed(0)} MB.`);
      return null;
    }

    const normalized: NormalizedFile = {
      uri,
      name: name || uri.split('/').pop() || 'document',
      size,
      mime,
      kind: 'document',
    };

    addRecent(normalized);
    return normalized;
  } catch (err: any) {
    console.error('pickDocument error', err);
    Alert.alert('Error', err?.message ?? 'Could not pick document');
    return null;
  }
};

  // Simplified upload helper: POST multipart/form-data to `uploadUrl` if provided or to stub endpoint.
  // In production you'll likely use presigned URLs + direct upload to S3 or a secure endpoint.
  const uploadToServer = async (file: NormalizedFile, uploadUrl?: string) => {
    try {
      const fd = new FormData();
      fd.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mime || (file.kind === 'image' ? 'image/jpeg' : 'application/octet-stream'),
      } as any);

      // If uploadUrl (presigned) provided send PUT/POST appropriately.
      // Here we demonstrate a POST to a placeholder endpoint (replace with your API).
      // NOTE: use proper auth / headers
      // const res = await fetch(uploadUrl || 'https://your.api/upload', {
      //   method: 'POST',
      //   body: fd,
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });

      // For this demo we simulate and return a fake URL
      await new Promise(res => setTimeout(res, 800));
      return { ok: true, url: `https://cdn.example.com/uploads/${file.name}` };
    } catch (err: any) {
      console.error('uploadToServer error', err);
      return { ok: false, error: err?.message ?? 'Upload failed' };
    }
  };

  const value: UploadContextValue = {
    pickImage,
    pickDocument,
    uploadToServer,
    recentFiles,
  };

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
};

export const useUpload = (): UploadContextValue => {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error('useUpload must be used within UploadProvider');
  return ctx;
};
