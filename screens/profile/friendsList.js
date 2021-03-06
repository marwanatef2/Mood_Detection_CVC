// view that show the add friend and the friend list in the profile page

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

  // function to set the name of the friend that the user has entered his email
  const setName = (name) => {
    setFriendName(name);
    // console.log(friendName);
  };

  // function fired when the user press the add friend button , it send request to the /addfriend route  with logged user email and the friend email as data to the server
  const handleAddFriend = async () => {
    axios
      .post("https://marwanatef2.pythonanywhere.com/addfriend", {
        myemail: loggedEmail,
        email: friendName,
      })
      .then((res) => {
        setResponse(res.data.added);
        setLoaded(false);
        fetchFriends();
      });
  };

  // function fired when user press the delete icon to delete the friend , it goes to /remove with logged user email and the email of the deleted friend
  const handleDeleteFriend = async (mail) => {
    axios
      .post("https://marwanatef2.pythonanywhere.com/remove", {
        myemail: loggedEmail,
        email: mail,
      })
      .then((res) => {
        setLoaded(false);
        setResponse(false);
        fetchFriends();
      });
  };

  // function to fetch the logged user friends to show it in the list by requesting /friends from the server and returning friends object and save it to the state so we can use it later in different screens
  async function fetchFriends() {
    axios
      .post("https://marwanatef2.pythonanywhere.com/friends", {
        myemail: loggedEmail,
      })
      .then((res) => {
        // console.log(res.data.users);
        setFriends(res.data.users);
        setLoaded(true);
      });
  }

  // use effect function is a hook supplied by react that launches when the screen is loaded automatically
  useEffect(() => {
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
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <Friend
                name={item.name}
                page="friend"
                deleteFriend={handleDeleteFriend}
                email={item.email}
              />
            )}
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
