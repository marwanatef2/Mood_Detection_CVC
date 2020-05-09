// screen responsible for showing Notification data it gets the body and date and whether it is new or old Notification

import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
export default function Notification({ body, date, newS }) {
  return (
    <View
      style={
        newS ? { ...styles.container, ...styles.new } : { ...styles.container }
      }
    >
      <View style={styles.wrapper}>
        <FontAwesome5
          name="user-friends"
          size={25}
          style={{ color: "#e6af22" }}
        />
        <Text style={styles.textinput}>{body}</Text>
      </View>

      <View style={styles.date}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  container: {
    marginBottom: 20,

    borderBottomWidth: 1,
  },
  new: {
    elevation: 1,
    backgroundColor: "#ddd",
  },
  textinput: {
    borderColor: "#e67e22",
    fontSize: 18,
    color: "#d35400",

    fontFamily: "nunito-bold",
    marginLeft: 10,
  },
  date: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 5,
  },
  dateText: {
    color: "#d35400",
    fontSize: 10,
    fontFamily: "nunito-regular",
    letterSpacing: 2,
  },
});
