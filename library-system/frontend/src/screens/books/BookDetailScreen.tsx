import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BooksStackParamList, Book } from '../../types';
import { booksApi } from '../../api/books.api';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/dateFormatter';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  CalendarDays,
  Info,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<BooksStackParamList, 'BookDetail'>;

export const BookDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      const data = await booksApi.getById(id);
      setBook(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load book');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Book', 'Are you sure you want to delete this book?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleteLoading(true);
          try {
            await booksApi.delete(id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete book');
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* HERO CARD */}
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <BookOpen size={28} color="#7B61FF" />
        </View>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author.name}</Text>
        <Text style={styles.isbn}>ISBN • {book.isbn}</Text>

        <View
          style={[
            styles.badge,
            isAvailable ? styles.badgeAvailable : styles.badgeUnavailable,
          ]}
        >
          {isAvailable ? (
            <CheckCircle2 size={16} color="#0E9F6E" />
          ) : (
            <XCircle size={16} color="#DC2626" />
          )}
          <Text
            style={[
              styles.badgeText,
              isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable,
            ]}
          >
            {isAvailable ? 'Available' : 'Not Available'}
          </Text>
        </View>

        {book.publishedDate && (
          <View style={styles.metaRow}>
            <CalendarDays size={18} color="#7A7493" />
            <Text style={styles.metaText}>
              Published: {formatDate(book.publishedDate)}
            </Text>
          </View>
        )}
      </View>

      {/* DESCRIPTION CARD */}
      {book.description && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#7B61FF" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.description}>{book.description}</Text>
        </View>
      )}

      {/* AVAILABILITY CARD */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Layers size={18} color="#7B61FF" />
          <Text style={styles.sectionTitle}>Availability</Text>
        </View>
        <Text style={styles.copies}>
          {book.availableCopies} of {book.totalCopies} copies available
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        {isAvailable && user && (
          <View style={styles.actionButton}>
            <Button
              title="Borrow This Book"
              onPress={() => navigation.navigate('BorrowBook', { bookId: book.id })}
              variant="primary"
            />
          </View>
        )}

        <View style={styles.actionButton}>
          <Button
            title="Edit Book"
            onPress={() => navigation.navigate('EditBook', { id })}
            variant="secondary"
          />
        </View>

        <View style={styles.actionButton}>
          <Button
            title="Delete Book"
            onPress={handleDelete}
            variant="danger"
            loading={deleteLoading}
          />
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 32,
  },

  // HERO
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1033',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#7A7493',
    marginBottom: 4,
  },
  isbn: {
    fontSize: 13,
    color: '#A29CC3',
    marginBottom: 10,
  },

  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
    marginBottom: 8,
    gap: 6,
  },
  badgeAvailable: {
    backgroundColor: '#DCFCE7',
  },
  badgeUnavailable: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextAvailable: {
    color: '#166534',
  },
  badgeTextUnavailable: {
    color: '#B91C1C',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#7A7493',
  },

  // SECTIONS
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PURPLE,
  },
  description: {
    fontSize: 14,
    color: '#4B445C',
    lineHeight: 22,
  },
  copies: {
    fontSize: 15,
    color: '#4B445C',
  },

  // ACTIONS
  actions: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
});
