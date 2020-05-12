// this is the profile screen that renders the user image and friends and also contains the button screen and content screen

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
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
import StartChallenge from "./selectChallenge";

export default function Profile({ navigation }) {
  // retrieve the user that is sent as a param from login screen
  const [user, setUser] = useState({
    email: navigation.getParam("email"),
    name: navigation.getParam("name"),
    pic: navigation.getParam("picture"),
    exists: navigation.getParam("exists"),
  });

  const [notifications, setNotifications] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState(false);

  // fetch the notifications by requesting /notifications and giving it the logged user email as a data
  // returning object notifications
  useEffect(() => {
    async function fetchNotifications() {
      axios
        .post("https://marwanatef2.pythonanywhere.com/notifications", {
          myemail: user.email,
        })
        .then((res) => {
          console.log(res.data.notifications);
          setNotifications(res.data.notifications);
          setLoaded(true);
        });
    }

    fetchNotifications();
  }, []);

  // logout function
  const returnHome = () => {
    setUser(null);
    navigation.popToTop();
  };

  // navigate to StartChallenge screen when user press StartChallenge button
  const start = () => {
    navigation.navigate("StartChallenge", {
      email: user.email,
      exists: user.exists,
    });
  };

  // navigate to the camera and load the specific video for the challenge when user press the notification
  const handlePressChallenge = (key) => {
    // console.log(key);
    axios
      .post("https://marwanatef2.pythonanywhere.com/acceptchallenge", {
        key: key,
      })
      .then((res) => {
        console.log(res.data);
        let { challenge_id, creator, mouth_aspect_ratio, video_uri } = res.data;
        navigation.navigate("Camera", {
          uri: video_uri,
          email: user.email,
          challengesID: challenge_id,
          mar: mouth_aspect_ratio,
          exists: user.exists,
          creator: false,
        });
      })
      .catch((err) => console.log(err));
  };

  //navigate to ScoreBoard and give it the email to fetch the user's friend and show there scores
  const handlePressScoreBoard = () => {
    navigation.navigate("ScoreBoard", {
      email: user.email,
    });
  };
  if (loaded)
    return (
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
            email={user.email}
            exists={user.exists}
            handlePressChallenge={handlePressChallenge}
            handlePressScoreBoard={handlePressScoreBoard}
          />
        </View>
        {msg && <Text style={{ fontSize: 40, color: "black" }}>{msg}</Text>}
        <FriendsList style={{}} loggedEmail={user.email} />
      </View>
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
