import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Book } from '../types';
import { BookOpen } from 'lucide-react-native';

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <BookOpen size={26} color="#7B61FF" />
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {book.title}
            </Text>

            <View
              style={[
                styles.badge,
                isAvailable ? styles.badgeAvailable : styles.badgeUnavailable,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isAvailable ? styles.badgeTextAvailable : styles.badgeTextUnavailable,
                ]}
              >
                {isAvailable ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <Text style={styles.author} numberOfLines={1}>
            by {book.author.name}
          </Text>

          <Text style={styles.isbn} numberOfLines={1}>
            ISBN • {book.isbn}
          </Text>

          {book.description && (
            <Text style={styles.description} numberOfLines={2}>
              {book.description}
            </Text>
          )}

          <Text style={styles.copies}>
            {book.availableCopies} / {book.totalCopies} copies available
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PURPLE = '#7B61FF';
const GREEN = '#0E9F6E';
const RED = '#DC2626';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1033',
    flexShrink: 1,
  },

  author: {
    fontSize: 14,
    color: '#7A7493',
    marginBottom: 2,
  },

  isbn: {
    fontSize: 12,
    color: '#A29CC3',
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: '#625A79',
    marginBottom: 6,
    lineHeight: 19,
  },

  copies: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  badgeAvailable: {
    backgroundColor: '#D1FAE5',
  },
  badgeUnavailable: {
    backgroundColor: '#FECACA',
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },

  badgeTextAvailable: {
    color: GREEN,
  },
  badgeTextUnavailable: {
    color: RED,
  },
});
