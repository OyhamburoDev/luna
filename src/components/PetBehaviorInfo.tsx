import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PetBehaviorData = {
  goodWithKids: string;
  goodWithOtherPets: string;
  friendlyWithStrangers: string;
  needsWalks: string;
  energyLevel: string;
};

type PetBehaviorInfoProps = {
  behaviorData: PetBehaviorData;
  onBehaviorChange: (field: keyof PetBehaviorData, value: string) => void;
  onFieldEdit?: (fieldType: string) => void;
};

const PetBehaviorInfo: React.FC<PetBehaviorInfoProps> = ({
  behaviorData,
  onBehaviorChange,
  onFieldEdit,
}) => {
  return (
    <View style={styles.container}>
      {/* Botones estilo opciones para preguntas de comportamiento */}
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("goodWithKids")}
      >
        <Ionicons name="happy-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>¿Se lleva bien con niños?</Text>
          <Text style={styles.optionSubtitle}>
            {behaviorData.goodWithKids || "Seleccionar"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("goodWithOtherPets")}
      >
        <Ionicons name="paw-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>
            ¿Se lleva bien con otras mascotas?
          </Text>
          <Text style={styles.optionSubtitle}>
            {behaviorData.goodWithOtherPets || "Seleccionar"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("friendlyWithStrangers")}
      >
        <Ionicons name="people-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>¿Es sociable con extraños?</Text>
          <Text style={styles.optionSubtitle}>
            {behaviorData.friendlyWithStrangers || "Seleccionar"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("needsWalks")}
      >
        <Ionicons name="walk-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>¿Necesita paseos diarios?</Text>
          <Text style={styles.optionSubtitle}>
            {behaviorData.needsWalks || "Seleccionar"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Nivel de energía con selector especial */}
      <View style={styles.energySection}>
        <Text style={styles.energyLabel}>Nivel de energía</Text>
        <View style={styles.energySelector}>
          <TouchableOpacity
            style={[
              styles.energyOption,
              styles.energyOptionFirst,
              behaviorData.energyLevel === "bajo" &&
                styles.energyOptionSelected,
            ]}
            onPress={() => onBehaviorChange("energyLevel", "bajo")}
          >
            <Ionicons
              name="battery-dead-outline"
              size={20}
              color={behaviorData.energyLevel === "bajo" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.energyOptionText,
                behaviorData.energyLevel === "bajo" &&
                  styles.energyOptionTextSelected,
              ]}
            >
              Bajo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.energyOption,
              behaviorData.energyLevel === "medio" &&
                styles.energyOptionSelected,
            ]}
            onPress={() => onBehaviorChange("energyLevel", "medio")}
          >
            <Ionicons
              name="battery-half-outline"
              size={20}
              color={behaviorData.energyLevel === "medio" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.energyOptionText,
                behaviorData.energyLevel === "medio" &&
                  styles.energyOptionTextSelected,
              ]}
            >
              Medio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.energyOption,
              styles.energyOptionLast,
              behaviorData.energyLevel === "alto" &&
                styles.energyOptionSelected,
            ]}
            onPress={() => onBehaviorChange("energyLevel", "alto")}
          >
            <Ionicons
              name="battery-full-outline"
              size={20}
              color={behaviorData.energyLevel === "alto" ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.energyOptionText,
                behaviorData.energyLevel === "alto" &&
                  styles.energyOptionTextSelected,
              ]}
            >
              Alto
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  energySection: {
    padding: 16,
  },
  energyLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
    marginBottom: 12,
  },
  energySelector: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  energyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  energyOptionFirst: {
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
  },
  energyOptionLast: {
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
    borderRightWidth: 0,
  },
  energyOptionSelected: {
    backgroundColor: "#6366F1",
  },
  energyOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  energyOptionTextSelected: {
    color: "#fff",
  },
});

export default PetBehaviorInfo;
