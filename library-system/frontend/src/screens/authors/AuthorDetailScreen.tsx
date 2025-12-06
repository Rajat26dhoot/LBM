import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthorsStackParamList, Author } from '../../types';
import { authorsApi } from '../../api/authors.api';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/dateFormatter';
import { UserRound, BookOpen } from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthorsStackParamList, 'AuthorDetail'>;

export const AuthorDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadAuthor();
  }, [id]);

  const loadAuthor = async () => {
    try {
      const data = await authorsApi.getById(id);
      setAuthor(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load author');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Author',
      'Are you sure? This will also delete all books by this author.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              await authorsApi.delete(id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete author');
            } finally {
              setDeleteLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingSpinner />;
  if (!author) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* HERO CARD */}
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <UserRound size={30} color={PURPLE} />
        </View>

        <Text style={styles.name}>{author.name}</Text>

        {author.birthDate && (
          <Text style={styles.date}>
            Born: <Text style={styles.dateValue}>{formatDate(author.birthDate)}</Text>
          </Text>
        )}

        {author.bio && <Text style={styles.bio}>{author.bio}</Text>}
      </View>

      {/* BOOKS SECTION */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <BookOpen size={18} color={PURPLE} />
          </View>
          <Text style={styles.sectionTitle}>Books by this author</Text>
          {author.books && author.books.length > 0 && (
            <Text style={styles.badgeCount}>{author.books.length}</Text>
          )}
        </View>

        {author.books && author.books.length > 0 ? (
          author.books.map((book) => (
            <View key={book.id} style={styles.bookItem}>
              <Text style={styles.bookTitle} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={styles.bookIsbn} numberOfLines={1}>
                ISBN • {book.isbn}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noBooks}>No books yet</Text>
        )}
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button
            title="Edit Author"
            onPress={() => navigation.navigate('EditAuthor', { id })}
            variant="primary"
          />
        </View>
        <View style={styles.actionButton}>
          <Button
            title="Delete Author"
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
    padding: 18,
    marginBottom: 18,
    alignItems: 'flex-start',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1033',
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: '#7A7493',
    marginBottom: 10,
  },
  dateValue: {
    fontWeight: '600',
  },
  bio: {
    fontSize: 14,
    color: '#4B445C',
    lineHeight: 22,
  },

  // SECTION
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F2ECFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PURPLE,
    flex: 1,
  },
  badgeCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7A7493',
  },
  bookItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECFF',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1033',
    marginBottom: 2,
  },
  bookIsbn: {
    fontSize: 12,
    color: '#9C97B7',
  },
  noBooks: {
    fontSize: 13,
    color: '#9C97B7',
    fontStyle: 'italic',
  },

  // ACTIONS
  actions: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 10,
  },
});
