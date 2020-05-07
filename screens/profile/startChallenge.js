import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Button,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import Modall from "./notificationsModal";
import Friend from "./freind";

export default function StartChallenge({ start, navigation }) {
  const loggedEmail = navigation.getParam("email");
  const [friends, setFriends] = useState([]);
  const [loaad, setLoaded] = useState(false);
  let challengers = [];
  const addChallenger = (email) => {
    challengers.push(email);
    // console.log(challengers);
  };
  const removeChallenger = (email) => {
    let b = challengers.filter((c) => c !== email);
    challengers = b;
    // console.log(challengers);
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

  return (
    <View>
      <Text
        style={{
          paddingHorizontal: 40,
          paddingVertical: 20,
          fontFamily: "nunito-bold",
          fontSize: 20,
        }}
      >
        Select your friends who you want challenge (You can choose more than
        one)
      </Text>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <Text
          style={{
            color: "#e67e22",
            fontSize: 18,
            fontFamily: "nunito-regular",
          }}
        >
          Friends List
        </Text>
        <FlatList
          contentContainerStyle={{ paddingBottom: 0 }}
          data={friends}
          renderItem={({ item }) => (
            <Friend
              name={item.name}
              email={item.email}
              addChallenger={addChallenger}
              removeChallenger={removeChallenger}
            />
          )}
          style={{
            padding: 0,
            marginVertical: 10,
          }}
        />
        <Button title="next" color="#e67e22" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});