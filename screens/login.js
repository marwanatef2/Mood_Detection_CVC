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
  // this function handle signup process as it goes to our server route that is responsible for the login logic
  const handleSignUp = () => {
    WebBrowser.openBrowserAsync("https://marwanatef2.pythonanywhere.com/login");
  };

  // Add event listener to linking object so we can know when the user has already finished loggin in and then retrive his data and redirect him to the profile page containg his info

  Linking.addEventListener("url", (url) => {
    // parsing the url that is returned from the server containg the user's info
    let { path, queryParams } = Linking.parse(url.url);

    // creating user object with his info
    let loggedUser = {
      name: queryParams["name"],
      email: queryParams["email"],
      picture: queryParams["pic"],
      exists: queryParams["exists"],
    };

    // Navigating to the profile screen and adding to it a param to retrieve that contains the user info
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
