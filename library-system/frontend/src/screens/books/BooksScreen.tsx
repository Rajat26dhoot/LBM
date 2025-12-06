import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BooksStackParamList, Book } from '../../types';
import { booksApi } from '../../api/books.api';
import { BookCard } from '../../components/BookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Search, PlusCircle } from 'lucide-react-native';

type Props = NativeStackScreenProps<BooksStackParamList, 'BooksList'>;

export const BooksScreen: React.FC<Props> = ({ navigation }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availableFilter, setAvailableFilter] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    loadBooks();
  }, [search, availableFilter]);

  const loadBooks = async () => {
    try {
      const data = await booksApi.getAll({
        search: search || undefined,
        available: availableFilter,
      });
      setBooks(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  if (loading && books.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>

      <Text style={styles.pageTitle}>Books</Text>

      {/* SEARCH INPUT */}
      <View style={styles.searchBox}>
        <Search size={20} color="#7A7493" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          placeholderTextColor="#A6A0C8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* FILTER BUTTONS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            availableFilter === undefined && styles.filterChipActive,
          ]}
          onPress={() => setAvailableFilter(undefined)}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            availableFilter === true && styles.filterChipActive,
          ]}
          onPress={() => setAvailableFilter(true)}
        >
          <Text style={styles.filterText}>Available</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            availableFilter === false && styles.filterChipActive,
          ]}
          onPress={() => setAvailableFilter(false)}
        >
          <Text style={styles.filterText}>Unavailable</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => navigation.navigate('BookDetail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadBooks}
      />

      {/* Floating ADD BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateBook')}
      >
        <PlusCircle size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const PURPLE = '#7B61FF';
const LIGHT_BG = '#F7F4FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    paddingTop: 24,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 14,
  },

  searchBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#282434',
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },

  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#ECE5FF',
    borderRadius: 20,
  },

  filterChipActive: {
    backgroundColor: PURPLE,
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },

  list: {
    paddingBottom: 80,
    paddingHorizontal: 16,
    gap: 10,
  },

  fab: {
    position: 'absolute',
    bottom: 26,
    right: 26,
    backgroundColor: PURPLE,
    borderRadius: 40,
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: PURPLE,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
