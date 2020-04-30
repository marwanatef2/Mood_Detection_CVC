import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
} from "react-native";
import Friend from "./freind";
export default function friendsList({ returnHome }) {
  const [friendName, setFriendName] = useState("");

  const setName = (name) => {
    setFriendName(name);
    console.log(friendName);
  };
  const friends = [
    { name: "Zeez", key: 1 },
    { name: "Marwan", key: 2 },
    { name: "Salma B", key: 3 },
    { name: "Salma D", key: 4 },
    { name: "Samir", key: 5 },
    { name: "Samir", key: 6 },
  ];

  return (
    <View style={styles.wrapper}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          onChangeText={(text) => {
            setName(text);
          }}
          style={styles.textinput}
          placeholder="Enter user name"
        />
        <View>
          <Button title="Add Friend" color="#d35400" />
        </View>
      </View>
      <View
        style={{
          marginVertical: 30,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#ba6125",
            fontFamily: "nunito-bold",
            fontSize: 20,
            paddingBottom: 5,
            borderBottomWidth: 1,
            borderColor: "#d32000",
          }}
        >
          Your Friends
        </Text>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <Friend name={item.name} number={item.key} />
          )}
          style={{
            padding: 20,
            marginVertical: 10,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // flexDirection: "row",
    // marginTop: 50,
    // justifyContent: "center",
    flex: 1,
  },
  textinput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#e67e22",
    paddingVertical: 2,
    paddingHorizontal: 30,
    marginRight: 20,
    color: "#d35400",
  },
});
