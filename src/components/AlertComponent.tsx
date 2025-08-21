import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Platform,
  Modal,
  Pressable
} from "react-native";
import { MotiView } from "moti";
import { BlurView } from 'expo-blur';
import type { Alert } from "@/src/context/AlertContext";

const { width, height } = Dimensions.get('window');

interface Props {
  alert: Alert;
  onClose: () => void;
}

const AlertComponent: React.FC<Props> = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setModalVisible(false);
      onClose();
    }, 300);
  };

  // Auto-dismiss for success and info after 4 seconds
  useEffect(() => {
    if (alert.type === 'success' || alert.type === 'info') {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [alert.type]);

  const alertConfig = {
    success: { 
      icon: "✅", 
      gradient: ["#10b981", "#059669"],
      ringColor: "#10b981",
      bgColor: "#ffffff",
      textColor: "#065f46",
      subtitleColor: "#6b7280",
      accentEmoji: "🎉",
      particleColor: "#10b981"
    },
    error: { 
      icon: "❌", 
      gradient: ["#ef4444", "#dc2626"],
      ringColor: "#ef4444",
      bgColor: "#ffffff",
      textColor: "#991b1b",
      subtitleColor: "#6b7280",
      accentEmoji: "💥",
      particleColor: "#ef4444"
    },
    warning: { 
      icon: "⚠️", 
      gradient: ["#f59e0b", "#d97706"],
      ringColor: "#f59e0b",
      bgColor: "#ffffff",
      textColor: "#92400e",
      subtitleColor: "#6b7280",
      accentEmoji: "⚡",
      particleColor: "#f59e0b"
    },
    info: { 
      icon: "ℹ️", 
      gradient: ["#3b82f6", "#2563eb"],
      ringColor: "#3b82f6",
      bgColor: "#ffffff",
      textColor: "#1e3a8a",
      subtitleColor: "#6b7280",
      accentEmoji: "💡",
      particleColor: "#3b82f6"
    },
    loading: { 
      icon: "⏳", 
      gradient: ["#6b7280", "#4b5563"],
      ringColor: "#6b7280",
      bgColor: "#ffffff",
      textColor: "#374151",
      subtitleColor: "#6b7280",
      accentEmoji: "🔄",
      particleColor: "#6b7280"
    },
  }[alert.type];

  const FloatingParticle = ({ delay, size, color }: { delay: number, size: number, color: string }) => (
    <MotiView
      from={{
        opacity: 0,
        scale: 0,
        translateY: 0,
      }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        translateY: [-20, -60, -100],
      }}
      transition={{
        type: "timing",
        duration: 3000,
        delay,
        loop: true,
      }}
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          backgroundColor: color + '40',
        }
      ]}
    />
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      {/* Blurred Background Overlay */}
      <BlurView intensity={20} style={styles.overlay}>
        <Pressable style={styles.overlay} onPress={handleClose}>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.blurOverlay}
          />
        </Pressable>

        {/* Alert Container */}
        <View style={styles.centeredView}>
          <MotiView
            from={{ 
              opacity: 0, 
              scale: 0.5,
              translateY: -100
            }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              scale: isVisible ? 1 : 0.5,
              translateY: isVisible ? 0 : -100
            }}
            transition={{ 
              type: "spring", 
              damping: 15,
              stiffness: 200,
              duration: 500
            }}
            style={[styles.alertContainer, { backgroundColor: alertConfig.bgColor }]}
          >
            {/* Floating Particles */}
            <View style={styles.particlesContainer}>
              <FloatingParticle delay={0} size={6} color={alertConfig.particleColor} />
              <FloatingParticle delay={500} size={4} color={alertConfig.particleColor} />
              <FloatingParticle delay={1000} size={8} color={alertConfig.particleColor} />
              <FloatingParticle delay={1500} size={5} color={alertConfig.particleColor} />
            </View>

            {/* Header Section */}
            <View style={styles.header}>
              {/* Animated Icon with Ring */}
              <View style={styles.iconSection}>
                <MotiView
                  from={{ scale: 0, rotate: "0deg" }}
                  animate={{ 
                    scale: 1, 
                    rotate: alert.type === 'loading' ? "360deg" : "0deg" 
                  }}
                  transition={{
                    scale: { type: "spring", damping: 10, stiffness: 200, delay: 200 },
                    rotate: { 
                      type: "timing", 
                      duration: 2000, 
                      loop: alert.type === 'loading' 
                    }
                  }}
                  style={[
                    styles.iconContainer,
                    { borderColor: alertConfig.ringColor }
                  ]}
                >
                  <Text style={styles.mainIcon}>{alertConfig.icon}</Text>
                  
                  {/* Pulsing Ring Effect */}
                  <MotiView
                    from={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{
                      type: "timing",
                      duration: 2000,
                      loop: true,
                    }}
                    style={[
                      styles.pulseRing,
                      { borderColor: alertConfig.ringColor }
                    ]}
                  />
                </MotiView>

                {/* Accent Emoji */}
                <MotiView
                  from={{ scale: 0, rotate: "-45deg" }}
                  animate={{ scale: 1, rotate: "0deg" }}
                  transition={{
                    type: "spring",
                    damping: 8,
                    stiffness: 150,
                    delay: 400
                  }}
                  style={styles.accentEmojiContainer}
                >
                  <Text style={styles.accentEmoji}>{alertConfig.accentEmoji}</Text>
                </MotiView>
              </View>

              {/* Close Button */}
              <TouchableOpacity 
                onPress={handleClose}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MotiView
                  from={{ rotate: "0deg" }}
                  animate={{ rotate: "90deg" }}
                  transition={{ type: "timing", duration: 200 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </MotiView>
              </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: 400,
                  delay: 300
                }}
              >
                <Text style={[styles.title, { color: alertConfig.textColor }]}>
                  {alert.title}
                </Text>
                <Text style={[styles.message, { color: alertConfig.subtitleColor }]}>
                  {alert.message}
                </Text>
              </MotiView>

              {/* Image if provided */}
              {alert.image && (
                <MotiView
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 150,
                    delay: 500
                  }}
                  style={styles.imageContainer}
                >
                  <Image 
                    source={{ uri: alert.image }} 
                    style={styles.image}
                    resizeMode="cover"
                  />
                </MotiView>
              )}
            </View>

            {/* Action Buttons (if needed) */}
            {(alert.type === 'error' || alert.type === 'warning') && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: 400,
                  delay: 600
                }}
                style={styles.actionSection}
              >
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: alertConfig.gradient[0] }
                  ]}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>Understood</Text>
                </TouchableOpacity>
              </MotiView>
            )}

            {/* Decorative Bottom Element */}
            <View style={styles.decorativeBottom}>
              <View style={[styles.decorativeLine, { backgroundColor: alertConfig.ringColor }]} />
              <View style={styles.decorativeDots}>
                {[0, 1, 2].map((index) => (
                  <MotiView
                    key={index}
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 10,
                      stiffness: 200,
                      delay: 700 + (index * 100)
                    }}
                    style={[
                      styles.decorativeDot,
                      { backgroundColor: alertConfig.ringColor + (80 - index * 20).toString(16) }
                    ]}
                  />
                ))}
              </View>
            </View>
          </MotiView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
    position: 'relative',
    overflow: 'hidden',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    top: '50%',
    left: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconSection: {
    position: 'relative',
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'relative',
  },
  mainIcon: {
    fontSize: 32,
    textAlign: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    opacity: 0.6,
  },
  accentEmojiContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  accentEmoji: {
    fontSize: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  content: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  imageContainer: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  actionSection: {
    marginTop: 12,
    width: '100%',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  decorativeBottom: {
    alignItems: 'center',
    marginTop: 16,
  },
  decorativeLine: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  decorativeDots: {
    flexDirection: 'row',
    gap: 6,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default AlertComponent;