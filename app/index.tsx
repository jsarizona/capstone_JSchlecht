import { useContext, useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image, Platform, Modal, View } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth } from '../context/AuthContext';

export default function loginScreen() {
  const { onLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    if (registerPassword !== confirmPassword) {
      showAlert('Error', "Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post('http://192.168.6.181:5000/api/auth/register', { email: registerEmail, password: registerPassword });

      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }

      showAlert('Success', response.data.message);
      setModalVisible(false); // Close the modal after successful registration
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
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <ThemedText style={styles.buttonText}>Register</ThemedText>
        </TouchableOpacity>

         {/* Registration Modal */}
         <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText type="title" style={styles.modalTitle}>Register</ThemedText>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#808080"
                keyboardType="email-address"
                value={registerEmail}
                onChangeText={setRegisterEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#808080"
                secureTextEntry
                value={registerPassword}
                onChangeText={setRegisterPassword}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#808080"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <ThemedText style={styles.buttonText}>Create Account</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)', //grey light opacity to show
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '90%', // Makes it responsive
    maxWidth: 400, // Prevents it from getting too wide on large screens
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 350,
    alignItems: 'center',
    marginTop: 10,
  },

});

