import React, { useState } from 'react';
import { Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { BUTTON_STYLES } from '@/constants/Buttons';
import { CLOSE_BUTTON_STYLES } from '@/constants/Close_Buttons';
import { MODALS_STYLES } from '@/constants/Modals';
import { ThemedView } from '@/components/ThemedView';

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (pin: string) => void;
}

const PinModal: React.FC<PinModalProps> = ({ visible, onClose, onVerify }) => {
  const [pin, setPin] = useState('');
  const [pinVerify, setPinVerify] = useState('');
  const handleVerify = () => {
    if (pin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }
    if (pin !== pinVerify) {
      alert('Pin does not match');
      return;
    }
    onVerify(pin);
    setPin('');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedText type="title">Enter PIN</ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Enter 4-digit PIN"
            placeholderTextColor="#808080"
            keyboardType="numeric"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
            maxLength={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Verify 4-digit PIN"
            placeholderTextColor="#808080"
            keyboardType="numeric"
            secureTextEntry
            value={pinVerify}
            onChangeText={setPinVerify}
            maxLength={4}
          />

          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <ThemedText style={styles.buttonText}>Verify</ThemedText>
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
  ...CLOSE_BUTTON_STYLES,
});

export default PinModal;
