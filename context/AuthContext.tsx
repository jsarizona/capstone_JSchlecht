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
  emailVerified: boolean;
}

interface AuthProps {
  authState: {
    authenticated: boolean | null;
    user: userData | null;
    token: string | null;
    pinVerified: boolean | null;
  }
  onLogin: (token: string, userData: userData, pin?: string) => void;
  onLogout: () => void;
  onUpdate: (updatedUser: userData) => void;
  onVerify: () => void;
  onVerifyEmail: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{
    authenticated: boolean | null;
    user: userData | null;
    token: string | null;
    pinVerified:  boolean | null;
  }>({
    authenticated: false,
    user: null,
    token: null,
    pinVerified: false,
  });

  // Load auth state on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedAuthToken = await AsyncStorage.getItem('authToken');
        const storedAuthState = await AsyncStorage.getItem('authState');
        const storedAuthPin = await AsyncStorage.getItem('authPin')
        if (storedAuthState && storedAuthToken && storedAuthPin) {
          const parsed = JSON.parse(storedAuthState);
          console.log("In Load Auth State")
          console.log(storedAuthPin)
          console.log(parsed)
          setAuthState({
            ...parsed,
            token: storedAuthToken,
            pinVerified: false, // maybe true if you want to persist it
            emailVerified: parsed.emailVerified || false,
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      }
    };

    loadAuthState();
  }, []);

  // Login function
const login = async (token: string, userData: userData, pin?: string) => {
  try {
    const newState = {
      authenticated: true,
      user: userData,
      token,
      pinVerified: true,
    };

    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('authState', JSON.stringify(newState));
    await AsyncStorage.setItem('authPin', pin || '');
    setAuthState(newState);

    console.log("(In Login Auth Context) User logged in:", userData, "PIN:", pin);
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
        token: null,
        pinVerified: false,
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
  
      console.log("User info updated");
    } catch (error) {
      console.error("Failed to update user in context:", error);
    }
  };
  
  const verifyEmail = async () => {
    try {
      const newState = {
        ...authState,
        emailVerified: true,
      };
  
      await AsyncStorage.setItem('authState', JSON.stringify(newState));
      setAuthState(newState);
  
      console.log("Email verified");
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    onUpdate: updateUser,
    onVerifyEmail: verifyEmail,
    authState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
