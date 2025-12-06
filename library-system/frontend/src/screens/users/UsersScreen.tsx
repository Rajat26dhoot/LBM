import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UsersStackParamList, User } from '../../types';
import { usersApi } from '../../api/users.api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { User as UserIcon } from 'lucide-react-native';

type Props = NativeStackScreenProps<UsersStackParamList, 'UsersList'>;

export const UsersScreen: React.FC<Props> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Users List</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.iconWrapper}>
              <UserIcon size={26} color="#7B61FF" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadUsers}
      />
    </View>
  );
};

const PURPLE = '#7B61FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FF',
    paddingTop: 20,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 20,
  },

  list: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1033',
    marginBottom: 2,
  },

  userEmail: {
    fontSize: 13,
    color: '#7A7493',
    fontWeight: '500',
  },
});
