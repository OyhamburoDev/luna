import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PetBehaviorInfo from "./PetBehaviorInfo";
import { fonts } from "../theme/fonts";

type PetBehaviorData = {
  goodWithKids: string;
  goodWithOtherPets: string;
  friendlyWithStrangers: string;
  needsWalks: string;
  energyLevel: string;
};

type BehaviorModalProps = {
  visible: boolean;
  onClose: () => void;
  behaviorData: PetBehaviorData;
  onBehaviorChange: (field: keyof PetBehaviorData, value: string) => void;
  onFieldEdit?: (fieldType: string) => void;
};

const BehaviorModal: React.FC<BehaviorModalProps> = ({
  visible,
  onClose,
  behaviorData,
  onBehaviorChange,
  onFieldEdit,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Comportamiento y convivencia</Text>
            <View style={styles.placeholder} />
          </View>

          <PetBehaviorInfo
            behaviorData={behaviorData}
            onBehaviorChange={onBehaviorChange}
            onFieldEdit={onFieldEdit}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 32,
  },
});

export default BehaviorModal;
