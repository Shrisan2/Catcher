import React, {Component, useEffect, useState} from "react";
import { StyleSheet, Button, TextInput, Image, View, Alert, KeyboardAvoidingView, Text, TouchableOpacity } from "react-native";
import { WebView } from 'react-native-webview';
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase/app";
import ProfilePic from "../components/ProfilePic"
import UpdateForm from "../components/UpdateForm"

const Browser = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1 }}>
      <Button title="Go back" onPress={() => navigation.replace('Accounts')} />
      <WebView
        source={{
          uri: route.params.uri
        }}
        style={{ flex: 1 }}
      />
    </View>
  )
}

const Update = ({ navigation }) => {
  return (    
    <KeyboardAvoidingView style={styles.container}>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.replace('Accounts')}
      style={styles.appButtonContainer}
    >
    <Text style={styles.appButtonText}>Go Back</Text>
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ProfilePic')}
      style={styles.appButtonContainer}
    >
    <Text style={styles.appButtonText}>Change profile picture</Text>
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('UpdateForm')}
      style={styles.appButtonContainer}
    >
    <Text style={styles.appButtonText}>Change your information</Text>
    </TouchableOpacity>
    
  </KeyboardAvoidingView>
  )
}




class Account extends React.Component{ 
  state = {uri : "../assets/userimage.png", name : "", phone: ""} // error because these are empty
  _isMounted = false

  onSignoutPress = () => {
    this._isMounted=false
    firebase.auth().signOut();
    Alert.alert("Message", "Signout Successful.")
  }

  componentWillUnmount(){
    this._isMounted = false
  }


  componentDidMount(){
    this._isMounted = true

    if(this._isMounted){
      const userID = firebase.auth().currentUser.uid;
      const dbRef = firebase.app().database().ref('/'+userID)
      
      dbRef.once('value').then(snapshot=>{
          this.setState({ phone: snapshot.val().Phone,name: snapshot.val().FullName})
      }).catch(e=>{console.log(e)}); // error related to line 53 (null is not an object (evaluating 'snapshot.val().Phone')
  
      const pp = "/" + firebase.auth().currentUser.uid + "pp.jpg"
      let ref = firebase.storage().ref(pp);
      if(ref.getDownloadURL()!=null){
        ref.getDownloadURL().then(url => {this.setState({uri: url})}).catch(e=>{console.log(e)});
      }
    }
    
  }
  render() {
  return (
      <View style={styles.buttonStyle}>
        <Text style={styles.textStyle}>{this.state.name} </Text>
        <Image source={{uri: this.state.uri}} style={styles.image}></Image>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.props.navigation.navigate('Update')}
          style={styles.appButtonContainer}
        >
        <Text style={styles.appButtonText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.props.navigation.navigate('Browsers', { uri: 'https://kayakguru.com/guide-to-fishing/' })}
          style={styles.appButtonContainer}
        >
        <Text style={styles.appButtonText}>Guide to Fishing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.props.navigation.navigate('Browsers', { uri: 'https://tpwd.texas.gov/fishboat/fish/' })}
          style={styles.appButtonContainer}
        >
        <Text style={styles.appButtonText}>Rules and Regulations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.onSignoutPress}
          style={styles.appButtonContainer}
        >
        <Text style={styles.appButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accounts" component={Account} />
      <Stack.Screen name="Browsers" component={Browser} />
      <Stack.Screen name="Update" component={Update} />
      <Stack.Screen name="ProfilePic" component={ProfilePic} />
      <Stack.Screen name="UpdateForm" component={UpdateForm} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingHorizontal: 12

  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    minWidth: 200,
    marginTop: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,

  },
  image: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    marginTop: 32,
    marginBottom: 32
  },

  baseText: {
    fontWeight: 'bold'
  },
  innerText: {
    color: 'red'
  },
  buttonStyle: {
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
    borderWidth:2,
    borderRadius:20,
    borderColor:'sandybrown',
    overflow:"hidden",
    backgroundColor: 'slategray'
  },
  textStyle: {
    marginTop: 10,
    color: 'cornsilk',
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 25,
    backgroundColor: 'slategray',
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "sienna",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,

    
  },
  appButtonText: {
    fontSize: 18,
    color: "seashell",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  formStyle: {
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
    borderWidth:2,
    borderRadius:20,
    borderColor:'sandybrown',
    overflow:"hidden",
    backgroundColor: 'slategray'
  },
});
   