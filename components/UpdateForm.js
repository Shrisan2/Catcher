import React from 'react';
import {StyleSheet, Text, View, TextInput, Keyboard,TouchableOpacity } from 'react-native';
import firebase from 'firebase';

export default class UpdateForm extends React.Component {
    state = {name : "", phone: ""}
    
    handleNameChange=(text)=>{
        this.setState({name:text})
    }
    handlePhoneChange=(text)=>{
      this.setState({phone:text})
    }
  
    handleSubmit = () => {
        const userID = firebase.auth().currentUser.uid;
        const dbRef = firebase.app().database().ref('/'+userID)
        if (this.state.name && this.state.name.length > 0) {
            dbRef.update({
            FullName: this.state.name,
            Phone: this.state.phone
            }).then(()=>{
            }).catch(e => console.log(e))
            this.props.navigation.replace('Accounts')
        }
    }
  render() {
    
    
    return (
      <View style={styles.container}>
        
          <Text style={styles.header}>Update your information</Text>
          <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.props.navigation.replace('Update')}
          style={styles.appButtonContainer}
        >
        <Text style={styles.appButtonText}>Go back</Text>
        </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Your name"
            maxLength={20}
            onBlur={Keyboard.dismiss}
            onChangeText={text => this.handleNameChange(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Phone number"
            maxLength={20}
            keyboardType='numeric'
            onBlur={Keyboard.dismiss}
            onChangeText={text => this.handlePhoneChange(text)}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handleSubmit}
          style={styles.appButtonContainer}
        >
        <Text style={styles.appButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 15,
    textAlign: 'center',
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "sienna",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  appButtonText: {
    fontSize: 18,
    color: "seashell",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
})