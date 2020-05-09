import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Font from "expo-font";

import { Linking, AppLoading } from "expo";
import Navigator from "./routes/homeStack";

// this function is used to load our custom fonts so it can be used later when styling
const getFonts = () =>
  Font.loadAsync({
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "nunito-bold": require("./assets/fonts/Nunito-SemiBold.ttf"),
  });

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [username, setUsername] = useState("");

  // here we call the function to load the fonts until then we will show an apploading screen after the fonts is loaded it will go to our Navigator which contains all of our screens
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
