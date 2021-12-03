import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, Button, Platform,
  Dimensions, FlatList, SafeAreaView, ScrollView, StatusBar, TextInput, KeyboardAvoidingView} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { DataTable } from 'react-native-paper';
import { Asset } from 'expo-asset';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

//Importing firebase
import firebase from "firebase/app";

//Importing Navigation
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Importing ImageRecognition
import ImageRecognition from './ImageRecognition';

//Species data json
const speciesData = require('../components/imagenet_class_index.json');

//Images of fish to show in species selection
import speciesImages from '../assets/species_images/index';

const SpeciesButton = ({ item, onPress, backgroundColor, textColor, speciesInfo }) => (
  <TouchableOpacity onPress={onPress} style={[styles.speciesButton, backgroundColor, { flexDirection: 'column' }]}>
    <Image style={{width: null, height: 50, flex: 0}} resizeMode={'cover'} source={ speciesImages[item.class_id] } />
    <Text style={[styles.speciesButtonLabel, textColor]} adjustsFontSizeToFit={true}>{speciesInfo.name}</Text>
    <Text style={[styles.speciesButtonLabel, textColor]}>{item.percentage.toFixed(2)}%</Text>
  </TouchableOpacity>
);

// Checks if logInfo directory exists. If not, creates it
async function ensureInfoDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'LogInfo/');
  if (!dirInfo.exists) {
    console.log("Info directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'LogInfo/', { intermediates: true });
  }
}

// Checks if logPhotos directory exists. If not, creates it
async function ensurePhotosDirExists() {
  const dirPhotos = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'LogPhotos/');
  if (!dirPhotos.exists) {
    console.log("Photos directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'LogPhotos/', { intermediates: true });
  }
}

function getPoints(id) {
  return speciesData.species.filter(
    function(speciesData) {
      return speciesData.id == id
    }
  )
}

//Displaying the Image, species prediction, and log
function GalleryScreen(props){
  const [predictionReady, setPredReady] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);
  const [smallImage, setSmallImage] = useState(null);
  const [imgReady, setImgReady] = useState(false);
  
  const [selectedId, setSelectedId] = useState(null);
  const [otherSpeciesId, setOtherSpeciesId] = useState(null);
  const [fishLength, setfishLength] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialize some things when opening this screen
  useEffect(() => {
    // Resize a copy of image for prediction
    (async () => {
      const manipImage = await manipulateAsync(
        props.route.params.uri,
        [
          {resize: { height: 224, width: 224 }},
        ],
        { compress: 1, format: SaveFormat.JPEG }
      );
      setSmallImage(manipImage);
      setImgReady(true);
      
      // Predict
      const {uri} = {uri:manipImage.localUri || manipImage.uri};
      const fishNames = await ImageRecognition.getFishNames(uri);
      setPredReady(true);
      setPredictionResults(fishNames);
      setSelectedId(fishNames[0].class_id)
    })();
  }, []);

  //Performing Image Classification
  const classifyImage = async () => {
    const {uri} = {uri:props.route.params.uri};
    const fishNames = await ImageRecognition.getFishNames(uri);
  }

  const saveImage = async () => {
    //checkDirectoryExists();
    const imageDir = FileSystem.cacheDirectory+'CatcherImages/';
    const {status} = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const {uri} = {uri:props.route.params.uri};
      const assert =await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('CatcherImages');
      if (album === null) {
        MediaLibrary.createAlbumAsync('CatcherImages', assert)
          .then(() => {
            Alert.alert('Success',"Image has been saved");
          });
      } else {
        let assertAdded = await MediaLibrary.addAssetsToAlbumAsync([assert], album, false);
        if (!assertAdded) console.log("Asset add error!")
      }
      props.navigation.replace('CameraDisplay');
    } else{
      Alert.alert("Error","Please go to settings and allow permission for camera.")
    }
  }

  // The log entry w/ smallImage is saved to expo file system
  const saveCatch = async () => {
    await ensureInfoDirExists();
    await ensurePhotosDirExists();

    var logInfo = {
      "log_entry": {
        "date": currentDate,
        "species_id": selectedId,
      }
    }
    logInfo = JSON.stringify(logInfo);
    uri = smallImage.uri

    let fileName = uri.substring(uri.lastIndexOf('/') + 1, uri.lastIndexOf('.')) + Date.now();

    FileSystem.copyAsync({
      from: smallImage.uri,
      to: FileSystem.documentDirectory + 'LogPhotos/' + fileName + '.jpg'
    }).catch(e => console.log(e));

    FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + 'LogInfo/' + fileName + '.txt',
      logInfo
    ).catch(e => console.log(e));
  }

  const updateInfo = async () => {
    let caught = "";
    let catcherscore = "";
    let record = "";

    const userID = firebase.auth().currentUser.uid;
    const dbRef = firebase.app().database().ref('/'+userID);
  
    await dbRef.once('value').then(snapshot=>{
      caught = snapshot.val().caught;
      catcherscore = snapshot.val().catcherscore;
      record = snapshot.val().record;
    }).catch(e => console.log(e));

    let newcaught = parseInt(caught);
    newcaught += 1;

    let temp = await getPoints(selectedId);
    let newcatcherscore = parseInt(catcherscore)
    newcatcherscore += temp[0].points;

    let newlength = parseInt(record);
    if (fishLength > newlength){
      newlength = fishLength;
    }

    dbRef.update({
    caught: newcaught,
    catcherscore: newcatcherscore,
    record: newlength
    }).catch(e => console.log(e));
  }

  const _renderItem = ({ item }) => {
    const backgroundColor = item.class_id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.class_id === selectedId ? 'white' : 'black';

    return (
      <SpeciesButton
        item={item}
        onPress={() => setSelectedId(item.class_id)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
        speciesInfo={speciesData.species.find(({ id }) => id === item.class_id)}
      />
    );
  }

  return(
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container}>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title="Go back" onPress={() => props.navigation.replace('CameraDisplay')} />
          <Button title="Save Catch" onPress={() => { saveCatch(); saveImage(); updateInfo();}} />
        </View>
        <Image
          style={styles.catchImage}
          resizeMode={'cover'}
          source={{ uri: props.route.params.uri }}
        />
        {predictionReady && predictionResults && (
          <View style={styles.container}>
            <View style={styles.logItem}>
              <Text style={styles.logItemLabel}>Species</Text>
              <TextInput
                style={styles.logItemInput}
                onChangeText={setSelectedId}
                value={selectedId}
              />
            </View>
            <SafeAreaView style={styles.speciesButtonGroup}>
              <FlatList
                horizontal={true}
                data={predictionResults}
                renderItem={_renderItem}
                keyExtractor={(item) => item.class_id}
                extraData={selectedId}
              />
            </SafeAreaView>
          </View>
        )}
        <View style={styles.logItem}>
          <Text style={styles.logItemLabel}>Date</Text>
          <TextInput
            style={styles.logItemInput}
            onChangeText={setCurrentDate}
            value={currentDate.toLocaleDateString("en-US")}
          />
        </View>
        <View style={styles.logItem}>
          <Text style={styles.logItemLabel}>Time</Text>
          <TextInput
            style={styles.logItemInput}
            onChangeText={setCurrentDate}
            value={currentDate.toLocaleTimeString("en-US")}
          />
        </View>
        <View style={styles.logItem}>
          <Text style={styles.logItemLabel}>Length(inches)</Text>
          <TextInput
            style={styles.logItemInput}
            placeholder="0.0"
            maxLength={10}
            keyboardType='numeric'
            onChangeText={setfishLength}
            value={fishLength}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    } else if (!camera){
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
    if (result.cancelled === true) {
      return;
    }
    props.navigation.replace('Gallery',{uri:result.uri});
  };

  if (hasCameraPermission === null || hasGalleryPermission ===null){
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
      <Camera style={styles.camera} ratio={'1:1'} whiteBalance={Camera.Constants.WhiteBalance.auto} autofocus={Camera.Constants.AutoFocus.on} type={type} flashMode={flashMode} ref={ref => setCamera(ref)} />
      <View style={{ flex: 0, backgroundColor: 'black', flexDirection: 'row' }}>
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

          <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
            <FontAwesome name="circle" size={50} color='white' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
            <MaterialCommunityIcons name="image" size={35} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity style={{
            alignSelf: 'center',
            backgroundColor: 'transparent'
          }} onPress={() => {
            setFlashMode(
              flashMode === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            );
          }}>
            <Ionicons name="flash" size={24} color="gold" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

//creating Stack Navigator
const Stack = createStackNavigator();

export default function App(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CameraDisplay" component={CameraComponent} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
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
    justifyContent: 'space-between'
  },
  button: {
    flex: 0.15,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    width: 120,
  },
  speciesButtonGroup: {
    marginBottom: 6,
    marginHorizontal: 6,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  speciesButton: {
    padding: 5,
    width: 120,
    height: 100,
    marginHorizontal: 6,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  speciesButtonLabel: {
    flex: 1,
    marginTop: 4,
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  logItem: {
    height: 30,
    marginVertical: 6,
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  logItemLabel: {
    flex: 1,
    padding: 5,
    alignSelf: 'center',
  },
  logItemInput: {
    flex: 1,
    padding: 5,
    alignSelf: 'center',
  },
  catchImage: {
    width: null,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});