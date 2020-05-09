import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import Home from "../screens/home";
import login from "../screens/login";
import Profile from "../screens/profile/profile";
import Camera from "../screens/camera/camera";
import Header from "../shared/header";
import React from "react";

import SelectChallege from "../screens/profile/selectChallenge";
import StartChallenge from "../screens/profile/startChallenge";
import App from "../screens/camera/draggable";

// Intializing the screens first and give it the screen component and its options

const screens = {
  Home: {
    screen: SelectChallege,
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
  SelectChallenge: {
    screen: SelectChallege,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <Header navigation={navigation} title="Select Video" />
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

// Create the Main stack for the application so we can navigate throught pages and then export it to App.js so we can use it

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: "#222",
    headerStyle: {
      backgroundColor: "#ddd",
      height: 100,
    },
    headerTitleAlign: "center",
    headerBackAllowFontScaling: true,
    headerBackTitleVisible: false,
    headerPressColorAndroid: "#d35400",
    headerTitleContainerStyle: {
      flex: 1,

      alignContent: "center",
      justifyContent: "center",
    },
  },
});

export default createAppContainer(HomeStack);
