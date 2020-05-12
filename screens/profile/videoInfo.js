import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Thumbnail } from "react-native-thumbnail-video";

export default function Video({ video, onPress }) {
  const [thumb, setThumb] = useState(false);
  const generateThumbnail = async (url) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
        time: 10000,
      });
      setThumb(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  // useEffect(() => {
  //   generateThumbnail(video);
  // }, []);
  return (
    <TouchableOpacity
      onPress={() => onPress(video.key, video.uri)}
      style={{
        flex: 1,

        padding: 10,
        flexDirection: "row",
        alignContent: "center",
        borderBottomWidth: 2,
        marginVertical: 10,
      }}
    >
      <Thumbnail
        url={video.youtube_link}
        style={{ width: 50, height: 50, borderRadius: 100 }}
        showPlayIcon={false}
        onPress={() => console.log(1)}
      />

      <Text style={{ alignSelf: "center", marginHorizontal: 10 }}>
        {video.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
