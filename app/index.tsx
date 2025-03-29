import { useContext, useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth } from '../context/AuthContext';

export default function loginScreen() {
  const {onLogin} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //calls on pressing the login button
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.6.181:5000/api/auth/login', { email, password });
      const { token, user } = response.data; 
      if (token && user) {
        onLogin!(token, user); // Pass token and user data to the login function
        showAlert('Success', response.data.message);
      }
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  //calls on pressing the Register Button`
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.6.181:5000/api/auth/register', { email, password });
  
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }
  
      showAlert('Success', response.data.message);
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };
  

  const showAlert = (title: string, message: string | undefined) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <ParallaxScrollView
    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
              <Image
                source={require('@/assets/images/splash-icon.png')}
                style={styles.headerImage}
              />
            }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Welcome Back!
        </ThemedText>

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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <ThemedText style={styles.buttonText}>Register</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 100, alignItems: 'center', gap: 16 },
  headerImage: { alignSelf: 'center', marginTop: 40,
    height: 225,
    width: 430,
    bottom: 0,
    left: 0,
   },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: {
    width: 300,
    height: 50,
    borderColor: '#808080',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 350,
    alignItems: 'center',
  },
  MyLogo: {
    position: 'absolute',
  },
  registerButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

