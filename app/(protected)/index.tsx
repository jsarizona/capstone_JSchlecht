import { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { BUTTON_STYLES } from '@/constants/Buttons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import UserAccountUpdateModal from '../../modals/UserAccountUpdateModal';
import { HEADER_IMAGE_STYLES } from '@/constants/HeaderImage';

const Page = () => {
  const { authState, onLogout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const onLogoutPressed = () => {
    onLogout!();
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
