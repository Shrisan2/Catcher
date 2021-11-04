import React, { useState, useEffect } from 'react';
import MapView, { Marker }from 'react-native-maps';
import * as Location from 'expo-location'
import { StyleSheet, Text, View, Image, Dimensions ,SafeAreaView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
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
    baitShops: [],
    lakesNearby: [],
    parksNearby: [],
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
    await this.getLakesNearby();
    await this.getParksNearby();
  }


  getBaitShops = async () => {
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const baitShops = await YelpService.getBaitShops(userLocation);
    this.setState({ baitShops });
  };

  getLakesNearby = async ()=>{
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const lakesNearby = await YelpService.getLakesNearby(userLocation);
    this.setState({lakesNearby});
  }

  getParksNearby = async ()=>{
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const parksNearby = await YelpService.getParksNearby(userLocation);
    this.setState({parksNearby});
  }


  render(){
    const {region, baitShops, lakesNearby,parksNearby} = this.state;
    return(
      <SafeAreaView style={styles.container}>
          <MapView style={styles.map} loadingEnabled={true} region={region} >
            <Marker coordinate={region} title="My Location" />
            
            {baitShops.map((place,i)=>(
               <Marker key={i} title={place.name} coordinate={place.coords} >
                    <Ionicons name="md-location-sharp" size={24} color="red" />
               </Marker>
            ))}

            {lakesNearby.map((place,i)=>(
               <Marker key={i} title={place.name} coordinate={place.coords} >
                    <MaterialCommunityIcons name="fishbowl" size={24} color="blue" />
               </Marker>
            ))}

            {parksNearby.map((place,i)=>(
               <Marker key={i} title={place.name} coordinate={place.coords} >
                    <MaterialIcons name="park" size={24} color="green" />
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