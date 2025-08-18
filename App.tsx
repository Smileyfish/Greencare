import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/services/database';

initDB();
export default function App() {
  return <AppNavigator />;
}
