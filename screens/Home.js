import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from "react-native";

//Importing Screens
export default class Home extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignSelf: "center" }}>

            <View style={styles.profileImage}>
              <Image source={require("../assets/userimage.png")} style={styles.image}></Image>
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