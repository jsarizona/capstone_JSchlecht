import { Button, StyleSheet, Text, View } from 'react-native';
import { Role, useAuth } from '../../context/AuthContext';
import WithRole from '@/components/WithRole';

const Page = () => {
	const { authState, onLogout } = useAuth();

	const onLogoutPressed = () => {
		onLogout!();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Home</Text>
			<WithRole role={Role.ADMIN && Role.USER}>
				<Text style={styles.title}>Role: {authState?.user?.role}</Text>
				<Button title="Logout" onPress={onLogoutPressed} />
			</WithRole>
			
			<View style={styles.separator} />
		</View>
	);
};

export default Page;

const styles = StyleSheet.create({
	link: {
		marginTop: 15,
		paddingVertical: 15,
	  },
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