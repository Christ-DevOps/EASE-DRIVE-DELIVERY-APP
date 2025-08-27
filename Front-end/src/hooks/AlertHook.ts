import { useAlert } from "@/src/context/AlertContext";


export const useAlertFunctions = () => {
  const { addAlert } = useAlert();

  const showSuccess = (title: string, message: string, image?: string, duration?: number) => {
    addAlert({ type: 'success', title, message, image, duration });
  };

  const showError = (title: string, message: string, image?: string, duration?: number) => {
    addAlert({ type: 'error', title, message, image, duration });
  };

  const showWarning = (title: string, message: string, image?: string, duration?: number) => {
    addAlert({ type: 'warning', title, message, image, duration });
  };

  const showInfo = (title: string, message: string, image?: string, duration?: number) => {
    addAlert({ type: 'info', title, message, image, duration });
  };

  const showLoading = (title: string, message: string, image?: string) => {
    addAlert({ type: 'loading', title, message, image, duration: 0 });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
};

// Predefined alerts for common scenarios
export const usePredefinedAlerts = () => {
  const { showSuccess, showError, showInfo, showLoading } = useAlertFunctions();

  const signupSuccess = (image?: string) => {
    showSuccess(
      'Signup Successful!',
      'Your account has been created successfully.',
      image
    );
  };

  const loginSuccess = (image?: string) => {
    showSuccess('Login Successful!', 'Welcome back to your account.', image);
  };

  const paymentSuccess = (image?: string) => {
    showSuccess(
      'Payment Successful!',
      'Your payment has been processed successfully.',
      image
    );
  };

  const orderPlaced = (orderId: string, image?: string) => {
    showSuccess(
      'Order Placed!',
      `Your order #${orderId} has been placed successfully.`,
      image
    );
  };

  const deliveryUpdate = (status: string, image?: string) => {
    showInfo('Delivery Update', `Your order status: ${status}`, image);
  };

  const deliveryDriverAssigned = (driverName: string, image?: string) => {
    showInfo(
      'Driver Assigned',
      `${driverName} is delivering your order`,
      image
    );
  };

  const errorMessage = (message: string, image?: string) => {
    showError('Error', message, image);
  };

  return {
    signupSuccess,
    loginSuccess,
    paymentSuccess,
    orderPlaced,
    deliveryUpdate,
    deliveryDriverAssigned,
    errorMessage,
    showLoading,
  };
};