import React from "react";
import {  StyleSheet,  Iconoi,  Button,  TextInput,  Text, View, Alert} from "react-native";

import firebase from "firebase/app";

//Importing Screens
export default class Account extends React.Component {
  state={email:""}


logoutUser = () => {
    firebase
      .auth()
      .signOut()
      .catch(error=>{Alert.alert(error.message)})
    Alert.alert('MESSAGE','Logout Successful')

  };
  render() {
    return (
    <View>
    <Text> Account </Text>
      <Button title="Sign out"  onPress={this.logoutUser} />
    </View>
    );
  }
}