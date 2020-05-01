import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

export default function Buttons({ start }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.start} onPress={start}>
        <Text
          style={{
            fontFamily: "nunito-regular",
            color: "white",
            letterSpacing: 1,
          }}
        >
          Start Challenge
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.scoreboard}
        onPress={console.log("pressed")}
      >
        <Text
          style={{
            fontFamily: "nunito-regular",
            color: "#d35400",
            letterSpacing: 1,
          }}
        >
          ScoreBoard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "center",
  },
  start: {
    paddingVertical: 10,
    borderRadius: 450,
    paddingHorizontal: 30,
    marginRight: 30,
    backgroundColor: "#d35400",
  },
  scoreboard: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 450,
    paddingHorizontal: 30,
    borderColor: "#d35400",
  },
});
