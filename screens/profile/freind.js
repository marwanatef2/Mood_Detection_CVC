import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
export default function Friend({
  name,
  email,
  addChallenger,
  removeChallenger,
  page,
  deleteFriend,
}) {
  const [chosen, setChosen] = useState(false);

  const pressHandle = (email) => {
    if (!chosen) {
      addChallenger(email);
      setChosen(true);
    } else {
      removeChallenger(email);
      setChosen(false);
    }
  };
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.textinput}>
          {`${name}  `}
          {chosen && <AntDesign name="checkcircle" size={17} color="#10ac84" />}
        </Text>
      </View>

      <View style={{}}>
        {page === "start" ? (
          <Button
            title="challenge"
            color="#e67e22"
            onPress={() => {
              if (pressHandle) pressHandle(email);
            }}
          />
        ) : (
          <Entypo
            name="remove-user"
            size={25}
            color="#147cd6"
            onPress={() => deleteFriend(email)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#d35400",
  },
  textinput: {
    borderColor: "#e67e22",
    fontSize: 18,
    color: "#d35400",
    // paddingRight: 100,
    fontFamily: "nunito-bold",
    width: 200,
  },
});
