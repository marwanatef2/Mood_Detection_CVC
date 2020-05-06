import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import Friend from "./freind";
export default function friendsList({ returnHome, loggedEmail }) {
  const [loaded, setLoaded] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [response, setResponse] = useState(false);
  const [friends, setFriends] = useState([]);
  const setName = (name) => {
    setFriendName(name);
    // console.log(friendName);
  };

  const handleAddFriend = async () => {
    axios
      .post("https://marwanatef2.pythonanywhere.com/addfriend", {
        myemail: loggedEmail,
        email: friendName,
      })
      .then((res) => {
        setResponse(res.data.added);
      });
  };
  useEffect(() => {
    // console.log("Logged user", loggedEmail);
    async function fetchFriends() {
      axios
        .post("https://marwanatef2.pythonanywhere.com/friends", {
          myemail: loggedEmail,
        })
        .then((res) => {
          setFriends(res.data.users);
          setLoaded(true);
        });
    }

    fetchFriends();
  }, []);
  if (loaded)
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
            placeholder="Enter User Email ..."
          />

          <Button
            title="Add Friend"
            color="#d35400"
            onPress={() => handleAddFriend()}
          />
        </View>
        {response ? (
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            <Text style={styles.confirmationText}>
              You have added {friendName} succesfully
            </Text>
          </View>
        ) : null}

        <View
          style={{
            marginTop: 30,
            flex: 1,
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
            contentContainerStyle={{ paddingBottom: 20 }}
            data={friends}
            renderItem={({ item }) => <Friend name={item.name} />}
            style={{
              padding: 20,
              marginVertical: 10,
            }}
          />
        </View>
      </View>
    );
  else
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  textinput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#e67e22",
    paddingVertical: 2,
    paddingHorizontal: 40,
    marginRight: 20,
    color: "#d35400",
  },
  confirmationText: {
    color: "#a80000",
    fontFamily: "nunito-bold",
    fontSize: 17,
  },
});
