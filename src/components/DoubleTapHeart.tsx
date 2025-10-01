import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type DoubleTapHeartProps = {
  isVisible: boolean;
  onAnimationComplete: () => void;
  isLiked: boolean;
};

export default function DoubleTapHeart({
  isVisible,
  onAnimationComplete,
  isLiked,
}: DoubleTapHeartProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );

      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        })
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Ionicons
        name="heart"
        size={120}
        color={isLiked ? "#E91E63" : "#FFFFFF"}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -60,
    marginLeft: -60,
    zIndex: 999,
    pointerEvents: "none",
    elevation: 999,
  },
});
