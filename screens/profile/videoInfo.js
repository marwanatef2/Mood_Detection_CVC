import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Thumbnail } from "react-native-thumbnail-video";

export default function Video({ video }) {
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
      onPress={() => console.log("video pressed")}
      style={{
        flex: 1,

        padding: 10,
        flexDirection: "row",
        alignContent: "center",
        borderBottomWidth: 2,
        marginVertical: 10,
      }}
    >
      {thumb && (
        <Thumbnail
          url="https://www.youtube.com/watch?v=p32OC97aNqc&t"
          style={{ width: 50, height: 50, borderRadius: 100 }}
          showPlayIcon={false}
          onPress={() => console.log(1)}
        />
      )}
      <Text style={{ alignSelf: "center", marginHorizontal: 10 }}>{video}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
