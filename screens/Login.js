import React from "react";
import { StyleSheet, Text, TextInput, View, Button, Image,KeyboardAvoidingView } from "react-native";
import { StatusBar } from 'expo-status-bar';

import firebase from "firebase/app";

export default class Login extends React.Component {
  state = { email: "", password: "", errorMessage: null };
  handleLogin = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // AsyncStorage.setItem("key", "I like to save it.");
        this.props.navigation.replace("Loading");
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  };
  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
      <Image style={styles.logo} source={require("./../assets/Catcher_Logo.png")} />
      <Text style={styles.logoText}>Catcher </Text>
      <StatusBar style="light" />
      <Text style={{fontSize: 30, color: 'green'}}>Login</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}

        <View style={styles.inputView}>
            <TextInput
            style={styles.TextInput}
            autoCapitalize="none"
            placeholder="Email"           
            placeholderTextColor="#003f5c"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            />
        </View>

        <View style={styles.inputView2}>
            <TextInput
                secureTextEntry	
                style={styles.TextInput}
                placeholder="Password"
                autoCapitalize="none"
                placeholderTextColor="#003f5c"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
            />
          </View>

        <Button title="Login" onPress={this.handleLogin} />
         <Button
          title="Forgot Password ?"
          onPress={() => this.props.navigation.navigate("ForgetPassword")}
        />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate("SignUp")}
        />
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(55,55,50)',
    alignItems: "center",
    justifyContent: "center",
  },
 
  logo : {
    width: 266,
    height: 358,
  },

  logoText:{
    color:'rgb(65,98,76)', 
    fontSize: 60, 
    justifyContent: 'center', 
    height: 100, 
    fontWeight:'bold'
  },

  image: {
    marginBottom: 80,
    flex: 1,
  },
 
  inputView: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    marginTop:25,
    alignItems: "center",
  },

  inputView2: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
 
  forgot_button: {
    height: 30,
    marginBottom: 30,
    color: 'white',
    fontWeight:'bold',
    fontSize: 15
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: 'rgb(65,98,76)',
  },
});