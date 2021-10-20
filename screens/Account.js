import React from "react";
import {  StyleSheet, Iconoi, Button, TextInput,  Text, View, Alert} from "react-native";
import {WebView} from 'react-native-webview';
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase/app";


const Browser =({navigation, route})=>{
  return (
    <View style={{ flex: 1 }}>
      <Button title="Go back" onPress={() => navigation.replace('Accounts')} />
      <WebView
        source={{
          uri: route.params.uri
        }}
        style={{flex: 1}}
      />
    </View>
  )
}

function handleSignOut(){
  firebase.auth().signOut()
  Alert.alert("Message","Signout Successful.")
}

const Account=({navigation})=>{
  return(
    <View style={styles.container}>
      <Button title="Ultimate Guide to Fishing" onPress={()=>navigation.navigate('Browsers',{uri:'https://kayakguru.com/guide-to-fishing/'})}/>
      <Button title="Texas WildLife Fishing Rules and Reuglations"  onPress={()=>navigation.navigate('Browsers',{uri:'https://tpwd.texas.gov/fishboat/fish/'})}/>
      <Button color='red' title="Sign Out" onPress={()=>handleSignOut()} />
    </View>
  )
}

const Stack = createStackNavigator();

export default function MyStack(){
  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name = "Accounts" component={Account}/>
      <Stack.Screen name = "Browsers" component={Browser}/>
    </Stack.Navigator>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
  },
})