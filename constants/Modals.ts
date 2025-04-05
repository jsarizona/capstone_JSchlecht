import { StyleSheet } from 'react-native';
import { INPUTS_STYLES } from './Inputs';

export const MODALS_STYLES = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
      },
      ...INPUTS_STYLES,
});