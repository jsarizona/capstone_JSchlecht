import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { BUTTON_STYLES } from '@/constants/Buttons';
import { CLOSE_BUTTON_STYLES } from '@/constants/Close_Buttons';
import { MODALS_STYLES } from '@/constants/Modals';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const UserAccountUpdateModal: React.FC<Props> = ({ visible, onClose }) => {
  const { authState } = useAuth(); //updateUser 
  const [name, setName] = useState(authState?.user?.name || '');
  const [role, setRole] = useState(authState?.user?.role || '');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = async () => {
    
    try {
        console.error("Trying to Update");
      const response = await fetch('http://192.168.6.181:5000/api/update/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authState?.user?.email, name, role, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        //updateUser(data.user); // Update auth context
        onClose();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <ThemedView style={styles.modalContainer}>
         <ThemedView style={styles.modalContent}>
        <ThemedText type="title">Update Account</ThemedText>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
        <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="Role" />
        <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="New Password" secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
        </TouchableOpacity>
      
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default UserAccountUpdateModal;

const styles = StyleSheet.create({
  ...MODALS_STYLES,
  ...BUTTON_STYLES,
  ...CLOSE_BUTTON_STYLES
});
