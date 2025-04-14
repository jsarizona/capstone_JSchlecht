import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CLOSE_BUTTON_STYLES } from '@/constants/Close_Buttons';
import { MODALS_STYLES } from '@/constants/Modals';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface AlertContextType {
  showAlert: (title: string, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useCustomAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useCustomAlert must be used within a CustomAlertProvider');
  }
  return context;
};

export const CustomAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const onClose = () => setAlertVisible(false);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal animationType="fade" transparent={true} visible={alertVisible} onRequestClose={onClose}>
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type='title'>{alertTitle}</ThemedText>
            <ThemedText type='subtitle'>{alertMessage}</ThemedText>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  ...MODALS_STYLES,
  ...CLOSE_BUTTON_STYLES,
});
