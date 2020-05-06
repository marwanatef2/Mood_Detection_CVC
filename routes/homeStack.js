import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import Home from "../screens/home";
import login from "../screens/login";
import Profile from "../screens/profile/profile";
import Camera from "../screens/camera/camera";
import Header from "../shared/header";
import React from "react";
import ProfileStack from "./profileStack";
import StartChallenge from "../screens/profile/startChallenge";
const screens = {
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="TITO" />,
      };
    },
  },

  Login: {
    screen: login,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="LogIn" />,
      };
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Profile" />,
      };
    },
  },
  StartChallenge: {
    screen: StartChallenge,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <Header navigation={navigation} title="Select Friends" />
        ),
      };
    },
  },
  Camera: {
    screen: Camera,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Challenge" />,
      };
    },
  },
};

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: "#222",
    headerStyle: {
      backgroundColor: "#ddd",
      height: 100,
    },
  },
});

export default createAppContainer(HomeStack);
