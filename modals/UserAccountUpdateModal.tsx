import React, { useState } from 'react';
import { Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { BUTTON_STYLES } from '@/constants/Buttons';
import { CLOSE_BUTTON_STYLES } from '@/constants/Close_Buttons';
import { MODALS_STYLES } from '@/constants/Modals';
import { useCustomAlert } from './CustomAlertModal';
import CustomServer from '@/constants/CustomServer';


interface Props {
  visible: boolean;
  onClose: () => void;
}

const UserAccountUpdateModal: React.FC<Props> = ({ visible, onClose }) => {
  const { authState, onUpdate } = useAuth();
  const [name, setName] = useState(authState?.user?.name || '');
  const [role, setRole] = useState(authState?.user?.role || '');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordVerify, setNewPasswordVerify] = useState('');
  const { showAlert } = useCustomAlert();

  const handleUpdate = async () => {
    if (newPassword !== newPasswordVerify) {
      showAlert('Password Mismatch', 'The new passwords do not match.');
      setNewPassword('');
      setNewPasswordVerify('');
      onClose();
      return;
    }

    if (role !== 'user' && role !== 'admin') {
      showAlert('Invalid Role', 'Role must be either "user" or "admin".');
      onClose();
      setRole('');  
      return;
    }
  
    try {
      console.error("Trying to Update");
      
      // Replace with CustomServer.post instead of fetch
      const response = await CustomServer.post('/api/update/update', {
        email: authState?.user?.email,
        name,
        role,
        newPassword,
      });
  
      // Handle the response
      if (response.status === 200) {
        onUpdate?.(response.data.user); // Update auth context with new user data
        console.log("Success");
        onClose();  // Close the modal after the update attempt
      } else {
        console.error(response.data.message);
        showAlert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Update failed:', error);
      showAlert('Error', error.response?.data?.message || 'Something went wrong');
      onClose();  // Close the modal in case of error as well
      setNewPassword('');
      setNewPasswordVerify('');
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
        <TextInput style={styles.input} value={newPasswordVerify} onChangeText={setNewPasswordVerify} placeholder="Verify New Password" secureTextEntry />

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
