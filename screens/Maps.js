import React, { useState, useEffect } from 'react';
import MapView, { Marker }from 'react-native-maps';
import * as Location from 'expo-location'
import { StyleSheet, Text, View, Image, Dimensions ,SafeAreaView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import YelpService from "../components/Yelp";


const deltas = {
  latitudeDelta: 0.02,
  longitudeDelta: 0.02
};


export default class App extends React.Component{

  state = {
    region:{
      latitude: 0,
      longitude: 1,
      ...deltas
    },
    baitShops: []
  };


  componentDidMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Error","Location Permission Required.")
      return(
      <View style={styles.container}>
          <Text color="red">Error. Location Permission required. Please to to mobile settings and 
          enable Location for Catcher.
          </Text>
      </View>
      )
    }

    let location = await Location.getCurrentPositionAsync({accuracy:1})
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas
    };
    await this.setState({ region });
    await this.getBaitShops();
  }


  getBaitShops = async () => {
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const baitShops = await YelpService.getBaitShops(userLocation);
    this.setState({ baitShops });
  };



  render(){
    const {region, baitShops} = this.state;
    return(
      <SafeAreaView style={styles.container}>
          <MapView style={styles.map} loadingEnabled={true} region={region} >
            <Marker coordinate={region} title="My Location" />
            
            {baitShops.map((place,i)=>(
               <Marker key={i} title={place.name} coordinate={place.coords} >
                    <Ionicons name="md-location-sharp" size={24} color="red" />
               </Marker>
            ))}
          
          </MapView>
      </SafeAreaView>
    )
  }

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });