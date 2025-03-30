import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { BUTTON_STYLES } from '@/constants/Buttons';
import { CLOSE_BUTTON_STYLES } from '@/constants/Close_Buttons';
import { MODALS_STYLES } from '@/constants/Modals';
import { ThemedView } from '@/components/ThemedView';

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onRegister: (email: string, password: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ visible, onClose, onRegister }) => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (registerPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onRegister(registerEmail, registerPassword);
    onClose(); // Close the modal after successful registration
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedText type="title">Register</ThemedText>

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

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...MODALS_STYLES,
  ...BUTTON_STYLES,
  ...CLOSE_BUTTON_STYLES
});

export default RegisterModal;
