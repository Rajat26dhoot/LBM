import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BooksStackParamList, Book, Author } from '../../types';
import { booksApi } from '../../api/books.api';
import { authorsApi } from '../../api/authors.api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDateForInput } from '../../utils/dateFormatter';
import { PencilLine, User as UserIcon } from 'lucide-react-native';

type Props = NativeStackScreenProps<BooksStackParamList, 'EditBook'>;

export const EditBookScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [availableCopies, setAvailableCopies] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [bookData, authorsData] = await Promise.all([
        booksApi.getById(id),
        authorsApi.getAll(),
      ]);

      setBook(bookData);
      setTitle(bookData.title);
      setIsbn(bookData.isbn);
      setDescription(bookData.description || '');
      setPublishedDate(
        bookData.publishedDate ? formatDateForInput(bookData.publishedDate) : '',
      );
      setTotalCopies(bookData.totalCopies.toString());
      setAvailableCopies(bookData.availableCopies.toString());
      setAuthorId(bookData.authorId);
      setAuthors(authorsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load book');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !isbn || !authorId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const total = parseInt(totalCopies);
    const available = parseInt(availableCopies);

    if (isNaN(total) || isNaN(available) || total < 1 || available < 0 || available > total) {
      Alert.alert('Error', 'Invalid copy numbers');
      return;
    }

    setSaveLoading(true);
    try {
      await booksApi.update(id, {
        title,
        isbn,
        description: description || undefined,
        publishedDate: publishedDate || undefined,
        totalCopies: total,
        availableCopies: available,
        authorId,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update book');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header / Hero */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <PencilLine size={26} color={PURPLE} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Edit Book</Text>
            <Text style={styles.headerSubtitle}>
              Update details for “{book.title}”
            </Text>
          </View>
        </View>

        {/* Card with form fields */}
        <View style={styles.card}>
          <Input
            label="Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
          />

          <Input
            label="ISBN *"
            value={isbn}
            onChangeText={setIsbn}
            placeholder="978-0000000000"
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter book description"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Input
            label="Published Date (YYYY-MM-DD)"
            value={publishedDate}
            onChangeText={setPublishedDate}
            placeholder="1997-06-26"
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Input
                label="Total Copies *"
                value={totalCopies}
                onChangeText={setTotalCopies}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.rowItem}>
              <Input
                label="Available Copies *"
                value={availableCopies}
                onChangeText={setAvailableCopies}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Author Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>
              <Text>Author </Text>
              <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.pickerHeader}>
              <View style={styles.pickerIcon}>
                <UserIcon size={18} color={PURPLE} />
              </View>
              <Text style={styles.pickerHint}>Choose a new author if needed</Text>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={authorId}
                onValueChange={(value) => setAuthorId(value)}
                style={styles.picker}
                dropdownIconColor={PURPLE}
              >
                {authors.map((author) => (
                  <Picker.Item key={author.id} label={author.name} value={author.id} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Update Book"
            onPress={handleUpdate}
            loading={saveLoading}
          />
        </View>
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
  content: {
    padding: 20,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1033',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7A7493',
    marginTop: 2,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },

  pickerContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1D1033',
  },
  required: {
    color: '#DC2626',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  pickerIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F2ECFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerHint: {
    fontSize: 12,
    color: '#7A7493',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E0D8FF',
    borderRadius: 12,
    backgroundColor: '#FAF9FF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },

  buttonWrapper: {
    marginTop: 16,
  },
});
