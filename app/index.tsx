import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '../context/AuthContext';
import RegisterModal from '@/modals/RegisterModal';
import CustomAlertModal from '@/modals/CustomAlertModal';
import { BUTTON_STYLES } from '@/constants/Buttons';
import { HEADER_IMAGE_STYLES } from '@/constants/HeaderImage';
import { INPUTS_STYLES } from '@/constants/Inputs';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

export default function LoginScreen() {
  WebBrowser.maybeCompleteAuthSession();
  const redirectUri = AuthSession.makeRedirectUri();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '522198646666-nmgbgh4tcl7p98ttlo2pe1f0ufluuhto.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  
    redirectUri,
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'], // super important
  });
  console.log(redirectUri)
  
  const { onLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');


  
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.6.181:5000/api/auth/login', { email, password });
      const { token, user } = response.data;
      if (token && user) {
        showAlert('Success', response.data.message);
        onLogin!(token, user);
      }
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleRegister = async (registerEmail: string, registerPassword: string) => {
    try {
      const response = await axios.post('http://192.168.6.181:5000/api/auth/register', { email: registerEmail, password: registerPassword });
      showAlert('Success', response.data.message);
      setModalVisible(false); // Close modal on success
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };
  //notworking
  useEffect(() => {
    console.log("response")
    console.log(response)
    if (response?.type === 'success' && response?.params.id_token) {
      
      const loginWithGoogle = async () => {
        const idToken = response?.params.id_token;
        
        try {
          const backendResponse = await axios.post('http://192.168.6.181:5000/api/auth/google-login', {
            token: idToken,
          });
  
          const { token, user } = backendResponse.data;
          showAlert('Success', 'Logged in with Google');
          console.log('Calling onLogin with:', token, user);
          onLogin!(token, user);
        } catch (err) {
          console.error('Google login error:', err);
          showAlert('Error', err.response?.data?.message || 'Google login failed');
        }
      };
  
      loginWithGoogle();
    } else if (response?.type === 'error') {
      console.log("Failed")
      showAlert('Error', 'Google login failed');
    }
  }, [response]);
  

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image source={require('@/assets/images/splash-icon-no-background.png')} style={styles.headerImageStyle} />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Welcome Back!</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#808080"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#808080"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <ThemedText style={styles.buttonText}>Register</ThemedText>
        </TouchableOpacity>

        {/* Register Modal */}
        <RegisterModal visible={modalVisible} onClose={() => setModalVisible(false)} onRegister={handleRegister} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => promptAsync()}
          disabled={!request}>
          <ThemedText style={styles.buttonText}>Login with Google</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <CustomAlertModal 
        visible={alertVisible} 
        title={alertTitle} 
        message={alertMessage} 
        onClose={() => setAlertVisible(false)} 
      />

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 100, alignItems: 'center', gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  ...INPUTS_STYLES,
  ...BUTTON_STYLES,
  ...HEADER_IMAGE_STYLES
});
