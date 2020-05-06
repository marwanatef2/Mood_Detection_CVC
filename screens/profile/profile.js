import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Content from "./content";
import Buttons from "./buttons";
import FriendsList from "./friendsList";
import axios from "axios";

export default function Profile({ navigation }) {
  // navigation.popToTop();
  const [user, setUser] = useState({
    email: navigation.getParam("email"),
    name: navigation.getParam("name"),
    pic: navigation.getParam("picture"),
  });
  const [notifications, setNotifications] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function fetchNotifications() {
      axios
        .post("https://marwanatef2.pythonanywhere.com/notifications", {
          myemail: user.email,
        })
        .then((res) => {
          setNotifications(res.data.notifications);
          setLoaded(true);
        });
    }

    fetchNotifications();
  }, []);
  const returnHome = () => {
    setUser(null);
    navigation.popToTop();
  };

  const start = () => {
    navigation.navigate("StartChallenge", {
      email: user.email,
    });
  };
  if (loaded)
    return (
      <ScrollView onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={returnHome}>
            <ImageBackground
              source={require("../../assets/cover.jpg")}
              style={{ ...styles.wrapper }}
              overlayColor="#444"
              opacity={1}
              // borderRadius={90}
              // borderColor="#ddd"
              // borderWidth={15}
              // blurRadius={0}
            >
              <View style={{ height: 200, backgroundColor: "rgba(0,0,0,0.2)" }}>
                <Text> </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.content}>
            <Content name={user.name} pic={user.pic} />
            <Buttons
              returnHome={returnHome}
              start={start}
              notifications={notifications}
            />
          </View>
          <FriendsList style={{}} loggedEmail={user.email} />
        </View>
      </ScrollView>
    );
  else
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "red", height: 200 },
  content: {
    position: "relative",
    top: -60,
    // left: Dimensions.get("screen").width / 6.5,
  },
});
