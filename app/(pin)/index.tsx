import { useEffect, useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { BUTTON_STYLES } from '@/constants/Buttons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HEADER_IMAGE_STYLES } from '@/constants/HeaderImage';
import PinModal from '@/modals/VerifyPinModal';
import { router } from 'expo-router';

const Page = () => {
  const { authState, onLogout } = useAuth();
  const [pinModalVisible, setPinModalVisible] = useState(true);

  const onLogoutPressed = () => {
    onLogout!();
    router.replace('/index');
  };
  

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/Logo-no-background.png')} style={styles.headerImageStyle} />}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Welcome Back! </ThemedText>
        <ThemedText type="title">Please Verify Pin or Logout</ThemedText>
        
        <ThemedText type='subtitle'>Email: {authState?.user?.email}</ThemedText>
        <ThemedText type="subtitle">Name: {authState?.user?.name}</ThemedText>

        <TouchableOpacity style={styles.button} onPress={onLogoutPressed}>
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <PinModal
      visible={pinModalVisible}
      onClose={() => setPinModalVisible(false)}
      />
    </ParallaxScrollView>
  
  );
};

export default Page;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 100, alignItems: 'center', gap: 10 },
  ...HEADER_IMAGE_STYLES,
  ...BUTTON_STYLES,
});
