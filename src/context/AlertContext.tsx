import React, { createContext, useContext, useState, ReactNode } from "react";
import AlertContainer from "../components/AlertContainer";

export type AlertType = "success" | "error" | "warning" | "info" | "loading";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
  image?: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id">) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const AlertProvider: React.FC<Props> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Omit<Alert, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert = { ...alert, id };
    setAlerts((prev) => [...prev, newAlert]);

    if (alert.type !== "loading" && alert.duration !== 0) {
      setTimeout(() => removeAlert(id), alert.duration || 5000);
    }
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  );
};
