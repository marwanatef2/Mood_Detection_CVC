import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Drag from "./draggable";
import * as FaceDetector from "expo-face-detector";
import * as MediaLibrary from "expo-media-library";

import axios from "axios";
import { Camera } from "expo-camera";

import { Video } from "expo-av";
import { color } from "react-native-reanimated";
export default function Cbody() {
  const { width } = Dimensions.get("window");
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [cameraRef, setCameraRef] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [loaaaad, setLoad] = useState(true);

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
      let url = "http://192.168.1.110:5000/video";
      cameraRef
        .recordAsync({
          maxDuration: 5,
          quality: Camera.Constants.VideoQuality["720p"],
        })
        .then((data) => {
          setLoad(false);
          console.log("uri :", data.uri);
          let formData = new FormData();
          formData.append("video", {
            name: "marwan.mp4",
            uri: data.uri,
            type: "video/mp4",
          });
          // const { status } = await MediaLibrary.requestPermissionsAsync();
          MediaLibrary.saveToLibraryAsync(data.uri).then(() => {
            setLoad(true);
            console.log("saved");
          });
          // console.log(formData);
          // axios({
          //   method: "post",
          //   url: url,
          //   data: formData,
          //   headers: { "Content-Type": "multipart/form-data" },
          // })
          //   .then(function (response) {
          //     //handle success
          //     console.log(response);
          //   })
          //   .catch(function (response) {
          //     //handle error
          //     console.log(response);
          //   });
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
      // stopVideo();
    }
  };
  // if (load)
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
          useCamera2Api={true}
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
          source={require("../../assets/videos/blog.mp4")}
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
  // else
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         flexDirection: "row",
  //         alignContent: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
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
