// import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Home from "../screens/home";
import login from "../screens/login";
import Profile from "../screens/profile/profile";
import Camera from "../screens/camera/camera";
import Header from "../shared/header";
import React from "react";

import { MaterialIcons } from "@expo/vector-icons";
const screens = {
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      const { routeName, routes } = navigation.state;
      return {
        tabBarIcon: ({ focused, tintColor }) => {
          // You can return any component that you like here!
          // We usually create an icon component rendering some svg
          return <MaterialIcons name="notifications" size={20} />;
        },
      };
    },
  },
};

const ProfileStack = createBottomTabNavigator(screens, {
  defaultNavigationOptions: {
    tabBarOptions: {
      activeTintColor: "white",
      inactiveTintColor: "#263238",
      style: {
        backgroundColor: "#aaa",

        padding: 10,
        borderWidth: 1,
        borderColor: "#aaa",
        elevation: 4,
        height: 50,
      },
      tabStyle: {
        // padding: 15,
        padding: 20,
        borderRadius: 900,

        width: 20,
        marginHorizontal: 10,
        alignContent: "center",
        justifyContent: "center",
      },
      labelStyle: {
        fontSize: 10,
        fontFamily: "nunito-bold",
        letterSpacing: 1,
        marginTop: 12,
      },
      labelPosition: "below-icon",
    },
  },
});

export default ProfileStack;
