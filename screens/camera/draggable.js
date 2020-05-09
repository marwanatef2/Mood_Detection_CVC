import React, { useState, Children } from "react";
import { Animated, View, StyleSheet, PanResponder, Text } from "react-native";

export default function App(props) {
  const pan = useState(new Animated.ValueXY())[0];

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (_, gesture) => {
        pan.x.setValue(gesture.dx);
        pan.y.setValue(gesture.dy);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  )[0];

  return (
    <Animated.View
      style={[
        props.styles,
        {
          transform: [
            {
              translateX: pan.x,
            },
            {
              translateY: pan.y,
            },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {props.children}
    </Animated.View>
  );
}
