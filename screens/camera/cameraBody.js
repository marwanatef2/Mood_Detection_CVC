import React, { useState } from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";
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
  const takePicture = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      // console.log(uri);
      // const uri = await CameraRoll.saveToCameraRoll(uri);
      // console.log(uri);
      // console.log("captured");
      setPhoto(uri);
    }
  };

  const takeVideo = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.recordAsync({
        maxDuration: 1,
      });
      console.log("uri :", uri);
      // const data = await axios.post("http://192.168.1.110:5000/video", {
      //   uri: uri,
      //   lastName: "Zeez",
      // });
      let url = "http://192.168.1.110:5000/video";
      let formData = new FormData();
      formData.append("zeez", 5);
      formData.append("videoFile", {
        name: "zeez".mp4,
        uri: uri,
        type: "video/mp4",
      });

      let response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: {
          name: "zeez",
        },
      });
      // let z = await response.json();

      console.log("result", response);

      // console.log("data :", data);

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

  const onUpdate = (ps) => {
    if (ps.didJustFinish && !ps.isLooping) {
      // The player has just finished playing and will stop. Maybe you want to play something else?
      // stopVideo();
    }
  };
  return (
    <View style={{ flex: 1, ...styles.wrapper }}>
      <View style={styles.container}>
        <Camera
          style={styles.cameraBody}
          type={type}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        ></Camera>
      </View>
      <View style={{ flex: 1 }}>
        <Video
          ref={handelVideoRef}
          source={require("../../assets/videos/blog.mp4")}
          shouldPlay
          resizeMode="cover"
          style={{ width, height: "100%" }}
          onLoadStart={() => takeVideo()}
          useNativeControls={true}
          onPlaybackStatusUpdate={(ps) => onUpdate(ps)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#aaa",
  },
  container: {
    borderRadius: 300,
    overflow: "hidden",
    height: 100,
    width: 100,
    borderWidth: 2,
    borderColor: "black",
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  cameraBody: {
    flex: 1,
  },
});
