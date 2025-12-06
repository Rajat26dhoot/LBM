import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'secondary' ? PURPLE : '#fff'} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'secondary' && styles.secondaryText,
            variant === 'danger' && styles.dangerText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const PURPLE = '#7B61FF';
const DARK_PURPLE = '#4E32BD';
const LIGHT_PURPLE = '#ECE5FF';
const SOFT_RED = '#FECACA';

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  primary: {
    backgroundColor: PURPLE,
  },

  secondary: {
    backgroundColor: LIGHT_PURPLE,
    borderWidth: 2,
    borderColor: PURPLE,
  },

  danger: {
    backgroundColor: SOFT_RED,
    borderWidth: 1.6,
    borderColor: '#DC2626',
  },

  disabled: {
    opacity: 0.6,
  },

  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  secondaryText: {
    color: PURPLE,
  },

  dangerText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
});
