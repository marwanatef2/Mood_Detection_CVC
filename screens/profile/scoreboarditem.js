// this is the view that render the info of the friend it takes page as a prop to know in which screen it is and to render the suitable data

import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Animated, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
export default function ScoreBoardItem({
  image,
  name,
  score,
  email,
  userEmail,
}) {
  // function to animate the selected friend for challenge and add it to the challengers array

  return (
    <View
      style={{
        flexDirection: "row",
        alignContent: "center",
        borderBottomWidth: 2,
        paddingHorizontal: 40,
        marginBottom: 30,
        paddingVertical: 10,
        elevation: email === userEmail ? 3 : 0,
      }}
    >
      <Image
        source={{ uri: image }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 100 / 2,
          marginRight: 10,
        }}
      />
      <Text
        style={{
          alignSelf: "center",
          marginRight: 20,
          fontFamily: "nunito-bold",
          fontSize: 20,
        }}
      >
        {name}
      </Text>
      <Text
        style={{ alignSelf: "center", fontSize: 20, fontFamily: "nunito-bold" }}
      >
        {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#d35400",
  },
  textinput: {
    borderColor: "#e67e22",
    fontSize: 18,
    color: "#d35400",
    // paddingRight: 100,
    fontFamily: "nunito-bold",
    width: 200,
  },
});
