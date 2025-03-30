import { StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useAuth } from '../../context/AuthContext';
import { BUTTON_STYLES } from '@/constants/Buttons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';


const Page = () => {
	const { authState, onLogout } = useAuth();
	const [modalVisible, setModalVisible] = useState(false);
	const onLogoutPressed = () => {		
		onLogout!();
	};
	const onUpdatePressed = () => {}

	return (
		<ParallaxScrollView
			  headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			  headerImage={
				<Image source={require('@/assets/images/Logo-no-background.png')} style={styles.headerImage} />}>
			<ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Welcome Back!</ThemedText>
		
        

        <TouchableOpacity style={styles.button} onPress={onLogoutPressed}>
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <ThemedText style={styles.buttonText}>Update Account Info</ThemedText>
        </TouchableOpacity>

      </ThemedView>
	</ParallaxScrollView>
		

		
	);
};

export default Page;

const styles = StyleSheet.create({
	container: { paddingHorizontal: 100, alignItems: 'center', gap: 10 },
	headerImage: { alignSelf: 'center', marginTop: 40, height: 225, width: 430 },
	title: { fontSize: 24, fontWeight: 'bold' },
	...BUTTON_STYLES,
	
});