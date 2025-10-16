"use client";

import type React from "react";
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../theme/fonts";
import { PetPost } from "../types/petPots";
import { Pressable } from "react-native";

type HealthModalProps = {
  visible: boolean;
  onClose: () => void;
  pet: PetPost;
};

type EnergyLevel = "low" | "medium" | "high";

const BehaviorModalStackScreen: React.FC<HealthModalProps> = ({
  visible,
  onClose,
  pet,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <View style={styles.headerDragIndicator} />
            <View style={styles.headerContent}>
              <Text style={[{ fontFamily: fonts.bold }, styles.title]}>
                Comportamiento y convivencia
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#636e72" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {pet.goodWithKids && (
                <>
                  <View style={styles.optionRow}>
                    <Ionicons name="happy-outline" size={24} color="#333" />
                    <View style={styles.optionContent}>
                      <Text
                        style={[{ fontFamily: fonts.bold }, styles.optionTitle]}
                      >
                        ¿Se lleva bien con niños?
                      </Text>
                    </View>
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.answerText]}
                    >
                      {pet.goodWithKids}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </>
              )}

              {pet.goodWithOtherPets && (
                <>
                  <View style={styles.optionRow}>
                    <Ionicons name="paw-outline" size={24} color="#333" />
                    <View style={styles.optionContent}>
                      <Text
                        style={[{ fontFamily: fonts.bold }, styles.optionTitle]}
                      >
                        ¿Se lleva bien con otras mascotas?
                      </Text>
                    </View>
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.answerText]}
                    >
                      {pet.goodWithOtherPets}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </>
              )}

              {pet.friendlyWithStrangers && (
                <>
                  <View style={styles.optionRow}>
                    <Ionicons name="people-outline" size={24} color="#333" />
                    <View style={styles.optionContent}>
                      <Text
                        style={[{ fontFamily: fonts.bold }, styles.optionTitle]}
                      >
                        ¿Es sociable con extraños?
                      </Text>
                    </View>
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.answerText]}
                    >
                      {pet.friendlyWithStrangers}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </>
              )}

              {pet.needsWalks && (
                <>
                  <View style={styles.optionRow}>
                    <Ionicons name="walk-outline" size={24} color="#333" />
                    <View style={styles.optionContent}>
                      <Text
                        style={[{ fontFamily: fonts.bold }, styles.optionTitle]}
                      >
                        ¿Necesita paseos diarios?
                      </Text>
                    </View>
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.answerText]}
                    >
                      {pet.needsWalks}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </>
              )}

              {pet.energyLevel && (
                <>
                  <View style={styles.energySection}>
                    <Text
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.energyLabel,
                      ]}
                    >
                      Nivel de energía
                    </Text>
                    <View style={styles.energySelector}>
                      <TouchableOpacity
                        style={[
                          styles.energyOption,
                          styles.energyOptionFirst,
                          pet.energyLevel === "bajo" &&
                            styles.energyOptionSelected,
                        ]}
                        onPress={() => {}}
                      >
                        <Ionicons
                          name="battery-dead-outline"
                          size={20}
                          color={pet.energyLevel === "low" ? "#fff" : "#666"}
                        />
                        <Text
                          style={[
                            { fontFamily: fonts.bold },
                            styles.energyOptionText,
                            pet.energyLevel === "bajo" &&
                              styles.energyOptionTextSelected,
                          ]}
                        >
                          Bajo
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.energyOption,
                          pet.energyLevel === "medio" &&
                            styles.energyOptionSelected,
                        ]}
                        onPress={() => {}}
                      >
                        <Ionicons
                          name="battery-half-outline"
                          size={20}
                          color={pet.energyLevel === "medio" ? "#fff" : "#666"}
                        />
                        <Text
                          style={[
                            { fontFamily: fonts.bold },
                            styles.energyOptionText,
                            pet.energyLevel === "medio" &&
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
                          pet.energyLevel === "alto" &&
                            styles.energyOptionSelected,
                        ]}
                        onPress={() => {}}
                      >
                        <Ionicons
                          name="battery-full-outline"
                          size={20}
                          color={pet.energyLevel === "alto" ? "#fff" : "#666"}
                        />
                        <Text
                          style={[
                            { fontFamily: fonts.bold },
                            styles.energyOptionText,
                            pet.energyLevel === "alto" &&
                              styles.energyOptionTextSelected,
                          ]}
                        >
                          Alto
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
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
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerDragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
  },
  title: {
    fontSize: 18,

    color: "#2d3436",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  container: {
    paddingVertical: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    color: "#111827",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#667eea",
    marginTop: 2,
    fontWeight: "500",
  },
  answerText: {
    fontSize: 15,
    color: "#6B7280",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 20,
  },
  expandableSection: {
    marginTop: 8,
  },
  expandableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  expandedText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
  energySection: {
    padding: 16,
  },
  energyLabel: {
    fontSize: 16,
    color: "#000",
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
    backgroundColor: "#667eea",
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

export default BehaviorModalStackScreen;
