import { Platform } from "react-native";

let API_BASE_URL = "http://localhost:5000"; // fallback (development)

if (__DEV__) {
  if (Platform.OS === "android") {
    API_BASE_URL = "http://10.0.2.2:5000"; // Android emulator
  } else if (Platform.OS === "ios") {
    API_BASE_URL = "http://localhost:5000"; // iOS simulator
  } else {
    // Physical device → replace with your machine’s IPv4 address
    API_BASE_URL = "http://10.171.8.152:5000";
  }
} else {
  // Production
  API_BASE_URL = "https://your-production-api.com";
}

export const API = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  PARTNER: {
    CREATE_MENU: `${API_BASE_URL}/api/menus`,
    // add more partner routes later
  },
  DELIVERY: {
    ASSIGN: `${API_BASE_URL}/api/delivery/assign`,
    // add more delivery routes later
  },
};
