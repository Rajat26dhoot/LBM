import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BooksStackParamList, Author } from '../../types';
import { booksApi } from '../../api/books.api';
import { authorsApi } from '../../api/authors.api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BookPlus, User as UserIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<BooksStackParamList, 'CreateBook'>;

export const CreateBookScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalCopies, setTotalCopies] = useState('1');
  const [availableCopies, setAvailableCopies] = useState('1');
  const [authorId, setAuthorId] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const data = await authorsApi.getAll();
      setAuthors(data);
      if (data.length > 0) {
        setAuthorId(data[0].id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load authors');
    } finally {
      setLoadingAuthors(false);
    }
  };

  const handleCreate = async () => {
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

    setLoading(true);
    try {
      await booksApi.create({
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
      Alert.alert('Error', 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuthors) return <LoadingSpinner />;

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
            <BookPlus size={26} color={PURPLE} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Create New Book</Text>
            <Text style={styles.headerSubtitle}>Add a title to your library</Text>
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

          {/* Date Picker for Published Date */}
          {/* Touchable date input for Published Date */}
          {/* Published Date Picker - Touchable */}
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <View pointerEvents="none">
                <Input
                  label="Published Date"
                  value={publishedDate}
                  placeholder="YYYY-MM-DD"
                  editable={false}
                />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={publishedDate ? new Date(publishedDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    const formatted = date.toISOString().slice(0, 10);
                    setPublishedDate(formatted);
                  }
                }}
              />
            )}
          </View>

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
              <Text style={styles.pickerHint}>
                Choose an author from your list
              </Text>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={authorId}
                onValueChange={(value) => setAuthorId(value)}
                style={styles.picker}
                dropdownIconColor={PURPLE}
              >
                {authors.map((author) => (
                  <Picker.Item
                    key={author.id}
                    label={author.name}
                    value={author.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Create Book" onPress={handleCreate} loading={loading} />
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
    backgroundColor: '#FAF9FF',
    borderRadius: 12,
    borderColor: '#E2DBFF',
    borderWidth: 1.6,
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
