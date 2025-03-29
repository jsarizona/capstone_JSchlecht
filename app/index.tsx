import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '../context/AuthContext';
import RegisterModal from '@/modals/RegisterModal'; // Import the modal

export default function LoginScreen() {
  const { onLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.6.181:5000/api/auth/login', { email, password });
      const { token, user } = response.data;
      if (token && user) {
        onLogin!(token, user);
        showAlert('Success', response.data.message);
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
        <Image source={require('@/assets/images/splash-icon.png')} style={styles.headerImage} />
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

      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 100, alignItems: 'center', gap:10},
  headerImage: { alignSelf: 'center', marginTop: 40, height: 225, width: 430 },
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
    borderRadius: 10,
    width: 350,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

