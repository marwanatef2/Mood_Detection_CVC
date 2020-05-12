// screen responsible for showing getting the scores of all friends

import React, { useState } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import Item from "./scoreboarditem";
export default function ScoreBoard({ navigation }) {
  const loggedEmail = navigation.getParam("email");
  const [classV, setClassV] = useState(false);
  const [data, setData] = useState(false);
  const [title, setTitle] = useState("");

  // assign class for color icon and fetch the data based on the clicked icon
  const handleClick = (id) => {
    id == 1 ? setClassV("user") : setClassV("global");
    if (id == 1) {
      setTitle("LeaderBoard");
      axios
        .post("https://marwanatef2.pythonanywhere.com/leaderboard", {
          myemail: loggedEmail,
        })
        .then((res) => {
          setData(res.data.users);
        });
    } else {
      setTitle("ScoreBoard");
      axios
        .get("https://marwanatef2.pythonanywhere.com/scoreboard")
        .then((res) => {
          setData(res.data.users);
        });
    }
  };
  return (
    <View style={styles.wrapper}>
      <Text style={{ fontFamily: "nunito-bold", fontSize: 30 }}>{title}</Text>
      <View style={styles.icons}>
        <AntDesign
          name="user"
          size={30}
          color="black"
          style={
            classV == "user"
              ? { marginHorizontal: 20, color: "#d35400" }
              : { marginHorizontal: 20 }
          }
          onPress={() => handleClick(1)}
        />
        <AntDesign
          name="earth"
          size={30}
          color="black"
          style={
            classV == "global"
              ? { marginHorizontal: 20, color: "#d35400" }
              : { marginHorizontal: 20 }
          }
          onPress={() => handleClick(2)}
        />
      </View>
      <View>
        {data && (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Item
                image={item.image}
                name={item.name}
                score={item.score}
                email={item.email}
                userEmail={loggedEmail}
              />
            )}
            keyExtractor={(item) => item.email}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
  },
  icons: {
    flexDirection: "row",

    padding: 30,
    marginVertical: 20,
  },
});
