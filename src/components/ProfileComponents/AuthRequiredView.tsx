import React from "react";
import { useAuthModalContext } from "../../contexts/AuthModalContext";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { fonts } from "../../theme/fonts";
import { textStyles } from "../../theme/textStyles";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "react-native";

type Props = {
  title: string;
  icon: string;
  description: string;
  buttonLabel: string;
};

export const AuthRequiredView = ({
  title,
  icon,
  description,
  buttonLabel,
}: Props) => {
  const { openModal } = useAuthModalContext();

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content", true);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <Text style={[textStyles.title, styles.headerTitle]}>{title}</Text>
      </View>
      <View style={styles.authRequiredContainer}>
        <View style={styles.authRequiredContent}>
          <Ionicons name={icon as any} size={80} color="#00000034" />

          {/* <Text style={styles.authRequiredTitle}>Inicia sesión</Text> */}
          <Text
            style={[
              { fontFamily: fonts.semiBold },
              styles.authRequiredSubtitle,
            ]}
          >
            {description}
          </Text>

          <Pressable
            style={styles.authRequiredButton}
            onPress={() => openModal("login", "#000000")}
          >
            <Text
              style={[
                { fontFamily: fonts.bold },
                styles.authRequiredButtonText,
              ]}
            >
              {buttonLabel}
            </Text>
          </Pressable>

          {/* <Pressable
            style={styles.authRequiredButtonSecondary}
            onPress={() => openModal("register")}
          >
            <Text style={styles.authRequiredButtonTextSecondary}>
              Crear cuenta
            </Text>
          </Pressable> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#00000012",
  },
  headerTitle: { fontSize: 18 },
  authRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authRequiredContent: {
    alignItems: "center",
    maxWidth: 250,
  },
  authRequiredSubtitle: {
    fontSize: 16,
    color: "#00000065",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
    marginTop: 13,
  },
  authRequiredButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 9,
    marginBottom: 12,
    width: "100%",
  },
  authRequiredButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  authRequiredButtonSecondary: {
    borderWidth: 1,
    borderColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 10,
    width: "100%",
  },
  authRequiredButtonTextSecondary: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
