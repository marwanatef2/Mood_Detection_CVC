import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image } from "react-native";

export default function Profile({ navigation }) {
  const [user, setUser] = useState({
    email: navigation.getParam("email"),
    name: navigation.getParam("name"),
    pic: navigation.getParam("picture"),
  });
  return (
    <View>
      <Text>Profile Page </Text>
      <Text>{user.email}</Text>
      <Text>{user.name}</Text>
      <Image source={{ uri: user.pic }} style={styles.headerImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 200,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 100,
  },
});
