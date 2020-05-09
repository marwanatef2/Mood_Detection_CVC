import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Modall from "./notificationsModal";

export default function Buttons({ start, notifications, email }) {
  const [modalOpen, setModalOpen] = useState(false);
  let count = 0;
  if (notifications) {
    notifications.forEach((item) => {
      if (item.new) count++;
    });
  }

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => setModalOpen(true)}>
        <Text style={styles.newNotifications}>{count}</Text>
      </TouchableWithoutFeedback>
      <MaterialIcons
        name="notifications"
        size={35}
        onPress={() => setModalOpen(true)}
        style={styles.modalToggle}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.start} onPress={start}>
          <Text
            style={{
              fontFamily: "nunito-regular",
              color: "white",
              letterSpacing: 1,
            }}
          >
            Start Challenge
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scoreboard}>
          <Text
            style={{
              fontFamily: "nunito-regular",
              color: "#d35400",
              letterSpacing: 1,
            }}
          >
            ScoreBoard
          </Text>
        </TouchableOpacity>
        <Modall
          modalStatus={modalOpen}
          notifications={notifications}
          closeModal={closeModal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "center",
  },
  start: {
    paddingVertical: 10,
    borderRadius: 450,
    paddingHorizontal: 30,
    marginRight: 40,
    backgroundColor: "#d35400",
  },
  scoreboard: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 450,
    paddingHorizontal: 30,
    borderColor: "#d35400",
  },
  modalToggle: {
    marginBottom: -40,
    color: "#d35400",
    padding: 5,

    alignSelf: "center",
  },
  newNotifications: {
    position: "absolute",
    left: "48.2%",
    top: 9,
    zIndex: 1,
    padding: 5,
    color: "#fff",
  },
});
