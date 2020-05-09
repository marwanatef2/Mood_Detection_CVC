import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Button,
  Image,
} from "react-native";
import { Thumbnail } from "react-native-thumbnail-video";

import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";

export default function StartChallenge({ start, navigation }) {
  const [image, setImage] = useState(false);
  // const challengers = navigation.state.params;
  // console.log(challengers);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        require("../../assets/videos/blog.mp4"),
        {
          time: 10000,
        }
      );
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={generateThumbnail} title="Generate thumbnail" />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Text>{image}</Text>
      <Thumbnail
        url="https://www.youtube.com/watch?v=3gArYyLwPqI"
        showPlayIcon={false}
        onPress={() => console.log("pressed zeez")}
        imageHeight={200}
        imageWidth={200}
        containerStyle={{ borderRadius: 100, overflow: "hidden" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
