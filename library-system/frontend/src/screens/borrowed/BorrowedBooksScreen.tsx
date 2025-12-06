import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BorrowedStackParamList, BorrowedBook } from '../../types';
import { borrowedBooksApi } from '../../api/borrowedBooks.api';
import { BorrowedBookCard } from '../../components/BorrowedBookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { BookOpenCheck } from 'lucide-react-native';

type Props = NativeStackScreenProps<BorrowedStackParamList, 'BorrowedList'>;

export const BorrowedBooksScreen: React.FC<Props> = () => {
  const { user } = useAuth();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBorrowedBooks();
    }
  }, [user]);

  const loadBorrowedBooks = async () => {
    if (!user) return;
    try {
      const data = await borrowedBooksApi.getByUser(user.id);
      setBorrowedBooks(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id: string) => {
    setReturningId(id);
    try {
      await borrowedBooksApi.return(id);
      await loadBorrowedBooks();
      Alert.alert('Success', 'Book returned successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Borrowed Books</Text>

      {/* Empty State */}
      {borrowedBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconBox}>
            <BookOpenCheck size={40} color={PURPLE} />
          </View>
          <Text style={styles.emptyText}>No borrowed books yet</Text>
          <Text style={styles.subtitle}>
            Borrow a book to see it listed here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BorrowedBookCard
              borrowedBook={item}
              onReturn={() => handleReturn(item.id)}
              loading={returningId === item.id}
            />
          )}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadBorrowedBooks}
        />
      )}
    </View>
  );
};

const PURPLE = '#7B61FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FF',
    paddingTop: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 8,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 26,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: PURPLE,
  },

  subtitle: {
    fontSize: 14,
    color: '#9187A8',
    marginTop: 4,
    textAlign: 'center',
  },
});
