# 🚗 Smart Parking Guide

A Machine Learning-Based Mobile App to Support Dyslexic Drivers

# 🧠 Overview

The Smart Parking Guide is a mobile application designed to assist individuals with dyslexia in interpreting complex parking signs using machine learning. Dyslexic drivers often struggle to understand text-heavy and symbol-based signs, which can lead to parking violations and increased stress. This app uses a custom-trained image recognition model to provide real-time, accessible interpretations of parking signs—empowering dyslexic users to navigate urban environments with confidence.

# 🎯 Project Objectives

🧩 Identify challenges dyslexic individuals face with parking signage.

🤖 Develop a machine learning model to recognize and interpret parking signs.

📱 Build a user-friendly mobile app for real-time sign interpretation.

🗣️ Provide both text-based and audio-based feedback.

🌍 Promote inclusion and independence for neurodiverse drivers.

# 📸 How It Works

User opens the app and is greeted by an intuitive home screen.

Camera access is requested to capture a parking sign.

The app loads a TensorFlow.js ML model hosted on GitHub.

User captures an image of a parking sign.

The app processes the image and uses the ML model to:

Classify the sign (e.g., “No Parking”, “Permit Required”).

Interpret time-based or permit-related restrictions.

The result is shown as clear guidance like:

✅ "You can park here until 6 PM"

❌ "No parking - Permit required"

# 🧪 Technologies Used

Component	Technology

Machine Learning	TensorFlow / Keras / InceptionV3

Frontend	React Native + Expo

Model Hosting	GitHub + TensorFlow.js

Data	Curated parking sign dataset + Data Augmentation

# 🔗 Model Files

The trained machine learning model (in TensorFlow.js format) is hosted in a separate GitHub repository for modularity and performance optimization:

👉 Model Repository – https://github.com/eitikasharma/Model-Build

It contains:

model.json – the model architecture

group1-shard1of5.bin to group1-shard5of5.bin – the model weights split into shards

Testing.ipynb – notebook to test the model

Model_Test.zip – contains the dataset used for training/validation/testing

# 📊 Results

🧠 Model trained on 31 parking sign classes using InceptionV3 and data augmentation.

📈 Achieved 94–95% training accuracy.

📱 App successfully interprets real-world parking signs in real-time.

👍 68.1% of surveyed users (dyslexic and non-dyslexic) said they would likely use such an app.

# 📍 Features

📸 Real-time image capture and prediction

🔊 Optional audio output

🧭 Planned GPS-based parking assistance (future scope)

🛠️ Lightweight ML model optimized for mobile

🧑‍🦯 Accessibility-first design (adjustable text, voice assist, color contrast)

# 🧩 Future Enhancements

🧠 Improve model accuracy with more diverse datasets

🗂️ Integrate user permit info for personalized results

🔍 Add zoom functionality

🗺️ Real-time GPS navigation to parking


# 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

🔊 Full audio feedback for visually impaired users
