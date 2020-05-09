// this is the view that render the info of the friend it takes page as a prop to know in which screen it is and to render the suitable data

import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Animated } from "react-native";
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
  const fadeAnim = useState(new Animated.Value(0))[0];

  // function to animate the selected friend for challenge and add it to the challengers array
  const pressHandle = (email) => {
    if (!chosen) {
      Animated.timing(fadeAnim, {
        toValue: 300,
        duration: 800,
      }).start();
      addChallenger(email);
      setChosen(true);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
      }).start();
      removeChallenger(email);
      setChosen(false);
    }
  };
  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          backgroundColor: fadeAnim.interpolate({
            inputRange: [0, 255],
            outputRange: ["#eee", "#444"],
          }),
        },
      ]}
    >
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
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
