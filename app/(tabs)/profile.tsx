import { Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

import {useAuth } from '@/context/AuthContext';

export default function profileScreen() {
  const {onLogout} = useAuth();

  const handleLogout = async () => {
    try {
      onLogout?.()
      router.replace('/'); // Redirect to login screen after logout
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/Logo-no-background.png')}
          style={styles.Logo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome! To Profile Screen</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">User Details</ThemedText>
        <ThemedText type="subtitle"> Name </ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <ThemedText style={styles.buttonText}>Log Out</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  Logo: {
    height: 200,
    width: 400,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
