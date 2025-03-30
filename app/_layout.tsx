import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Stack, useRouter, useSegments} from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';



const StackLayout = () => {
	const { authState } = useAuth();
	const router = useRouter();
	const segments = useSegments();
	
	useEffect(() => {

		const inAuthGroup = segments[0] === '(protected)';

		if (!authState?.authenticated && inAuthGroup) {
			console.log("not auth using replace /", authState?.authenticated)
			router.replace("/index");
		} else if (authState?.authenticated === true) {
			console.log("Auth using /(protected))", authState?.authenticated)
			router.replace("/(protected)");
		}
	}, [authState]);

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="(protected)" options={{ headerShown: false }} />
		</Stack>
	);
};

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
	return (
		<AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<StackLayout/>
      </ThemeProvider>
		</AuthProvider>
	);
};

export default RootLayoutNav;