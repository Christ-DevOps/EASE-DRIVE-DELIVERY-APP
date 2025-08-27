// SendFeedback.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_IMAGE = require('@/src/assets/images/login-graphic.png'); // fallback (optional)

export default function SendFeedback() {
  const [rating, setRating] = useState(0); // 0..5
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState<any>(null); // { uri }
  const [loading, setLoading] = useState(false);

  const pickScreenshot = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow photo access to attach a screenshot.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
      if (!result.cancelled && uri) setScreenshot({ uri });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const removeScreenshot = () => setScreenshot(null);

  const validate = () => {
    if (!message.trim()) return 'Please enter your feedback message.';
    if (rating === 0) return 'Please give a rating (1-5 stars).';
    return null;
  };

  // Placeholder for real server upload
  const submitFeedback = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Validation', err);
      return;
    }

    setLoading(true);
    try {
      // Example: If you want to upload to a server, build FormData:
      // const fd = new FormData();
      // fd.append('rating', rating.toString());
      // fd.append('subject', subject);
      // fd.append('message', message);
      // if (screenshot?.uri) {
      //   const filename = screenshot.uri.split('/').pop();
      //   const match = /\.(\w+)$/.exec(filename || '');
      //   const ext = match ? match[1] : 'jpg';
      //   fd.append('file', { uri: screenshot.uri, name: filename, type: `image/${ext === 'jpg' ? 'jpeg' : ext}` } as any);
      // }
      // await fetch('https://your-api/feedback', { method: 'POST', body: fd });

      // Simulate network
      await new Promise(res => setTimeout(res, 900));
      setSubject('');
      setMessage('');
      setRating(0);
      setScreenshot(null);
      Alert.alert('Thank you', 'Your feedback has been submitted.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not send feedback. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Send Feedback</Text>
        <Text style={styles.subtitle}>Help us improve by sending honest feedback.</Text>

        <Text style={styles.label}>Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
              <Ionicons
                name={i <= rating ? 'star' : 'star-outline'}
                size={30}
                color={i <= rating ? '#FFC107' : '#CCCCCC'}
                style={{ marginHorizontal: 6 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Subject (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Short subject"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe the issue or suggestion..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Attach screenshot (optional)</Text>
        <View style={styles.screenshotRow}>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickScreenshot}>
            <Ionicons name="image-outline" size={18} color="#FF7622" />
            <Text style={styles.uploadText}>Choose image</Text>
          </TouchableOpacity>
          {screenshot ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: screenshot.uri }} style={styles.preview} />
              <TouchableOpacity style={styles.removeBtn} onPress={removeScreenshot}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.previewPlaceholder}>
              <Image source={DEFAULT_IMAGE} style={styles.previewSmall} />
            </View>
          )}
        </View>

        <View style={{ height: 16 }} />

        <TouchableOpacity style={styles.submitBtn} onPress={submitFeedback} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Send Feedback</Text>}
        </TouchableOpacity>

        <Text style={styles.smallNote}>
          We will review your message and contact you if we need more details.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F5FA', paddingTop: 30 },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#333', fontFamily: 'SpaceMono' },
  subtitle: { color: '#666', marginTop: 6, marginBottom: 18, fontFamily: 'SpaceMono' },
  label: { fontSize: 14, color: '#333', marginTop: 10, marginBottom: 8, fontFamily: 'SpaceMono', fontWeight: '600' },
  starsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, fontSize: 16, fontFamily: 'SpaceMono', elevation: 1 },
  textarea: { minHeight: 120, marginBottom: 6 },
  screenshotRow: { flexDirection: 'row', alignItems: 'center' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  uploadText: { color: '#FF7622', marginLeft: 8, fontWeight: '600', fontFamily: 'SpaceMono' },
  previewWrap: { marginLeft: 12, alignItems: 'center' },
  preview: { width: 90, height: 70, borderRadius: 8, resizeMode: 'cover' },
  previewSmall: { width: 60, height: 45, opacity: 0.6, resizeMode: 'cover' },
  previewPlaceholder: { marginLeft: 12, padding: 6, borderRadius: 6, backgroundColor: '#fff' },
  removeBtn: { marginTop: 6 },
  removeText: { color: '#888', fontFamily: 'SpaceMono' },
  submitBtn: { marginTop: 10, backgroundColor: '#FF7622', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: '700', fontFamily: 'SpaceMono' },
  smallNote: { marginTop: 12, color: '#666', fontSize: 13, fontFamily: 'SpaceMono' },
});
