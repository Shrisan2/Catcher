import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from "react-native";
import firebase from "firebase/app";

//Importing Screens
export default class Home extends React.Component {
  state = {uri : "../assets/userimage.png", name : "", phone: "", url:"",}
/*
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
*/
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
                <Text>###</Text>
                <Text style={styles.textSub}>Caught</Text>
              </View>
              <View style={styles.statsBox}>
                <Text>###</Text>
                <Text style={styles.textSub}>CatcherScore</Text>
              </View>
              <View style={styles.statsBox}>
                <Text>###"</Text>
                <Text style={styles.textSub}>Record</Text>
              </View>
            </View>

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
  image: {
    flex: 1,
    height: undefined,
    width: undefined
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