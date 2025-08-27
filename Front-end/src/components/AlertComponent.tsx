import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import type { Alert } from "@/src/context/AlertContext";

const { width } = Dimensions.get("window");

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

  useEffect(() => {
    if (alert.type === "success" || alert.type === "info") {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [alert.type]);

  const alertConfig = {
    success: {
      icon: "✅",
      gradient: ["#a7f3d0", "#d1fae5"],
      textColor: "#065f46",
      accentColor: "#10b981",
    },
    error: {
      icon: "❌",
      gradient: ["#fecaca", "#fee2e2"],
      textColor: "#991b1b",
      accentColor: "#ef4444",
    },
    warning: {
      icon: "⚠️",
      gradient: ["#fde68a", "#fef9c3"],
      textColor: "#92400e",
      accentColor: "#f59e0b",
    },
    info: {
      icon: "ℹ️",
      gradient: ["#bfdbfe", "#dbeafe"],
      textColor: "#1e3a8a",
      accentColor: "#3b82f6",
    },
    loading: {
      icon: "⏳",
      gradient: ["#e5e7eb", "#f3f4f6"],
      textColor: "#374151",
      accentColor: "#6b7280",
    },
  }[alert.type];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <BlurView intensity={20} tint="dark" style={styles.blurOverlay}>
          <MotiView
            from={{ opacity: 0, translateY: -50 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              translateY: isVisible ? 0 : -50,
            }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            style={styles.centeredView}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <MotiView
                from={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "timing", duration: 300 }}
                style={styles.alertContainer}
              >
                <LinearGradient
                  colors={alertConfig.gradient}
                  style={styles.gradientBackground}
                />

                {/* Animated content */}
                <MotiView
                  from={{ translateY: 20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  transition={{ delay: 100, type: "timing" }}
                  style={styles.contentContainer}
                >
                  <View style={styles.iconContainer}>
                    <MotiView
                      from={{ scale: 0, rotate: "0deg" }}
                      animate={{
                        scale: 1,
                        rotate:
                          alert.type === "loading" ? "360deg" : "0deg",
                      }}
                      transition={{
                        scale: { type: "spring", damping: 10, stiffness: 200, delay: 200 },
                        rotate: {
                          type: "timing",
                          duration: 2000,
                          loop: alert.type === "loading",
                        },
                      }}
                    >
                      <Text style={styles.mainIcon}>{alertConfig.icon}</Text>
                    </MotiView>
                  </View>

                  <Text
                    style={[styles.title, { color: alertConfig.textColor }]}
                  >
                    {alert.title}
                  </Text>
                  <Text style={[styles.message, { color: alertConfig.textColor }]}>
                    {alert.message}
                  </Text>
                </MotiView>

                {/* Action Button for error/warning */}
                {(alert.type === "error" || alert.type === "warning") && (
                  <MotiView
                    from={{ translateY: 20, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ delay: 300, type: "timing" }}
                    style={styles.actionSection}
                  >
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: alertConfig.accentColor },
                      ]}
                      onPress={handleClose}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.actionButtonText}>Dismiss</Text>
                    </TouchableOpacity>
                  </MotiView>
                )}
              </MotiView>
            </Pressable>
          </MotiView>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  contentContainer: {
    padding: 30,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mainIcon: {
    fontSize: 40,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 5,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: "100%",
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AlertComponent;