import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import * as Font from "expo-font";
import axios from "axios";
import { Linking, AppLoading } from "expo";
import Navigator from "./routes/homeStack";

const getFonts = () =>
  Font.loadAsync({
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "nunito-bold": require("./assets/fonts/Nunito-SemiBold.ttf"),
  });

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [username, setUsername] = useState("");

  const getUserInfo = () => {
    Linking.openURL("https://marwanatef2.pythonanywhere.com/login");
    //
    // axios.get("https://marwanatef2.pythonanywhere.com/login").then((res) => {
    //   console.log(res.data);
    //   console.log("zeez");
    // });
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log("zee3ez");
    // fetch("http://10.0.2.2:5000/zeez", {
    //   method: "GET",
    //   //Request Type
    // }).then((response) => console.log("zeez"));
    //If response is in json then in success
  };
  const onChangeText = (text) => {
    setUsername(text);
    console.log(username);
  };

  if (fontsLoaded) {
    return <Navigator />;
  } else {
    return (
      <AppLoading startAsync={getFonts} onFinish={() => setFontsLoaded(true)} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 30,
    padding: 20,
    color: "black",
    paddingBottom: 1,
  },
});
