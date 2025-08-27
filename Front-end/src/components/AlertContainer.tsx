import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useAlert } from "@/src/context/AlertContext";
import AlertComponent from "./AlertComponent";

const AlertContainer = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertComponent
            alert={item}
            onClose={() => removeAlert(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 10,
    width: "85%",
    zIndex: 999,
  },
});

export default AlertContainer;
