import 'intl';
import 'intl/locale-data/jsonp/pt';

import React from 'react';
import { StatusBar } from 'react-native';

import './i18n'


import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor='#38A69D' barStyle='light-content'
      />
      <Routes/>
    </NavigationContainer>
  );
}