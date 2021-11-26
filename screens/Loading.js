import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import firebase from "firebase/app";

export default class Loading extends React.Component {
  static navigationOptions={
    header: null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "Navigation" : "Login");
    });
  
  }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color='red'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});