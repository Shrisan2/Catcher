import React, {Component, useEffect, useState} from "react";
import { StyleSheet, Button, TextInput, Image, View, Alert, KeyboardAvoidingView } from "react-native";
import { WebView } from 'react-native-webview';
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase/app";
import ProfilePic from "../components/ProfilePic"


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

  const [nameText,setNameText] = useState('')
  const [phoneText, setPhoneText] = useState('')
  const userID = firebase.auth().currentUser.uid;
  const dbRef = firebase.app().database().ref('/'+userID)
  const onSubmitButtonPress = () => {
  if (nameText && nameText.length > 0) {
      dbRef.set({
        FullName: nameText,
        Phone: phoneText
      }).then(()=>{
        console.log("data updated")
      }).catch(e => console.log(e))
      navigation.replace('Accounts')
    }
  }

  return (    
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
    <Button title="Go back" onPress={() => navigation.replace('Accounts')} />

    <TextInput
      style={styles.input}
      placeholder="Name"
      onChangeText={(userDisplay) => setNameText(userDisplay)}
    />
    <TextInput
      keyboardType="numeric"
      style={styles.input}
      placeholder="Phone"
      onChangeText={(phoneDisplay) => setPhoneText(phoneDisplay)}
    />
    <Button title="Change profile picture" onPress={() => navigation.navigate('ProfilePic')}/>
    <Button title="Submit" onPress={onSubmitButtonPress}/>
  </KeyboardAvoidingView>
  )
}



function handleSignOut() {
  firebase.auth().signOut()
  Alert.alert("Message", "Signout Successful.")
}


class Account extends Component{ 
  state = {uri : ""}
  render() {
    const pp = "/" + firebase.auth().currentUser.uid + "pp.jpg"
    const ref = firebase.storage().ref(pp);
    const img_uri = ref.getDownloadURL().then(url => {this.setState({uri: url})}).catch(e=>{console.log(e)});
  return (
      <View style={styles.container}>
        <Image source={{uri: this.state.uri }} style={styles.image}></Image>
        <Button  title="Ultimate Guide to Fishing"  size="sm" backgroundColor="#007bff" onPress={() => this.props.navigation.navigate('Browsers', { uri: 'https://kayakguru.com/guide-to-fishing/' })} />
        <Button color='brown' title="Texas WildLife Fishing Rules and Regulations" onPress={() => this.props.navigation.navigate('Browsers', { uri: 'https://tpwd.texas.gov/fishboat/fish/' })} />
        <Button color='black' title="update profile" onPress={() => this.props.navigation.navigate('Update')} />
        <Button   title="Sign Out" onPress={() => handleSignOut()}  style={{color: 'red', marginTop: 10, padding: 10}} />
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
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12

  },
  button: {
    flex: 0.15,
    alignSelf: 'flex-end',
    alignItems:'center',
    backgroundColor: 'transparent',
    padding: 10,
    width: 120,

  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    minWidth: 100,
    marginTop: 20,
    marginHorizontal: 20,
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
    marginTop: 32
  },

  baseText: {
    fontWeight: 'bold'
  },
  innerText: {
    color: 'red'
  }
});
   