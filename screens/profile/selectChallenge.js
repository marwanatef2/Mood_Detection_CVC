import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";

import { Thumbnail } from "react-native-thumbnail-video";
import YouTube from "react-native-youtube";
import axios from "axios";

import Video from "./videoInfo";

export default function StartChallenge({ start, navigation }) {
  const challengers = navigation.state.params.challengers;
  const loggedEmail = navigation.state.params.loggedEmail;
  const exists = navigation.state.params.exists;
  const [videos, setVideos] = useState([]);
  const getVideos = async () => {
    axios
      .get("https://marwanatef2.pythonanywhere.com/videos")
      .then((res) => {
        setVideos(res.data.videos);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getVideos();
  }, []);
  const handleStartChallenge = (id, uri) => {
    console.log(id);
    axios
      .post("https://marwanatef2.pythonanywhere.com/challenge", {
        myemail: loggedEmail,
        emails: challengers,
        video_id: id,
      })
      .then((res) => {
        console.log(res.data);
        navigation.navigate("Camera", {
          uri: uri,
          email: loggedEmail,
          challengesID: res.data.challenges_ids,
          mar: res.data.mouth_aspect_ratio,
          exists: exists,
          creator: true,
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 30,
          fontFamily: "nunito-bold",
        }}
      >
        Select Video
      </Text>
      <View
        style={{
          padding: 20,
          marginVertical: 10,
        }}
      >
        {videos ? (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <Video video={item} onPress={handleStartChallenge} />
            )}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 10,
  },
});
