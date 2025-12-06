import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, error && styles.labelError]}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        placeholderTextColor="#A6A0C8"
        {...props}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const PURPLE = '#7B61FF';
const LIGHT_BG = '#FAF9FF';

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1D1033',
  },

  labelError: {
    color: '#DC2626',
  },

  input: {
    borderWidth: 1.6,
    borderColor: '#E2DBFF',
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1D1033',

    shadowColor: '#9986FF',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF5F5',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
});
