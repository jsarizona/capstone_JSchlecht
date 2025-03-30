import { StyleSheet } from 'react-native';

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
      input: {
        width: '100%',
        height: 50,
        borderColor: '#808080',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
      },
});