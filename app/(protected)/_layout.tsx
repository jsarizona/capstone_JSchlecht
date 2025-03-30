import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Role, useAuth } from '../../context/AuthContext';

const DrawerLayout = () => {
	const { authState } = useAuth();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer>
				<Drawer.Screen
					name="index"
					options={{
						headerTitle: 'Home',
						drawerLabel: 'Home',
						drawerIcon: ({ size, color }) => (
							<Ionicons name="home-outline" size={size} color={color} />
						)
					}}
					redirect={authState?.authenticated === null}
				/>

				<Drawer.Screen
					name="news"
					options={{
						headerTitle: 'Newsfeed',
						drawerLabel: 'News',
						drawerIcon: ({ size, color }) => (
							<Ionicons name="newspaper-outline" size={size} color={color} />
						)
					}}
					//All Authenticated Users
					redirect={authState?.authenticated !== true}
				/>
				<Drawer.Screen
					name="schedule"
					options={{
						headerTitle: 'ScheduleView',
						drawerLabel: 'Schedule',
						drawerIcon: ({ size, color }) => (
							<Ionicons name="newspaper-outline" size={size} color={color} />
						)
					}}
					//User Only
					redirect={authState?.user?.role !== Role.USER}
				/>
				<Drawer.Screen
					name="(admintabs)"
					options={{
						headerTitle: 'Admin Area',
						drawerLabel: 'Admin',
						drawerIcon: ({ size, color }) => (
							<Ionicons name="cog-outline" size={size} color={color} />
						)
					}}
					//Admin Only
					redirect={authState?.user?.role !== Role.ADMIN}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
};

export default DrawerLayout;