import React from "react";
import { StyleSheet, Platform, Image, Text, View } from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";

//Firebase 
import firebase from "firebase/app";
var firebaseConfig = {
  apiKey: "AIzaSyBykUO5lyGYy5wAK7haXvZ9j9iHvbiBVF4",
  authDomain: "catcher-43065.firebaseapp.com",
  projectId: "catcher-43065",
  storageBucket: "catcher-43065.appspot.com",
  messagingSenderId: "991074600752",
  appId: "1:991074600752:web:48982858116922f55d2af5",
  measurementId: "G-51E20FKFL9"
}
//Initializing Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
else{
  firebase.app();
}

// import the different screens
import Loading from "./screens/Loading";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Navigation from "./screens/Navigation";
import ForgetPassword from "./screens/ForgetPassword";

//Inside screens
import Home from "./screens/Home";
import Account from "./screens/Account";

// create our app's navigation stack
const RootStack = createSwitchNavigator(
  {
    Loading: {screen: Loading},
    Navigation: {screen: Navigation},
    Login: {screen: Login},
    SignUp: {screen: SignUp},
    Home: {screen: Home},
    ForgetPassword: {screen: ForgetPassword},
    Account: {screen: Account}
  },
  {
    initialRouteName: "Loading"
  }
);

//const App = createAppContainer(RootStack);
//export default App;
const Appcontainer = createAppContainer(RootStack);
export default class App extends React.Component{
  render(){
    return <Appcontainer />;
  }
}
