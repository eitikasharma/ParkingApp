import { Button, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Modal, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import React from 'react';


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Smart Parking Guide'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <View style={styles.container}>
          <ImageBackground source={require('../assets/background.png')} style={styles.backgroundImage}>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose, {width: '80%', paddingVertical: 20}]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textStyle}>Read Instructions</Text>
              </Pressable>
          </View>
          <View style={styles.buttonContainer1}>
            <Pressable
              style={[styles.button, styles.buttonClose, {width: '80%', paddingVertical: 20}]}
              onPress={() => navigation.navigate("Camera")}
            >
              <Text style={styles.textStyle}>Get Started</Text>
              </Pressable>
          </View>
          </ImageBackground>
          <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>How to Use the App</Text>
            <Text style={styles.modalText}>
              1. Wait for Model to Load: Before you start using the app, please wait for the model to finish loading.
            </Text>
            <Text style={styles.modalText}>
              2. Click a Picture: Once ready, take a picture of the on-street parking signs at your location.
            </Text>
            <Text style={{...styles.modalText, paddingLeft: 0, marginLeft: 0}}>
              3. Wait a Few Seconds: The app will process the information for a few seconds.
            </Text>
            <Text style={styles.modalText}>
              4. Find Out: You'll quickly find out if you're allowed to park at that location or not.
            </Text>

            <Pressable
              style={[styles.button, styles.buttonClose, {backgroundColor: 'rgb(29, 87, 163)'}]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={[styles.textStyle, {color: 'white'}]}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,                       
        justifyContent: 'center',      
        alignItems: 'center',          
        //paddingHorizontal: 20,         
      },
      instructionsText: {
        fontSize: 18,                  
        textAlign: 'center',           
        marginBottom: 20,       
      },
      backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
        //justifyContent: 'flex-end',
        alignItems: 'center'
      },
      buttonContainer: {
        width: '80%',                  
        marginTop: 150,              
      },
      buttonContainer1: {
        width: '80%', 
        marginTop: 30,              
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        overflow: 'visible',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'flex-start'
      },
      modalTitle: {
        fontSize: 22,
        marginBottom: 15,
        flexDirection: 'row',
        color: 'rgb(29, 87, 163)',
        alignSelf: 'center',
        fontWeight: 'bold',
      },
      modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'rgb(29, 87, 163)',
        textAlign: 'justify',
      },
      button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        alignSelf: 'center',
        justifyContent: "center",
      },
      buttonClose: {
        backgroundColor: 'rgba(255,255,255, 0.7)',
        borderColor: 'rgb(29, 87, 163)',
        borderWidth: 1.2,
      },
      textStyle: {
        color: 'rgb(29, 87, 163)',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
      },
    });
  
  export default HomeScreen;