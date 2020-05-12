// screen responsible to show the user video and the camera to record himself while watching the challenge video , by requiring the cameraBody screen but first it had to check if the user has already adjusted his face values , if not it first tells the user to capture him self in a neutral mode and send the picture to the server to take the face values and store it in the database so we can get a much accurate score

import React, { useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Cbody from "./cameraBody";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import Drag from "./draggable";
import axios from "axios";

export default function caamera({ firstLogin, navigation }) {
  const [tookPhoto, setTookPhoto] = useState(
    navigation.state.params.exists === "true" ? true : false
  );
  const [cameraRef, setCameraRef] = useState(null);
  const [loading, setLoadding] = useState(false);
  // const [vertical, setVertical] = useState(0);
  // const [horizontal, setHorizontal] = useState(0);
  const [mar, setMar] = useState(navigation.state.params.mar);
  const [IDs, setIDS] = useState(navigation.state.params.challengesID);

  const uri = navigation.state.params.uri;
  const email = navigation.state.params.email;
  const creator = navigation.state.params.creator;
  // this function is responsible to send the captured photo to the server to get the face values
  const goHome = () => {
    navigation.navigate("Profile");
  };
  const takePicture = async () => {
    let url = "http://192.168.1.110:5000/image/start";

    cameraRef.takePictureAsync().then(({ uri }) => {
      setLoadding(true);
      let formData = new FormData();
      formData.append("image", {
        name: "zeez.jpg",
        uri,
        type: "image/jpg",
      });
      // formData.append("email", email);
      axios({
        method: "post",
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          //handle success
          console.log(response.data);
          setMar(response.data.mouth_aspect_ratio);
          axios
            .post("https://marwanatef2.pythonanywhere.com/image/end", {
              email: email,
              mouth_aspect_ratio: mar,
            })
            .then((res) => {
              console.log(res.data);
              if (res.data.mar_set) {
                setTookPhoto(true);
                setLoadding(false);
              }
            })
            .catch((err) => console.log(err));
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });

      // console.log(uri);
      // setTookPhoto(true);
    });
  };
  if (!loading) {
    if (tookPhoto)
      return (
        <Cbody
          uri={uri}
          goHome={goHome}
          mar={mar}
          challengesID={IDs}
          creator={creator}
          email={email}
        />
      );
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
  } else {
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
          Please wait where we upload your photo
        </Text>
      </View>
    );
  }
}
