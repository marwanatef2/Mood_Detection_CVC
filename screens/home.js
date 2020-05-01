import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Permissions from "expo-permissions";

export default function home({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      console.log("in use effect");
      const { status } = await Permissions.getAsync(Permissions.CAMERA);
      setHasPermission(status === "granted");
    })();
  }, []);
  return (
    <ImageBackground
      source={require("../assets/backg.jpg")}
      style={styles.container}
    >
      <View style={styles.titlePage}>
        <View style={styles.iconHolder}>
          <Text
            style={{
              fontSize: 45,
              color: "#fff",
              marginRight: 15,
              fontFamily: "nunito-bold",
            }}
          >
            Mood Detector
          </Text>
          <Ionicons name="md-sad" size={45} style={styles.icon} />
          <Feather
            name="more-vertical"
            size={50}
            style={{ ...styles.icon, marginLeft: -15 }}
          />
          <Ionicons name="md-happy" size={45} style={styles.icon} />
        </View>

        <Text
          style={{
            fontSize: 13,
            fontWeight: "100",
            color: "#ddd",
            fontFamily: "nunito-regular",
          }}
        >
          By Team : TITO
        </Text>
      </View>
      <View style={styles.contentView}>
        <Text
          style={{
            marginBottom: 20,
            alignSelf: "center",
            fontSize: 20,
            color: "#fff",
            fontFamily: "nunito-regular",
          }}
        >
          Login:{" "}
        </Text>
        {/* <Button
          title="go to login page"
          onPress={() => navigation.navigate("Login")}
        /> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>login page</Text>
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
    marginTop: 50,
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
    borderColor: "#bbb",
    backgroundColor: "#aaa",
    borderRadius: 10,
  },
  iconHolder: {
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    color: "#eee",
    width: 40,
    paddingTop: 4,
  },
});
