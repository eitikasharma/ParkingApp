import { Button, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import React from 'react';


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Smart Parking Guide'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <View style={styles.container}>

          <Text style={styles.instructionsText}>
            Welcome to the app!
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Read Instructions"
              onPress={() => setModalVisible(true)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={() => navigation.navigate("Camera")}
            />
          </View>
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
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
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
        paddingHorizontal: 20,         
      },
      instructionsText: {
        fontSize: 18,                  
        textAlign: 'center',           
        marginBottom: 30,       
      },
      buttonContainer: {
        width: '80%',                  
        marginBottom: 20,              
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalView: {
        margin: 20,
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
        fontSize: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignSelf: 'center',
        fontWeight: 'bold',
      },
      modalText: {
        fontSize: 16,
        marginBottom: 15,
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
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
  
  export default HomeScreen;