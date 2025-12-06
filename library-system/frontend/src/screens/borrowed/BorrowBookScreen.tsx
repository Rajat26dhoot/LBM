import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BooksStackParamList, Book } from '../../types';
import { booksApi } from '../../api/books.api';
import { borrowedBooksApi } from '../../api/borrowedBooks.api';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, BookOpen } from 'lucide-react-native';

type Props = NativeStackScreenProps<BooksStackParamList, 'BorrowBook'>;

export const BorrowBookScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      const data = await booksApi.getById(bookId);
      setBook(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load book');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user || !book) return;

    setBorrowing(true);
    try {
      await borrowedBooksApi.borrow({
        bookId: book.id,
        userId: user.id,
      });
      Alert.alert('Success', 'Book borrowed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.title}>Borrow Book</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBadge}>
              <BookOpen color={PURPLE} size={26} />
            </View>

            <View style={styles.flex}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookSubtitle}>by {book.author.name}</Text>
              <Text style={styles.bookMeta}>ISBN • {book.isbn}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CalendarDays size={20} color={PURPLE} />
            <Text style={styles.sectionTitle}>Borrowing Terms</Text>
          </View>

          <Text style={styles.term}>✔ Loan period: 14 days</Text>
          <Text style={styles.term}>✔ Please return the book on time</Text>
          <Text style={styles.term}>✔ Late returns may incur penalties</Text>
        </View>

        <View
          style={[
            styles.availabilityBox,
            book.availableCopies > 0 ? styles.available : styles.unavailable,
          ]}
        >
          <Text style={styles.availabilityText}>
            {book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'} available
          </Text>
        </View>

        <Button
          title="Confirm Borrow"
          onPress={handleBorrow}
          loading={borrowing}
          disabled={book.availableCopies === 0}
        />
        <Button title="Cancel" onPress={() => navigation.goBack()} variant="secondary" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const PURPLE = '#7B61FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: PURPLE,
    marginBottom: 16,
    textAlign: 'center',
  },

  // Main Book Card
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 22,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: { flex: 1 },

  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  bookTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D1033',
    marginBottom: 2,
  },
  bookSubtitle: {
    fontSize: 15,
    color: '#8882A6',
  },
  bookMeta: {
    fontSize: 12,
    color: '#AAA5C9',
    marginTop: 2,
  },

  // Terms Section
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: PURPLE,
  },
  term: {
    fontSize: 14,
    color: '#4B445C',
    marginBottom: 6,
  },

  // Availability Badge
  availabilityBox: {
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  available: {
    backgroundColor: '#D1FAE5',
  },
  unavailable: {
    backgroundColor: '#FECACA',
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1033',
  },
});
