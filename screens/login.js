import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Linking } from "expo";

import * as WebBrowser from "expo-web-browser";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export default function home({ navigation }) {
  const handleSignUp = () => {
    WebBrowser.openBrowserAsync("https://marwanatef2.pythonanywhere.com/login");
  };
  Linking.addEventListener("url", (url) => {
    let { path, queryParams } = Linking.parse(url.url);
    let loggedUser = {
      name: queryParams["name"],
      email: queryParams["email"],
      picture: queryParams["pic"],
    };

    navigation.navigate("Profile", loggedUser);
  });

  return (
    <ImageBackground
      source={require("../assets/backg2.jpg")}
      style={styles.container}
    >
      <View style={styles.titlePage}>
        <Text
          style={{ fontSize: 45, color: "#000", fontFamily: "nunito-bold" }}
        >
          Login Page
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "100",
            color: "#666",
            fontFamily: "nunito-regular",
          }}
        >
          By Team : TITO
        </Text>
      </View>
      <View style={styles.contentView}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={{ ...styles.button, flexDirection: "row" }}
        >
          <AntDesign name="google" size={20} style={{ color: "white" }} />
          <Text
            style={{
              fontSize: 20,
              marginLeft: 10,
              color: "#fff",
              fontFamily: "nunito-regular",
            }}
          >
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
