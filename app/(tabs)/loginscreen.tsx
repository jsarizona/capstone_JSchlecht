import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.6.181:5000/login', { email, password });
      Alert.alert('Success', response.data.message);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.6.181:5000/register', { email, password });
      Alert.alert('Success', response.data.message);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f5f5f5', dark: '#252525' }}
      headerImage={
        <IconSymbol
          size={100}
          color="#808080"
          name="person"
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <ThemedText style={styles.buttonText}>Register</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, alignItems: 'center', gap: 16 },
  headerImage: { alignSelf: 'center', marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#808080',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  
  registerButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

