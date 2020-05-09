import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Cbody from "./cameraBody";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import Drag from "./draggable";
import axios from "axios";

export default function caamera({ firstLogin }) {
  const [tookPhoto, setTookPhoto] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const takePicture = async () => {
    let url = "http://192.168.1.110:5000/image";
    console.log("zeez");

    cameraRef.takePictureAsync().then(({ uri }) => {
      let formData = new FormData();
      formData.append("image", {
        name: "zeez.jpg",
        uri,
        type: "image/jpg",
      });
      formData.append("email", "zeez@rdq.com");
      axios({
        method: "post",
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          //handle success
          console.log(response.data);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });

      // console.log(uri);
      // setTookPhoto(true);
    });
  };

  if (tookPhoto) return <Cbody />;
  else {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.front}
          ref={(ref) => {
            setCameraRef(ref);
          }}
          whiteBalance={Camera.Constants.WhiteBalance.auto}
          autoFocus={Camera.Constants.AutoFocus.on}
          zoom={0}
          useCamera2Api={true}
        />

        <TouchableOpacity
          style={{
            width: 100,
            height: 100,
            backgroundColor: "white",
            borderRadius: 100 / 2,
            position: "absolute",
            alignSelf: "center",
            bottom: 20,
            borderWidth: 10,
            borderColor: "#ddd",
          }}
          onPress={() => takePicture()}
        />

        <Drag
          styles={{
            alignContent: "center",
            justifyContent: "center",
            padding: 10,
            marginHorizontal: 30,
            position: "absolute",
            backgroundColor: "rgba(1,1,1,0.3)",
            top: 10,
            borderRadius: 5,
          }}
        >
          <MaterialIcons
            name="error"
            style={{ alignSelf: "center" }}
            size={20}
            color="green"
          />
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontFamily: "nunito-bold",
              letterSpacing: 1,
              color: "white",
              fontSize: 15,
            }}
          >
            Before going to the Challenge we need you to capture your self in
            neutral mode
          </Text>
        </Drag>
      </View>
    );
  }
}
