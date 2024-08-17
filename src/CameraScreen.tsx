import { StatusBar } from 'expo-status-bar';
import { createRef, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Modal } from 'react-native';
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-react-native';
import { decodeJpeg, fetch } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { CameraView, useCameraPermissions, CameraCapturedPicture} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const MODELNAME = "smart-park-model"

export default function CameraScreen({navigation}: CameraScreenProps) {
  const [progress, setProgress] = useState<number>(0)
  const [image, setImage] = useState<string | null>(null)
  const [model, setModel] = useState<tf.LayersModel>()
  const [prediction, setPrediction] = useState<string | null>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [permitType, setPermitType] = useState<string | null>(null);

  const class_indices = {
    'Free Parking': 0, 
    'No Parking': 1, 
    'No Parking-Weekdays-6am To 8am': 2, 
    'No Parking-Weekdays-7.30am To 9.30am and 4.30pm To 6.30pm-Sat- 7.30am To 9.30am and 4.30PM To 6.30pm': 3, 
    'No Parking-Weekday-8am To 10pm and 4pm To 6pm-Sat-8am To 10am and 4pm To 6pm': 4, 
    'Paid Parking': 5, 
    'Paid Parking-Everyone-Weekdays- 8am To 6pm': 6, 
    'Paid Parking-Everyone-Weekdays- 8am To 6pm-Sat-9am To 6pm': 7, 
    'Paid Parking-Everyone-Weekdays-8am To 6pm-Weekend-8am To 6pm': 8, 
    'Paid Parking-Everyone-Weekdays-9.30 am To 4.30pm-Sat-9.30am To 4.30pm': 9, 
    'Parking': 10, 
    'Parking-Accessible Only': 11, 
    'Parking-Disabled badge holders only': 12, 
    'Parking-Disabled badge holders only-Weekdays-8am To 6pm': 13, 
    'Parking-Doctor Permit only-Weekdays- 8am To 6.30pm- Sat- 8.30am To 3pm': 14, 
    'Parking-Everyone-Weekdays-10am To 4pm-Sat-10am To 4pm': 15, 
    'Parking-Everyone-Weekdays-6pm To 6am-Weekend-6pm To 6am': 16, 
    'Parking-Everyone-Weekdays-6pm To 8am-Weekend-6pm To 8am': 17, 
    'Parking-Everyone-Weekdays-7.30am To 6.30pm-Sat-7.30am To 6.30pm': 18, 
    'Parking-Everyone-Weekdays-8am To 6pm-Sat-8am To 6pm': 19, 
    'Parking-Everyone-Weekdays-8am To 6pm-Weekends-8am To 6pm': 20, 
    'Parking-Everyone-Weekdays-8am To 7pm-Sat-8am To 7pm': 21, 
    'Parking-Everyone-Weekdays-9am To 6pm-Weekend-9am To 6pm': 22, 
    'Parking-Permit holders only- weekdays-6pm To 8am-Weekends- 6pm To 8am': 23, 
    'Parking-Permit holders A -Weekdays-7.30am To 6.30pm-Sat-7.30am To 6.30pm': 24, 
    'Parking-Permit holders A only-Weekdays- 7am To 8am and 7pm To 9pm-Sat- 7am To 8am and 7pm To 9pm': 25, 
    'Parking-Permit holders A2 only- Weekdays-8am To 6pm-Sat-8am To 6pm': 26, 
    'Parking-Permit holders AK only- Weekday-8am To 6 pm-Weekend- 8am To 6pm': 27, 
    'Parking-Permit holders only': 28, 
    'Parking-Permit holders only- Weekdays-8am To 6.30pm': 29, 
    'Parking-Permit holders only-Weekdays-10am To 4pm-Sat-10am To 4pm': 30
  }

  const indexToClass = Object.fromEntries(
    Object.entries(class_indices).map(([k, v]) => [v, k])
  );

  useEffect(()=> {
    const loadModel = async () => {
      try {
        await tf.ready()
          const modelUrl =
            'https://raw.githubusercontent.com/eitikasharma/Model-Build/main/model.json'
          const model = await tf.loadLayersModel(modelUrl, { onProgress: (p) => {
            setProgress(p)
            console.log(p)
            } 
          })
          setModel(model)
          setLoading(false)
      } catch(error) {
        console.log("Error while trying to fetch model: ",error)
      }
    }

    loadModel()
  },[])

  const processImage = async (imgUri: string) => {
    let imgTensor
    try {
      console.log("Fetching Image...")
      const imgB64 = await FileSystem.readAsStringAsync(imgUri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      console.log("After fetch process...")
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer
      console.log("Buffered...")
      const imageData = new Uint8Array(imgBuffer);
      console.log("Unit Arrayed...")
      imgTensor = decodeJpeg(imageData) // Decode as a tensor
      console.log("Decding...")
      imgTensor = tf.image.resizeBilinear(imgTensor, [150, 150]) // Resize to target size
      console.log("Reszised...")
      imgTensor = imgTensor.expandDims(0) // Add batch dimension
      imgTensor = imgTensor.div(tf.scalar(255.0)) // Normalize to [0, 1]
    } catch(error) {
      console.log("Error while processing: ",error)
    }

    return (imgTensor)!
  }

  const isTimeWithinRange = (currentTime: Date, startTime: string, endTime: string): boolean => {
    // Extract current hour and minute
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Parse start time
    const [startHour, startMinute] = startTime.split(':').map(Number);

    // Parse end time
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // Compare times
    const isAfterStart = (currentHour > startHour) || (currentHour === startHour && currentMinute >= startMinute);
    const isBeforeEnd = (currentHour < endHour) || (currentHour === endHour && currentMinute <= endMinute);

    console.log("Current Time:", currentHour + ":" + currentMinute);
    console.log("Start Time:", startHour + ":" + startMinute);
    console.log("End Time:", endHour + ":" + endMinute);
    console.log("isAfterStart:", isAfterStart);
    console.log("isBeforeEnd:", isBeforeEnd);

    // Return true if current time is within the range
    return isAfterStart && isBeforeEnd;
};

const getCurrentDay = (): string => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  return daysOfWeek[currentDate.getDay()];
};

const isDayMatch = (labelDays: string[]): boolean => {
  const currentDay = getCurrentDay();

  if (labelDays.includes('Weekdays')) {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(currentDay);
  }

  if (labelDays.includes('Weekend')) {
      return ['Sat', 'Sun'].includes(currentDay);
  }

  return labelDays.includes(currentDay);
};

// Function to parse the time strings from the label and compare with the current time
const checkParkingAvailability = (label: string): boolean => {
    const currentTime = new Date();

    const timePattern = /(\d{1,2}(?:\.\d{2})?)\s*(am|pm)/gi;
    const dayPattern = /(Weekdays|Weekend|Sat|Sun)/gi;

    const times = label.match(timePattern);
    const days = label.match(dayPattern);
    console.log("Extracted Time: ",times)
    console.log("Extracted Days: ",days)

    if (times && times.length >= 2 && days) {
        const [startTime, endTime] = times.map(time => {
            let [hour, minute] = time.replace(/am|pm/i, '').trim().split('.').map(Number);
            const isPM = time.toLowerCase().includes('pm');

            if (isPM && hour < 12) hour += 12; // Convert to 24-hour format
            if (!isPM && hour === 12) hour = 0; // Handle midnight

            return `${hour}:${minute || '00'}`;
        });

        if (isDayMatch(days)) {
          return isTimeWithinRange(currentTime, startTime, endTime); // Returns false if within restricted time range
      }
    }

    return true; // Default to true if no specific time is mentioned
};

const extractPermitType = (label: string): string | null => {
  if (label.includes('Doctor Permit')) return 'Doctor Permit Required';
  if (label.includes('Permit holders')) return 'Permit Badge Required';
  if (label.includes('Accessible Only')) return 'Accessible Parking Only';
  if (label.includes('Disabled')) return 'Disabled Parking Only';
  return null;
};

const checkAvailability = (label: string) => {
  let canPark = label==="No Parking" ? false : checkParkingAvailability(label);
  if (canPark){
    if(label.includes('No Parking'))
      canPark = !canPark
  }
  const permit = extractPermitType(label);
  setPrediction(canPark ? "Yes, you can park here." : "No, you cannot park here.");
  setPermitType(permit)
};

  const handleProcessImage = async (img: string) => {
    if (img) {
      const imgTensor: tf.Tensor<tf.Rank> = await processImage(img)
      try {
        console.log("Processing...")
        const predictions= await model?.predict(imgTensor)
        //@ts-ignore
        const predictedClassIndex = predictions?.argMax(-1).dataSync()[0];
      const predictedClassLabel = indexToClass[predictedClassIndex];
      console.log(predictedClassLabel)
      checkAvailability(predictedClassLabel)
      } catch(error) {
        console.log(error)
      }
    }
  }
// phone hang
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    try {
      setModalVisible(true)
      console.log("Taking Photo...")
      //@ts-ignore
      let photo: CameraCapturedPicture = await (cameraRef.current)!.takePictureAsync()
      console.log("Photo Taken...")
      const compressedPhoto = await compressImage(photo.uri)
      console.log("Compressed...")
      setImage(compressedPhoto.uri)
      await handleProcessImage(compressedPhoto.uri)
    } catch(error) {console.log(error)}
  };
  const compressImage = async (uri: string) => {
    console.log("Compressing...")
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 200 } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulatedImage;
  };

  if(loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
       <Text>Downloading ...</Text>
       <Text>{parseInt(`${progress * 100 * 2}`) + "%"}</Text>
       <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{height: '80%', borderRadius: 20, marginTop: 30, overflow: 'hidden'}}>
        <CameraView 
          style={styles.camera} 
          //@ts-ignore
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
          </View>
        </CameraView>
      </View>
      <View style={styles.shutterContainer}>
        <View style={styles.shutterButton}>
          <Pressable style={
            ({ pressed }) => [
              {
                width: pressed ? 56 : 60,
                height: pressed ? 56 : 60,
              },
              {backgroundColor: 'white', borderRadius: 999},
            ]}
            onPress={takePicture}>  
          </Pressable>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image src={image!}/>
            <Text style={styles.modalHeadingText}>The sign says</Text>
            <Text style={styles.modalPredText}>{prediction ?? "Analyzing..."}</Text>
            {permitType && <Text style={styles.modalPredText}>{permitType}</Text>}
            <Pressable
              style={styles.button}
              onPress={() => {setModalVisible(!modalVisible); setPrediction(null); setPermitType(null)}}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
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
    letterSpacing: 0.9,
    fontSize: 15,
  },
});