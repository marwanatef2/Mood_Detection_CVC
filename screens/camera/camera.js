import React, { useState } from "react";
import { Text, View, Dimensions, Button } from "react-native";
import Cbody from "./cameraBody";

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
      setPhoto(uri);
    }
  };

  const takeVideo = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.recordAsync({
        // maxDuration: 3,
      });

      // const { data } = await axios.post(
      //   "https://marwanatef2.pythonanywhere.com/uri",
      //   {
      //     uri: uri,
      //     lastName: "Zeez",
      //   }
      // );

      // setPhoto(uri);
      console.log("video link : ", uri);
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
  return <Cbody />;
}
