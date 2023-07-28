// App.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import NewsWidget from './components/NewsSection';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NewsWidget />
    </SafeAreaView>
  );
};

export default App;
