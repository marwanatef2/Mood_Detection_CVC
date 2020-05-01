import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import Content from "./content";
import Buttons from "./buttons";
import FriendsList from "./friendsList";

export default function Profile({ navigation }) {
  // navigation.popToTop();
  const [user, setUser] = useState({
    email: navigation.getParam("email"),
    name: navigation.getParam("name"),
    pic: navigation.getParam("picture"),
  });
  const returnHome = () => {
    setUser(null);
    navigation.popToTop();
  };

  const start = () => {
    navigation.navigate("Camera");
  };
  if (user != null)
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={returnHome}>
            <ImageBackground
              source={require("../../assets/cover.jpg")}
              style={{ ...styles.wrapper }}
              overlayColor="#444"
              opacity={1}
              // borderRadius={90}
              // borderColor="#ddd"
              // borderWidth={15}
              // blurRadius={0}
            >
              <View style={{ height: 200, backgroundColor: "rgba(0,0,0,0.2)" }}>
                <Text> </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.content}>
            <Content name={user.name} pic={user.pic} />
            <Buttons returnHome={returnHome} start={start} />
          </View>
          <FriendsList style={{}} />
        </View>
      </TouchableWithoutFeedback>
    );
  else return <Text>zeez</Text>;
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "red", height: 200 },
  content: {
    position: "relative",
    top: -60,
    // left: Dimensions.get("screen").width / 6.5,
  },
});
