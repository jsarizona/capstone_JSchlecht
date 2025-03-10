import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const Page = () => {
	const { authState, onLogout } = useAuth();

	const onLogoutPressed = () => {
		onLogout!();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Home</Text>
			<Text style={styles.title}>Role: {authState?.user?.role}</Text>
			<Button title="Logout" onPress={onLogoutPressed} />
			<View style={styles.separator} />
		</View>
	);
};

export default Page;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	separator: {
		height: 1,
		marginVertical: 30,
		width: '80%'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	}
});