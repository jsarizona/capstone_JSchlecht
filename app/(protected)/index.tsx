import { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { BUTTON_STYLES } from '@/constants/Buttons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import UserAccountUpdateModal from '../../modals/UserAccountUpdateModal';
import { HEADER_IMAGE_STYLES } from '@/constants/HeaderImage';
import CustomServer from '@/constants/CustomServer';
import { useCustomAlert } from '@/modals/CustomAlertModal';


const Page = () => {
  const { authState, onLogout, onVerifyEmail } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const { showAlert } = useCustomAlert();

  const onLogoutPressed = () => {
    onLogout!();
    
  };
  const handleVerifyEmail = async () => {
    try {
      
      const response = await CustomServer.post('/api/auth/reverify-email', {
        email: authState?.user?.email,
      });
      
      const { message, verified } = response.data;
      if (verified) {
        onVerifyEmail?.(); // Only run this if already verified
        showAlert('Already Verified', message);
      } else {
        showAlert('Verification Email Sent', message); // Not yet verified, email was resent
      }
  
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };
  
  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/Logo-no-background.png')} style={styles.headerImageStyle} />}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Welcome Back!</ThemedText>
        <ThemedText type="subtitle">Username: {authState?.user?.email}</ThemedText>
        <ThemedText type="subtitle">Name: {authState?.user?.name}</ThemedText>
        <ThemedText type="subtitle">Role: {authState?.user?.role}</ThemedText>

        <TouchableOpacity style={styles.button} onPress={onLogoutPressed}>
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <ThemedText style={styles.buttonText}>Update Account Info</ThemedText>
        </TouchableOpacity>
        {authState?.user?.emailVerified === false && (
        <TouchableOpacity style={styles.button} onPress={handleVerifyEmail}>
          <ThemedText style={styles.buttonText}>Press here to verify your email</ThemedText>
        </TouchableOpacity>
        )}
        <UserAccountUpdateModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 100, alignItems: 'center', gap: 10 },
  ...HEADER_IMAGE_STYLES,
  ...BUTTON_STYLES,
});
