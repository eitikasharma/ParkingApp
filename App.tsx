import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createRef, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Modal } from 'react-native';
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-react-native';
import { decodeJpeg, fetch } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { CameraView, useCameraPermissions, CameraCapturedPicture} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

import CameraScreen from './src/CameraScreen';
import HomeScreen from './src/HomeScreen'
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//import backgroundImg from './assets/background.png';

export type RootStackParamList = {
  'Smart Parking Guide': undefined;
  Camera: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Smart Parking Guide">
          <Stack.Screen name="Smart Parking Guide" component={HomeScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
     
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'black'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  shutterButton: {
    width: 75,
    height: 75,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 3,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center'
  },
  shutterContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  shutterInside: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 999,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  button: {
    borderRadius: 20,
    borderTopColor: 'grey',
    borderTopWidth: 1,
    padding: 10,
    backgroundColor: 'whitesmoke',
  },
  modalHeadingText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 18,
    color: 'black',
  },
  modalPredText: {
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 18,
    color: 'black',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'whitesmoke',
    borderRadius: 17,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'red',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});