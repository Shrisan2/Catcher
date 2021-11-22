import React from "react";

//Importing Navigation Containers
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Importing Screens
import Account from "./Account";
import Home from "./Home";
import Weather from "./Weather";
import Camera from "./Camera";
import Maps from "./Maps";

//Constants
const Tab = createBottomTabNavigator();

export default class Navigation extends React.Component {

  render() {
    return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} options={{
          tabBarIcon:({color,size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          }} />
      
        <Tab.Screen name="Weather" component={Weather} options={{
          tabBarIcon:({color,size}) => (
            <MaterialCommunityIcons name="cloud" color={color} size={size} />
          ),
          }} />  
        <Tab.Screen name="Camera" component={Camera} options={{unmountOnBlur: 'true',
          tabBarIcon:({color,size}) => (
            <MaterialCommunityIcons name="camera" color={color} size={size} />
          )
          }} />
        <Tab.Screen name="Maps" component={Maps} options={{
          tabBarIcon:({color,size}) => (
            <MaterialCommunityIcons name="google-maps" color={color} size={size} />
          ),
          }} /> 
        <Tab.Screen name="Account" component={Account} options={{unmountOnBlur: 'true',
          tabBarIcon:({color,size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          }} />
      </Tab.Navigator>
    </NavigationContainer>
    );
  }
}