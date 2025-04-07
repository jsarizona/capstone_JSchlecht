import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

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
  authState: { authenticated: boolean | null; user: userData | null; token: string | null };
  onLogin: (token: string, userData: userData) => void;
  onLogout: () => void;
  onUpdate: (updatedUser: userData) => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ authenticated: boolean | null; user: userData | null; token: string | null }>({
    authenticated: null,
    user: null,
    token: null
  });

  // Load auth state on app start
  useEffect(() => {
    
    const loadAuthState = async () => {
      try {
        const storedAuthToken = await AsyncStorage.getItem('authToken');
        const storedAuthState = await AsyncStorage.getItem('authState');
        if (storedAuthState && storedAuthToken) {
          console.log("found storedAuthState and Token", storedAuthState)
          setAuthState({
            ...JSON.parse(storedAuthState),
            token: storedAuthToken,
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      }
    };

    loadAuthState();
  }, []);

  // Login function
  const login = async (token: string, userData: userData) => {
    try {
      const newState = {
        authenticated: true,
        user: userData,
        token
      };

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('authState', JSON.stringify(newState));

      setAuthState(newState);

      console.log("User logged in:", userData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authState');
      
      setAuthState({
        authenticated: false,
        user: null,
        token: null
      });

      console.log('User logged out');
      
    } catch (error) {
      console.error('Logout error:', error);
    }
    
  };
  
  const updateUser = async (updatedUser: userData) => {
    try {
      const newState = {
        ...authState,
        user: updatedUser
      };
  
      await AsyncStorage.setItem('authState', JSON.stringify(newState));
      setAuthState(newState);
  
      console.log("User info updated:", updatedUser);
    } catch (error) {
      console.error("Failed to update user in context:", error);
    }
  };
  const value = {
    onLogin: login,
    onLogout: logout,
    onUpdate: updateUser,
    authState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
