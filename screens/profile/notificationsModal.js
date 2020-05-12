import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Notification from "./notification";

export default function Modall({
  notifications,
  modalStatus,
  closeModal,
  handlePressChallenge,
}) {
  return (
    <View>
      <Modal visible={modalStatus} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="close"
              size={24}
              onPress={() => closeModal()}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
            />
            <Text
              style={{
                alignSelf: "center",
                marginTop: 30,
                fontSize: 25,
                letterSpacing: 2,
                fontFamily: "nunito-bold",
                color: "#d35400",
              }}
            >
              Notifications
            </Text>
            <FlatList
              contentContainerStyle={{ paddingBottom: 20 }}
              keyExtractor={(item) => item.key.toString()}
              data={notifications}
              renderItem={({ item }) =>
                item.is_challenge ? (
                  <TouchableOpacity
                    onPress={() => {
                      handlePressChallenge(item.key);
                      closeModal();
                    }}
                  >
                    <Notification
                      body={item.body}
                      date={item.datetime}
                      newS={item.new}
                      icon="challenge"
                    />
                  </TouchableOpacity>
                ) : (
                  <View>
                    <Notification
                      body={item.body}
                      date={item.datetime}
                      newS={item.new}
                      icon="friend"
                    />
                  </View>
                )
              }
              style={{
                padding: 20,
                marginVertical: 10,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
  modalToggle: {
    marginBottom: -40,
    color: "#d35400",
    padding: 5,

    alignSelf: "center",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
});
