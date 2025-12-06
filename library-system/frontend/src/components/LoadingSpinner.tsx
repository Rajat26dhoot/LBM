import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export const LoadingSpinner: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={PURPLE} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const PURPLE = '#7B61FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4FF', // matching screens
    paddingBottom: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: PURPLE,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
