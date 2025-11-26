import { useState, useRef } from "react";
import { Animated } from "react-native";

export const useFabMenu = () => {
  // 1️⃣ Estados internos del menú
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabAnimation = useRef(new Animated.Value(0)).current;

  // 2️⃣ Función para abrir/cerrar con animación
  const toggleFabMenu = () => {
    const toValue = isFabOpen ? 0 : 1;

    Animated.spring(fabAnimation, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();

    setIsFabOpen(!isFabOpen);
  };

  // 3️⃣ Función helper: ejecuta acción y cierra el menú
  const handleFabAction = (action: () => void) => {
    action();
    toggleFabMenu();
  };

  // 4️⃣ Valores animados (interpolaciones)
  const fabRotation = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const darkModeButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const centerButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const buttonScale = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const buttonOpacity = fabAnimation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 1, 1],
  });

  // 5️⃣ Retornamos TODO lo que MapScreen necesita
  return {
    // Estados
    isFabOpen,

    // Funciones
    toggleFabMenu,
    handleFabAction,

    // Valores animados
    fabRotation,
    darkModeButtonTranslate,
    centerButtonTranslate,
    buttonScale,
    buttonOpacity,
  };
};
