// app/(partner)/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import { UploadProvider } from '@/src/context/UploadContext'; // adjust path if needed

// This layout wraps everything under (partner) with UploadProvider.
// Any nested screen (eg. auth/Signup) can call useUpload() or render UploadField.
export default function PartnerLayout() {
  return (
    <UploadProvider>
      <SafeAreaView style={styles.safe}>
        {/* Slot renders the nested screens */}
        <Slot />
      </SafeAreaView>
    </UploadProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A1F33', // keep same theme as your partner screens or change
  },
});
