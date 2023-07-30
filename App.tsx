import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, LogBox } from 'react-native';
import NewsWidget from './components/NewsSection';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Ignore specific warnings related to new NativeEventEmitter
    LogBox.ignoreLogs([
      'new NativeEventEmitter() was called with a non-null argument without the required addListener method.',
      'new NativeEventEmitter() was called with a non-null argument without the required removeListeners method.',
    ]);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <NewsWidget isDarkMode={isDarkMode} />
      {/* Your other components or code here */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleButton: {
    padding: 16,
  },
  toggleButtonText: {
    color: '#000',
  },
});

export default App;
