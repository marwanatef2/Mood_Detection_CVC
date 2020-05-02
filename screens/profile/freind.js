import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";

export default function Friend({ name }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.textinput}>{name}</Text>
      <View style={{}}>
        <Button title="challenge" color="#e67e22" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#d35400",
  },
  textinput: {
    borderColor: "#e67e22",
    fontSize: 18,
    color: "#d35400",
    paddingRight: 180,
    fontFamily: "nunito-bold",
  },
});