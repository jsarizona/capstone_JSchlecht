import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Stack, useRouter, useSegments} from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { CustomAlertProvider } from '@/modals/CustomAlertModal';


const StackLayout = () => {
	const { authState } = useAuth();
	const router = useRouter();
	const segments = useSegments();
	
	useEffect(() => {
		const inAuthGroup = segments[0] === '(protected)';
	  
		if (!authState?.authenticated && inAuthGroup) {
		  router.replace('/index');
		} else if (authState?.authenticated && !authState?.pinVerified) {
		  router.replace('/(pin)'); // <- this should be a screen that shows your PinModal or page
		} else if (authState?.authenticated && authState?.pinVerified) {
		  router.replace('/(protected)');
		}
	  }, [authState]);

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="(pin)" options={{ headerShown: false }} />
			<Stack.Screen name="(protected)" options={{ headerShown: false }} />
		</Stack>
	);
};

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
	return (
		<AuthProvider>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<CustomAlertProvider>
			
					<StackLayout/>
			
			</CustomAlertProvider>
			</ThemeProvider>
		</AuthProvider>
	);
};

export default RootLayoutNav;