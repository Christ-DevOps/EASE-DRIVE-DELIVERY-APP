import React, { createContext, useContext } from 'react';
import { useRouter } from 'expo-router';

type NavContext = {
  navigateToProfileData: () => void;
  navigateToEditProfile: () => void;
  navigateToEditAddress: (id: string) => void;
  navigateToRestaurant: (id: string) => void;
  navigateToMealDetails: (id: string) => void;
  navigateToConfirmDelivery: () => void;
  navigateToPaymentMethods: () => void;
  navigateToReviews: () => void;
  navigateToNotifications: () => void;
  navigateToFavorites: () => void;
  navigateToLocationAccess: () => void;
  goBack: () => void;
};

const NavigationContext = createContext<NavContext>({
  navigateToProfileData: () => {},
  navigateToEditProfile: () => {},
  navigateToEditAddress: (id: string) => {},
  navigateToRestaurant: (id: string) => {},
  navigateToMealDetails: (id: string) => {},
  navigateToConfirmDelivery: () => {},
//   navigateToOrderTracking: (id: string) => {},
  navigateToPaymentMethods: () => {},
//   navigateToAddPayment: () => {},
  navigateToReviews: () => {},
  navigateToNotifications: () => {},
  navigateToFavorites: () => {},
  navigateToLocationAccess: () => {},
  goBack: () => {},
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  
  const navigateToProfileData = () => {
    router.push('/(main)/Profile/ViewPersonaInfo');
    console.log('Personal Info Pressed');
  };
  const navigateToEditProfile = () => router.push('/(main)/Profile/EditProfile');
  const navigateToEditAddress = (id: string) => router.push(`/(main)/Profile/EditAddress?id=${id}`);
  const navigateToRestaurant = (id: string) => router.push(`/(main)/restaurant/${id}`);
  const navigateToMealDetails = (id: string) => router.push(`/(main)/restaurant/Meal/${id}`);
  const navigateToConfirmDelivery = () => router.push('/(main)/Orders/ConfirmDelivery');
//   const navigateToOrderTracking = (id: string) => router.push(`/main/orders/tracking/${id}`);
  const navigateToPaymentMethods = () => router.push('/(main)/Payment/ChoosePaymentMethod');
//   const navigateToAddPayment = () => router.push('/main/payment/add');
  const navigateToReviews = () => router.push('/(main)/reviews');
  const navigateToNotifications = () => router.push('/(main)/notifications');
  const navigateToFavorites = () => router.push('/(main)/favorites');
  const navigateToLocationAccess = () => router.push('/(main)/location/access');
  const goBack = () => router.back();

  return (  
    <NavigationContext.Provider
      value={{
        navigateToProfileData,
        navigateToEditProfile,
        navigateToEditAddress,
        navigateToRestaurant,
        navigateToMealDetails,
        navigateToConfirmDelivery,
        //navigateToOrderTracking,
        navigateToPaymentMethods,
        //navigateToAddPayment,
        navigateToReviews,
       navigateToNotifications,
        navigateToFavorites,
        navigateToLocationAccess,
        goBack
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNav = () => useContext(NavigationContext);