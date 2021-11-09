import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image,Button,Platform,Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { DataTable } from 'react-native-paper';
import {getStorage, ref, uploadBytes} from "firebase/storage"

//Importing firebase
import firebase from "firebase/app";


//Importing Navigation
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Importing ImageRecognition
import ImageRecognition from '../screens/ImageRecognition';

export const ProfilePic = ({ navigation, route }) => {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Go back" onPress={() => navigation.replace('Accounts')} />
        
      </View>
    )
  }

//Displaying the Image
function GalleryScreen(props){
  const uploadToFirebase= async()=>{
    //checkDirectoryExists();
    const imageDir = FileSystem.cacheDirectory+'CatcherImages/';
    const {status} = await MediaLibrary.requestPermissionsAsync();
    if(status === 'granted'){
      const {uri} = {uri:props.route.params.uri};
      const name = firebase.auth().currentUser.uid + "pp.jpg";
      const response = await fetch(uri)
      const blob = await response.blob();
      var ref = firebase.storage().ref().child(name);
      ref.put(blob)
      Alert.alert('Success',"Profile Picture has been updated");
      props.navigation.replace('Update');
    }else{
      Alert.alert("Error","Please go to settings and allow permission for camera.")
    }
  }

  return(
    <View style={styles.container}>
      <View style={{flex:0, flexDirection:'row', justifyContent:'space-between'}}>
      <Button title="Go back" onPress={() => props.navigation.replace('CameraDisplay')} />
      <Button title="Save Photo" onPress={() => uploadToFirebase()} />
      </View>
      <Image style={{width:'100%', height:'100%'}} source={{uri:props.route.params.uri}} /> 
      
    </View>
  )
}



function CameraComponent(props)  {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [flashMode, setFlashMode] = React.useState('off')



  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const options = {qaultiy: 1, base64:true}
      const photo = await camera.takePictureAsync(options);
      setImage(photo);
      setPreviewVisible(true);
      setCapturedImage(photo);
      props.navigation.navigate('Gallery',{uri:photo.uri})
    }else if (!camera){
      Alert.alert("Error", "Camera Failed To Start");
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if(!result.cancelled){
      props.navigation.replace('Gallery',{uri:result.uri});
    }
  };

  if(hasCameraPermission === null || hasGalleryPermission ===null){
    return <View/>
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    Alert.alert('Important',"Please go to Settings and enable Camera")
    return <Text style={{alignSelf:'center', color:'red', fontSize: 20, paddingTop:400 }}>
      No access to camera. Please go to settings and change camera permission.
    </Text>;
  }

  return (
   
    <View style={styles.container}>
  
       <Camera style={styles.camera} ratio={'1:1'} whiteBalance={Camera.Constants.WhiteBalance.auto} autofocus= {Camera.Constants.AutoFocus.on} type={type} flashMode={flashMode} ref={ref => setCamera(ref)} />
    
       <View style={{ flex:0, backgroundColor:'black',flexDirection:'row'}}>
        <View style={styles.buttonContainer}>    
            <TouchableOpacity style={styles.button} onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
                );
              }}>
                <Ionicons name="camera-reverse" size={35} color='grey' />
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={()=>takePicture()}>
                <FontAwesome name="circle" size={50} color='white' />
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={()=> pickImage()}>
                <MaterialCommunityIcons name="image" size={35} color="grey" />
              </TouchableOpacity>

              <TouchableOpacity style={{alignSelf: 'center', 
              backgroundColor: 'transparent'}} onPress={() => {
                setFlashMode(
                flashMode === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.torch
                  : Camera.Constants.FlashMode.off
                  );
                }}>
                <Ionicons name="flash" size={24} color="gold"  /> 
              </TouchableOpacity>
            </View>
       
       </View>

    </View>
              
  );
}

//creating Stack Navigator
const Stack = createStackNavigator();

export default function App(){
  return(
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="CameraDisplay" component={CameraComponent} />
        <Stack.Screen  name="Gallery" component={GalleryScreen} />
      </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
      justifyContent:'space-between'
    },
    button: {
      flex: 0.15,
      alignSelf: 'flex-end',
      alignItems:'center',
      backgroundColor: 'transparent',
      padding: 10,
      width: 120,
    },
    text: {
      fontSize: 18,
      color: 'white',
    },
  });