import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUpload } from '@/src/context/UploadContext';

type UploadFieldProps = {
  type: 'image' | 'document';
  label?: string;
  accept?: string[]; // allowed mime types
  maxFileSize?: number;
  onChange?: (file: any | null) => void; // returns NormalizedFile
  value?: any; // optional controlled value
  multiple?: boolean; // only for images if you want multiple
};

export default function UploadField({
  type,
  label,
  accept,
  maxFileSize,
  onChange,
  value,
  multiple = false,
}: UploadFieldProps) {
  const { pickImage, pickDocument } = useUpload();
  const [loading, setLoading] = useState(false);

  const handlePick = async () => {
    setLoading(true);
  try {
    const opts = { accept, maxFileSize };
    const file = type === 'image' ? await pickImage(opts) : await pickDocument(opts);
    if (file) onChange?.(file);
  } catch (err: any) {
      console.error('UploadField.handlePick', err);
      Alert.alert('Error papa', err?.message ?? 'Could not pick file');
    } finally {
      setLoading(false);
    }
  };

  const display = value && (type === 'image' ? { uri: value.uri } : null);

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>{label ?? (type === 'image' ? 'Upload Photo' : 'Upload Document')}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={handlePick} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
          <Ionicons name={type === 'image' ? 'image-outline' : 'document-text-outline'} size={18} color={type === 'image' ? '#FF7622' : '#4F46E5'} />
          <Text style={{ color: type === 'image' ? '#FF7622' : '#4F46E5', marginLeft: 8, fontWeight: '600' }}>{type === 'image' ? 'Choose photo' : 'Choose document'}</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator style={{ marginLeft: 12 }} />}

        {value ? (
          type === 'image' ? (
            <Image source={{ uri: value.uri }} style={{ width: 80, height: 60, borderRadius: 8, marginLeft: 12 }} />
          ) : (
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontWeight: '600' }}>{value.name}</Text>
              <Text style={{ color: '#666' }}>{value.size ? `${Math.round(value.size / 1024)} KB` : ''}</Text>
            </View>
          )
        ) : null}
      </View>
    </View>
  );
}
