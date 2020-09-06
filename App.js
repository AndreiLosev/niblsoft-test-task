import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FirstScreen} from './src/screens/firstScreen';
import {SecondScreen} from './src/screens/secondScreen';
import {Store} from './src/context';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Store>
        <Tab.Navigator initialRouteName="FirstScreen">
          <Tab.Screen
            name="FirstScreen"
            component={FirstScreen}
            options={{tabBarBadge: 20}}
          />
          <Tab.Screen
            name="SecondScreen"
            component={SecondScreen}
            options={{tabBarBadge: 'hello'}}
          />
        </Tab.Navigator>
      </Store>
    </NavigationContainer>
  );
};

export default App;
