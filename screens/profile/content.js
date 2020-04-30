import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image } from "react-native";

export default function Content({ name, pic }) {
  const upper = name.replace(/^\w/, (c) => c.toUpperCase());

  return (
    <View style={styles.wrapper}>
      <Image source={{ uri: pic }} style={styles.headerImage} />
      {/* <Text>{user.email}</Text> */}
      <Text style={styles.username}>{upper}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,

    // backgroundColor: "red",
    alignItems: "center",
  },
  headerImage: {
    width: 150,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 3,
    marginBottom: 6,
  },
  username: {
    fontFamily: "nunito-bold",
    fontSize: 30,
  },
});
