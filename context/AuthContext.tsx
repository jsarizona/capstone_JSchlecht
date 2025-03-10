import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum Role {
	ADMIN = 'admin',
	USER = 'user'
}

interface userData {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthProps {
  authState: { authenticated: boolean | null; user: userData | null };
  onLogin: (token: string, userData: userData) => void;
  onLogout: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ authenticated: boolean | null; user: userData | null }>({
    authenticated: null,
    user: null,
  });


  const login = async (token: string, userData: userData) => {
    try {
      await AsyncStorage.setItem('authToken', token);

      // Update the authState
      setAuthState({
        authenticated: true,
        user: userData,
      });

      console.log("User logged in:", userData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authState');

      // Reset auth state
      setAuthState({
        authenticated: false,
        user: null,
      });

      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
		onLogin: login,
		onLogout: logout,
		authState
	};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
