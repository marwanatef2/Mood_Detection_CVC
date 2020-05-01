import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
} from "react-native";

import { Camera } from "expo-camera";

import { Video } from "expo-av";

// export default function cc() {
//   return <Text>zeez</Text>;
// }

export default function caamera() {
  const { width } = Dimensions.get("window");
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [cameraroll, setCameraRoll] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(false);

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
        // maxDuration: 3,
      });

      setPhoto(uri);
      console.log("video : ", uri);
    }
  };

  const stopVideo = () => {
    cameraRef.stopRecording();
  };
  const removeVideo = () => {
    setPhoto(false);
  };

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (photo) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center" }}> React Native Video </Text>
        <Video
          source={{
            uri: photo,
          }}
          shouldPlay
          resizeMode="cover"
          style={{ width, height: 600 }}
        />
        <View>
          <Button title="return" onPress={() => removeVideo()} />
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center",
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              {" "}
              Flip{" "}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "center",
              alignItems: "center",
            }}
            onPress={takeVideo}
          >
            <Text style={{ fontSize: 16, marginBottom: 10, color: "white" }}>
              Record
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "center",
              alignItems: "center",
              position: "relative",
              left: 100,
            }}
            onPress={stopVideo}
          >
            <Text style={{ fontSize: 16, marginBottom: 10, color: "white" }}>
              Stop Record
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
