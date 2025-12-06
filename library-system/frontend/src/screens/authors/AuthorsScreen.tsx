import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthorsStackParamList, Author } from '../../types';
import { authorsApi } from '../../api/authors.api';
import { AuthorCard } from '../../components/AuthorCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { UserPlus2 } from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthorsStackParamList, 'AuthorsList'>;

export const AuthorsScreen: React.FC<Props> = ({ navigation }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const data = await authorsApi.getAll();
      setAuthors(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Authors</Text>

      <FlatList
        data={authors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AuthorCard
            author={item}
            onPress={() => navigation.navigate('AuthorDetail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadAuthors}
      />

      {/* Floating Add Author Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateAuthor')}
        activeOpacity={0.8}
      >
        <UserPlus2 size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const PURPLE = '#7B61FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FF',
    paddingTop: 24,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 14,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 26,
    right: 26,
    width: 58,
    height: 58,
    borderRadius: 40,
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: PURPLE,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
