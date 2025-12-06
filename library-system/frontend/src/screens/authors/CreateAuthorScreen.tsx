import React, { useState } from 'react';
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
import { AuthorsStackParamList } from '../../types';
import { authorsApi } from '../../api/authors.api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { UserPlus2 } from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthorsStackParamList, 'CreateAuthor'>;

export const CreateAuthorScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter author name');
      return;
    }

    setLoading(true);
    try {
      await authorsApi.create({
        name,
        bio: bio || undefined,
        birthDate: birthDate || undefined,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create author');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.iconContainer}>
              <UserPlus2 size={26} color={PURPLE} />
            </View>
            <Text style={styles.title}>Add New Author</Text>
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
            <Button title="Create Author" onPress={handleCreate} loading={loading} />
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
    marginBottom: 16,
    columnGap: 10,
  },

  iconContainer: {
    backgroundColor: '#ECE5FF',
    padding: 10,
    borderRadius: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: PURPLE,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  buttonWrapper: {
    marginTop: 12,
  },
});
