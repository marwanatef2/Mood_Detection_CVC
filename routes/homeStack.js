import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Home from "../screens/home";
import login from "../screens/login";
import Profile from "../screens/profile";
import Header from "../shared/header";
import React from "react";
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
