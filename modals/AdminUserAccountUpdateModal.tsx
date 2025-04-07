import React, { useState, useEffect } from 'react';
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
  user: any; // Added user prop
}

const AdminUserAccountUpdateModal: React.FC<Props> = ({ visible, onClose, user }) => {
  const { onUpdate } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [newPassword, setNewPassword] = useState('');

  // Update fields if user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
      setNewPassword('');
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const response = await fetch('http://192.168.6.181:5000/api/update/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, name, role, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        onUpdate?.(data.user); // Update auth context
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

export default AdminUserAccountUpdateModal;

const styles = StyleSheet.create({
  ...MODALS_STYLES,
  ...BUTTON_STYLES,
  ...CLOSE_BUTTON_STYLES
});
