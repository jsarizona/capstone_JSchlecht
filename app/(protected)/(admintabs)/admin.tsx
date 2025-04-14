import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AdminUserAccountUpdateModal from '../../../modals/AdminUserAccountUpdateModal'; // Import the modal
import { useAuth } from '@/context/AuthContext';
import { BUTTON_STYLES } from '@/constants/Buttons';
import CustomServer from '@/constants/CustomServer'
export default function AdminScreen() {
  const { authState } = useAuth();
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for updates

  useEffect(() => {
    CustomServer
      .post('/api/users/getusers')  // Fetch users
      .then((response) => {
        const filteredUsers = response.data.filter((user) => user.email !== authState?.user?.email); // Filter out the current user
        setUsers(filteredUsers);
      })
      .catch((error) => console.error(error));
  }, [authState?.user?.email]); // Re-run effect when authState changes

  // Open the modal and set the selected user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Admin Section
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Manage the Users Below
      </ThemedText>
      
      {/* Adjust FlatList to display two boxes per row */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ThemedView style={styles.userItem}>
            <Text style={styles.userName}>ID: {item._id}</Text>
            <Text style={styles.userName}>Name: {item.name}</Text>
            <Text style={styles.userEmail}>Email: {item.email}</Text>
            <Text style={styles.userRole}>Role: {item.role}</Text>
            {/* Add Edit Button */}
            <TouchableOpacity 
              style={[styles.button, { width: "auto"}]}
              onPress={() => handleEdit(item)}>
              <ThemedText style={styles.buttonText}>Edit</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
        numColumns={2} // Display 2 items per row
        contentContainerStyle={styles.listContainer} // Add space between items
      />
      
      {/* User Account Update Modal */}
      {selectedUser && (
        <AdminUserAccountUpdateModal 
          visible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
          user={selectedUser} // Pass the selected user to the modal
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  listContainer: {  
    justifyContent: 'center', // Space items evenly
  },
  userItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '48%', // Each item takes up 48% of the width
    marginHorizontal: '1%', // To add some space between items
  },
  ...BUTTON_STYLES
});
