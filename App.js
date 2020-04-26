import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import axios from "axios";
import { Linking } from "expo";

export default function App() {
  const [username, setUsername] = useState("");

  const getUserInfo = () => {
    Linking.openURL("http://156.204.46.17:5000/login");
    //
    // axios
    //   .get("http://10.0.2.2:5000/zeez")
    //   .then((res) => {
    //     console.log(res.data);
    //     console.log("zeez");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log("zee3ez");
    // fetch("http://10.0.2.2:5000/zeez", {
    //   method: "GET",
    //   //Request Type
    // }).then((response) => console.log("zeez"));
    //If response is in json then in success
  };
  const onChangeText = (text) => {
    setUsername(text);
    console.log(username);
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => onChangeText(text)}
      />
      <Button title="submit" onPress={getUserInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 30,
    padding: 20,
    color: "black",
    paddingBottom: 1,
  },
});
