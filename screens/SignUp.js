import React from "react";
import { StyleSheet, Text, TextInput, View, Button, Image, KeyboardAvoidingView, Alert } from "react-native";
import { StatusBar } from 'expo-status-bar';
import firebase from "firebase/app";


const uploadImage = async () =>{
  const {default: phImage} = await import("../assets/ph.jpg")
  const uri = Image.resolveAssetSource(phImage).uri;
  const response = await fetch(uri)
  const blob = await response.blob();
  const name = firebase.auth().currentUser.uid + "pp.jpg";
  var ref = firebase.storage().ref().child(name);
  return ref.put(blob, {contentType: "image/jpeg"})
}


export default class SignUp extends React.Component {
  state = { email: "", password: "", errorMessage: null, isLoggedin: false };
  updateUser() {
    const userID = firebase.auth().currentUser.uid;
    const dbRef = firebase.app().database().ref('/' + userID)
    dbRef.set({
      FullName: "",
      Phone: "",
      caught: "0",
      catcherscore: "0",
      record: "0"
    }).then(() => {
    }).catch(e => console.log(e))

  }

  handleSignUp = () => {
    console.log("handleSignUp()")
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ isLoggedin: true })
        const p = uploadImage()
        this.updateUser()
        if (p != null) {
          this.props.navigation.replace("Loading")
        }
      }
      )
      .catch(error => this.setState({ errorMessage: error.message }));
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <Image style={styles.logo} source={require("./../assets/Catcher_Logo.png")} />
        <Text style={styles.logoText}>Catcher </Text>
        <StatusBar style="light" />

        <Text style={{ fontSize: 30, color: 'green' }}>Sign Up</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
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

        <Button style={styles.loginBtn} title="Sign Up" onPress={this.handleSignUp} />
        <Button style={styles.loginBtn}
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate("Login")}
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

  logo: {
    width: 266,
    height: 258,
  },

  logoText: {
    color: 'rgb(65,98,76)',
    fontSize: 60,
    justifyContent: 'center',
    height: 100,
    fontWeight: 'bold'
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
    marginTop: 25,
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

  loginBtn: {
    width: "80%",
    borderRadius: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: 'rgb(65,98,76)',

  },
});