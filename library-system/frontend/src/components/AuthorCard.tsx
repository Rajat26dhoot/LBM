import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Author } from '../types';
import { formatDate } from '../utils/dateFormatter';
import { UserRound } from 'lucide-react-native';

interface AuthorCardProps {
  author: Author;
  onPress: () => void;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.iconWrapper}>
          <UserRound size={26} color="#7B61FF" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{author.name}</Text>

          {author.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {author.bio}
            </Text>
          )}

          {author.birthDate && (
            <Text style={styles.subInfo}>Born: {formatDate(author.birthDate)}</Text>
          )}

          {author.books && (
            <Text style={styles.bookCount}>{author.books.length} books published</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PURPLE = '#7B61FF';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1033',
    marginBottom: 3,
  },

  bio: {
    fontSize: 13,
    fontWeight: '400',
    color: '#7A7493',
    lineHeight: 18,
    marginBottom: 4,
  },

  subInfo: {
    fontSize: 12,
    color: '#9C97B7',
    marginBottom: 4,
  },

  bookCount: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },
});
