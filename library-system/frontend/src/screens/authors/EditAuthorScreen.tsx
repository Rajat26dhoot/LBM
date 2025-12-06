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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthorsStackParamList, Author } from '../../types';
import { authorsApi } from '../../api/authors.api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDateForInput } from '../../utils/dateFormatter';
import { PencilLine, UserRound } from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthorsStackParamList, 'EditAuthor'>;

export const EditAuthorScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [author, setAuthor] = useState<Author | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadAuthor();
  }, [id]);

  const loadAuthor = async () => {
    try {
      const data = await authorsApi.getById(id);
      setAuthor(data);
      setName(data.name);
      setBio(data.bio || '');
      setBirthDate(data.birthDate ? formatDateForInput(data.birthDate) : '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load author');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter author name');
      return;
    }

    setSaveLoading(true);
    try {
      await authorsApi.update(id, {
        name,
        bio: bio || undefined,
        birthDate: birthDate || undefined,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update author');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!author) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.iconAvatar}>
              <UserRound size={22} color={PURPLE} />
            </View>
            <View style={styles.headerTextWrapper}>
              <Text style={styles.title}>Edit Author</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                Updating {author.name}
              </Text>
            </View>
            <View style={styles.iconEdit}>
              <PencilLine size={18} color={PURPLE} />
            </View>
          </View>

          <Input
            label="Name *"
            value={name}
            onChangeText={setName}
            placeholder="Enter author name"
          />

          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Enter author biography"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Input
            label="Birth Date (YYYY-MM-DD)"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="1965-07-31"
          />

          <View style={styles.buttonWrapper}>
            <Button
              title="Update Author"
              onPress={handleUpdate}
              loading={saveLoading}
            />
          </View>
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
  scrollContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconAvatar: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#ECE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTextWrapper: {
    flex: 1,
  },
  iconEdit: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#F2ECFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: PURPLE,
  },
  subtitle: {
    fontSize: 12,
    color: '#7A7493',
    marginTop: 2,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  buttonWrapper: {
    marginTop: 12,
  },
});
