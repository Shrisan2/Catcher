import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';

export default class ForgotPasswordScreen extends React.Component {
    state = { email: "", errorMessage: null };

    onResetPasswordPress = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert("Password reset email has been sent.");
            }, (error) => {
                Alert.alert(error.message);
            });
    }


     render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require("./../assets/Catcher_Logo.png")} />
                <Text style={styles.logoText}>Catcher </Text>
                <StatusBar style="light" />
        
                <Text style={styles.ForgotText}>Forgot Password ?</Text>
                <Text style={styles.ForgotText}>Please enter your email address.</Text>

                <View style={styles.inputView}>
                    <TextInput style={styles.TextInput}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}  
                    placeholderTextColor="#003f5c"
                    />
                </View>

              

                <Button title="Reset Password" onPress={this.onResetPasswordPress} />
                <Button title="Back to Login..." onPress={() => this.props.navigation.navigate("Login")} />
            </View>
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
    fontSize: 30, 
    justifyContent: 'center', 
    fontWeight:'bold'
  },

   ForgotText:{
    color:'red', 
    fontSize: 30, 
    justifyContent: 'center', 
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