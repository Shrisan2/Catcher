import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList
} from "react-native";
import firebase from "firebase/app";
import * as MediaLibrary from 'expo-media-library';

//Importing Screens
export default class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      uri: "../assets/userimage.png",
      name: "",
      phone: "",
      url: "",
      caught: "",
      score: "",
      record: ""
    };
  }

  componentDidMount(){
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

    const albumName = "CatcherImages";
    const getPhotos = MediaLibrary.getAlbumAsync(albumName).catch(e => console.log(e));
    if (getPhotos === null){
      MediaLibrary.createAlbumAsync(albumName).catch(e => console.log(e));
      console.log("album does not exist\ncreating new album");
    } else {
      const pictures = MediaLibrary.getAssetsAsync({album: getPhotos}).catch(e => console.log(e));
      this.setState({data: pictures});
    }
  }

  render() {
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <FlatList data={this.state.data}
              numColumns = {3}
              keyExtractor={item => item.id}
              nestedScrollEnabled
              renderItem={({item}) => (
                <View style={styles.item}>
                  <Image 
                    style={styles.flatimage}
                    source={{uri:item.localUri}}
                  />
                </View>
              )}
            />
          </View>
        </ScrollView>
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
  }
})