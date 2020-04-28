import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/home";
import login from "../screens/login";

const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      title: "TITO",
    },
  },

  Login: {
    screen: login,
    navigationOptions: {
      title: "Login",
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
