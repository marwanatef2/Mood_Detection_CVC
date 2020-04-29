import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Linking } from "expo";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";

export default function home({ navigation }) {
  const handleSignUp = () => {
    // axios.get("https://marwanatef2.pythonanywhere.com/login").then(result);
    // navigation.navigate("Home");
    // console.log(Linking.makeUrl("path/into/app"));
    WebBrowser.openBrowserAsync("https://marwanatef2.pythonanywhere.com/zeez");
    console.log("zeez in linking");
    // Linking.openURL("exp://192.168.1.110:19000");
  };
  Linking.addEventListener("url", (url) => {
    let { path, queryParams } = Linking.parse(url);
    console.log(path, queryParams);
  });

  return (
    <ImageBackground
      source={require("../assets/backg2.jpg")}
      style={styles.container}
    >
      <View style={styles.titlePage}>
        <Text style={{ fontSize: 45, color: "#000" }}>Login Page</Text>
        <Text style={{ fontSize: 13, fontWeight: "100", color: "#666" }}>
          By Team : TITO
        </Text>
      </View>
      <View style={styles.contentView}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={{ ...styles.button, flexDirection: "row" }}
        >
          <AntDesign name="google" size={20} style={{ color: "white" }} />
          <Text style={{ fontSize: 20, marginLeft: 10, color: "#fff" }}>
            Sign up with Google
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  titlePage: {
    flex: 1,
    alignSelf: "flex-start",
    marginTop: 40,
    padding: 20,
  },
  contentView: {
    flex: 4,
    justifyContent: "flex-start",
    padding: 20,
  },
  button: {
    borderWidth: 1,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#bbb",
    backgroundColor: "#dd4b39",
    borderRadius: 10,
    elevation: 15,
  },
});
