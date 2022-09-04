/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Welcome, Walkthrough, AuthMain} from './screens';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'Welcome'}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Walkthrough" component={Walkthrough} />
        <Stack.Screen name="AuthMain" component={AuthMain} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
