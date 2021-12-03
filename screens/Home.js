import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Button,
  FlatList
} from "react-native";
import firebase from "firebase/app";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

//Species data json
const speciesData = require('../components/imagenet_class_index.json');

const LogEntry = ({ info, imageUri }) => (
  <View style={[styles.logEntryContainer]}>
    <Image style={{ width: 150, height: 150, flex: 0, marginRight: 6 }} resizeMode={'cover'} source={{ uri: imageUri }} />
    <View style={{flexDirection: 'column', justifyContent: 'space-evenly', flex: 1}}>
      <Text style={[styles.logEntryText]}>{info.log_entry.date}</Text>
      <Text style={[styles.logEntryText]}>{speciesData.species.find(({ id }) => id === info.log_entry.species_id).name}</Text>
    </View>
  </View>
);

// Checks if logInfo directory exists. If not, creates it
async function ensureInfoDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'LogInfo/');
  if (!dirInfo.exists) {
    //console.log("Info directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'LogInfo/', { intermediates: true });
  }
}

// Checks if logPhotos directory exists. If not, creates it
async function ensurePhotosDirExists() {
  const dirPhotos = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'LogPhotos/');
  if (!dirPhotos.exists) {
    //console.log("Photos directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'LogPhotos/', { intermediates: true });
  }
}

// Check that a matching image/info pair exists
getLogPair = async(imageFileName) => {
  const imgFile = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + 'LogPhotos/' + imageFileName
  );

  const infoFileName = imageFileName.substring(0, imageFileName.lastIndexOf('.')) + '.txt';
  const infoFile = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + 'LogInfo/' + infoFileName
  );
  
  if (imgFile.exists == false || imgFile.isDirectory == true) {
    return null;
  }
  if (infoFile.exists == false || infoFile.isDirectory == true) {
    return null;
  }

  const info = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'LogInfo/' + infoFileName);
  const infoObj = JSON.parse(info);

  return {imgUri: (FileSystem.documentDirectory + 'LogPhotos/' + imageFileName), info: infoObj};
}

// Log entry files are read here when they are rendered
const _renderItem = ({ item }) => {
  //console.log(item.info.log_entry.species_id);
  //console.log(speciesData.species.find(({ id }) => id === item.info.log_entry.species_id));
  return (
    <LogEntry
      info={item.info}
      imageUri={item.imgUri}
    />
  );
}

//Importing Screens
export default class Home extends React.Component {
  constructor(props){
    super(props);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.state = {
      data:[],
      uri: "../assets/userimage.png",
      name: "",
      phone: "",
      url: "",
      caught: "",
      score: "",
      record: "",
      imageInfoPairs:[],
      
    };
  }

  forceUpdateHandler(){
    this.forceUpdate();
    this.componentDidMount();
    this.getImages();
  };

  async componentDidMount(){
    // Retrieve stats from firebase
    const userID = firebase.auth().currentUser.uid;
    const dbRef = firebase.app().database().ref('/'+userID)

    const pp = "/" + firebase.auth().currentUser.uid + "pp.jpg";
    const ref = firebase.storage().ref(pp);

    dbRef.once('value').then(snapshot=>{
      this.setState({ 
        caught: snapshot.val().caught, 
        score: snapshot.val().catcherscore, 
        record: snapshot.val().record })
      }).catch(e=>{console.log(e)});

    if(ref.getDownloadURL()!=null){
      ref.getDownloadURL().then(url => {this.setState({uri: url})}).catch(e=>{console.log(e)});
    }

    //console.log('a');
    // Read document directory for existing logs
    await ensureInfoDirExists();
    await ensurePhotosDirExists();

    //console.log('b');
    const imgs = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'LogPhotos/');

    //console.log('c');
    var arr = []
    for (let img of imgs) {
      let obj = await getLogPair(img);
      arr.push(obj);
    }
    //console.log('d');
    //console.log(arr);
    this.setState({imageInfoPairs: arr});
  }

  async getImages() {
    const {status} = await MediaLibrary.requestPermissionsAsync();
    if(status === 'granted'){
      console.log("getting images from catcherimages");
      const albumName = "CatcherImages";
      const getPhotos = MediaLibrary.getAlbumAsync(albumName).catch(e => console.log(e));
      //console.log(getPhotos);
      if (getPhotos === null){
        MediaLibrary.createAlbumAsync(albumName).catch(e => console.log(e));
        console.log("album does not exist\ncreating new album");
      } else {
        console.log("getting assets");
        const pictures = MediaLibrary.getAssetsAsync({first: 20, album: getPhotos}).catch(e => console.log(e));
        //console.log(pictures);
        this.setState({data: pictures});
      }
    }else{
      Alert.alert("Error","Please go to settings and allow permission for camera.")
    }
  }

  render() {
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={{alignSelf: "flex-end"}}>
          <Button title="Refresh" onPress={this.forceUpdateHandler}/>
        </View>
        <View style={{ alignSelf: "center" }}>
          <View style={styles.profileImage}>
          <Image source={{uri: this.state.uri }} style={styles.image}></Image>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text>{this.state.caught}</Text>
              <Text style={styles.textSub}>Caught</Text>
            </View>
            <View style={styles.statsBox}>
              <Text>{this.state.score}</Text>
              <Text style={styles.textSub}>CatcherScore</Text>
            </View>
            <View style={styles.statsBox}>
              <Text>{this.state.record}"</Text>
              <Text style={styles.textSub}>Record</Text>
            </View>
          </View>
          <FlatList 
            data={this.state.data}
            numColumns = {3}
            keyExtractor={item => item.id}
            nestedScrollEnabled
            renderItem={({item}) => (
              <View style={styles.item}>
                <Image 
                  style={styles.flatimage}
                  source={{uri:item.src}}
                />
              </View>
            )}
          />

          <SafeAreaView style={{marginTop: 12}}>
            <FlatList
              data={this.state.imageInfoPairs}
              renderItem={_renderItem}
              keyExtractor={(item) => item.imgUri.substring(0, item.imgUri.lastIndexOf('.'))}
            />
          </SafeAreaView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  flatimage: {
    position: 'absolute',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined
  },
  item: {
    flex: 1/3,
    aspectRatio: 1,
    margin:2,
  },
  profileImage: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    marginTop: 32
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32
  },
  statsBox: {
    alignItems: "center",
    flex: 1
  },
  textSub: {
    fontSize: 16,
    fontWeight: "bold"
  },
  logEntryContainer: {
    flexDirection: 'row',
    padding: 5,
    marginVertical: 6,
    marginHorizontal: 0,
  },
  logEntryText: {
    fontSize: 18,
  },
})