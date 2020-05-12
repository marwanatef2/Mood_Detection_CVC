import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Drag from "./draggable";
import * as FaceDetector from "expo-face-detector";
import * as MediaLibrary from "expo-media-library";

import axios from "axios";
import { Camera } from "expo-camera";

import { Video } from "expo-av";
import { color } from "react-native-reanimated";
export default function Cbody({
  uri,
  goHome,
  challengesID,
  mar,
  creator,
  email,
}) {
  const { width } = Dimensions.get("window");
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [cameraRef, setCameraRef] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [loading, setLoadding] = useState(false);

  const takePicture = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      // console.log(uri);
      // const uri = await CameraRoll.saveToCameraRoll(uri);
      // console.log(uri);
      // console.log("captured");
      console.log(await detectFaces(uri));
      // setPhoto(uri);
    }
  };

  const detectFaces = async (imageUri) => {
    const options = {
      mode: FaceDetector.Constants.Mode.fast,
      detectLandmarks: FaceDetector.Constants.Landmarks.all,
      runClassifications: FaceDetector.Constants.Classifications.all,
    };
    return await FaceDetector.detectFacesAsync(imageUri, options);
  };

  // function responsible to record the video and send it after the challenge video is over to get the score
  const takeVideo = async () => {
    if (cameraRef) {
      let url = "http://192.168.1.110:5000/submitchallenge/sendvideo";
      cameraRef
        .recordAsync({
          quality: Camera.Constants.VideoQuality["480p"],
          maxDuration: 5,
        })
        .then((data) => {
          setLoadding(true);
          console.log("uri :", data.uri);
          let formData = new FormData();
          formData.append("video", {
            name: "zeez.mp4",
            uri: data.uri,
            type: "video/mp4",
          });
          formData.append("mouth_aspect_ratio", mar);

          axios({
            method: "post",
            url: url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(function (response) {
              //handle success
              console.log("score : ", response.data.score);
              let score = response.data.score;

              axios
                .post(
                  "https://marwanatef2.pythonanywhere.com/submitchallenge/getscore",
                  {
                    email: email,
                    score: score,
                    creator: creator,
                    id: challengesID,
                    ids: challengesID,
                  }
                )
                .then((res) => {
                  console.log("zeez ", res.data);

                  Alert.alert(
                    "Video Recorded",
                    res.data.submitted
                      ? "You have submitted the video please wait for the other to finish"
                      : `you have ${res.data.state}`,
                    [{ text: "Profile", onPress: () => goHome() }],
                    { cancelable: false }
                  );
                  // if (res.data) setLoadding(false);
                })
                .catch((err) => console.log(err));
            })
            .catch(function (response) {
              //handle error
              console.log(response);
            });
        });

      // setPhoto(uri);
      // console.log("video lnk : ", uri);
      // const { status } = await MediaLibrary.requestPermissionsAsync();
      // const data = await MediaLibrary.saveToLibraryAsync(uri);
      // console.log(data);
    }
  };

  const stopVideo = () => {
    cameraRef.stopRecording();
  };
  const removeVideo = () => {
    setPhoto(false);
  };

  const handelVideoRef = (component) => {
    setVideoRef(component);
  };
  const handleFacesDetected = (obj) => {
    console.log(obj);
  };

  // function to know if the challenged video is started so we can start recording
  const onUpdate = (ps) => {
    if (ps.didJustFinish && !ps.isLooping) {
      // The player has just finished playing and will stop. Maybe you want to play something else?
      stopVideo();
    }
  };
  if (!loading)
    return (
      <View style={{ flex: 1, ...styles.wrapper }}>
        <Drag styles={styles.container}>
          <Camera
            style={styles.cameraBody}
            type={type}
            ref={(ref) => {
              setCameraRef(ref);
            }}
            whiteBalance={Camera.Constants.WhiteBalance.auto}
            autoFocus={Camera.Constants.AutoFocus.on}
            zoom={0}
            onCameraReady={() => takeVideo()}

            // onFacesDetected={handleFacesDetected}
            // faceDetectorSettings={{
            //   mode: FaceDetector.Constants.Mode.fast,
            //   detectLandmarks: FaceDetector.Constants.Landmarks.all,
            //   runClassifications: FaceDetector.Constants.Classifications.all,
            //   tracking: true,
            // }}
          />
        </Drag>

        <TouchableOpacity style={{ flex: 1 }}>
          <Video
            ref={handelVideoRef}
            // source={require("../../assets/videos/video1.mp4")}
            source={{ uri }}
            shouldPlay
            resizeMode="contain"
            style={{ width, height: "100%" }}
            // onLoadStart={() => takeVideo()}
            useNativeControls={true}
            onPlaybackStatusUpdate={(ps) => onUpdate(ps)}
            volume={0}
          />
        </TouchableOpacity>
      </View>
    );
  else
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="white" />
        <Text style={{ textAlign: "center", color: "white" }}>
          Please wait while we upload your Video
        </Text>
      </View>
    );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#222",
  },
  container: {
    borderRadius: 100,
    overflow: "hidden",
    height: 160,
    width: 160,
    borderWidth: 30,
    borderColor: "#000",
    position: "absolute",
    right: 0,
    zIndex: 1,
    backgroundColor: "red",
  },
  cameraBody: {
    flex: 1,
  },
});
