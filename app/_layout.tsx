import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Stack, useRouter} from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';



const StackLayout = () => {
	const { authState } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!authState?.authenticated) {
			console.log("not auth using replace /", authState?.authenticated)
			router.replace('/');
		} else if (authState?.authenticated === true) {
			console.log("Auth using (tabs)/home) /", authState?.authenticated)
			router.replace("/(tabs)/home");
		}
	}, [authState]);

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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