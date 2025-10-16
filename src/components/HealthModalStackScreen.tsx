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
import { PetPost } from "../types/petPots";
import { fonts } from "../theme/fonts";
import { Pressable } from "react-native";

type HealthModalProps = {
  visible: boolean;
  onClose: () => void;
  pet: PetPost;
};

const HealthModalStackScreen: React.FC<HealthModalProps> = ({
  visible,
  onClose,
  pet,
}) => {
  const [expandedInfo, setExpandedInfo] = useState(false);

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
                Información de Salud
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
              {pet.isVaccinated && (
                <>
                  <View style={styles.optionRow}>
                    <Ionicons
                      name="medical-outline"
                      size={28}
                      color="#1F2937"
                    />
                    <View style={styles.optionContent}>
                      <Text
                        style={[{ fontFamily: fonts.bold }, styles.optionTitle]}
                      >
                        ¿Está vacunado/a?
                      </Text>
                    </View>
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.answerText]}
                    >
                      {pet.isVaccinated}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </>
              )}

              {pet.isNeutered && (
                <>
                  <View style={styles.optionRow}>
                    <Ionicons name="cut-outline" size={28} color="#1F2937" />
                    <View style={styles.optionContent}>
                      <Text
                        style={[{ fontFamily: fonts.bold }, styles.optionTitle]}
                      >
                        ¿Está castrado/a?
                      </Text>
                    </View>
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.answerText]}
                    >
                      {" "}
                      {pet.isNeutered}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </>
              )}

              {pet.hasMedicalConditions && (
                <>
                  <View style={styles.optionRow}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={28}
                      color="#1F2937"
                    />
                    <View style={styles.optionContent}>
                      <Text
                        style={[{ fontFamily: fonts.bold }, styles.optionTitle]}
                      >
                        ¿Tiene condiciones médicas especiales?
                      </Text>
                    </View>
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.answerText]}
                    >
                      {pet.hasMedicalConditions}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </>
              )}

              {pet.healthInfo && (
                <>
                  <TouchableOpacity
                    style={styles.expandableSection}
                    onPress={() => setExpandedInfo(!expandedInfo)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.expandableHeader}>
                      <Ionicons
                        name="document-text-outline"
                        size={28}
                        color="#1F2937"
                      />
                      <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>
                          Información médica adicional
                        </Text>
                        <Text style={styles.optionSubtitle}>
                          {expandedInfo ? "Ocultar detalles" : "Ver detalles"}
                        </Text>
                      </View>
                      <Ionicons
                        name={
                          expandedInfo
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                        }
                        size={20}
                        color="#9CA3AF"
                      />
                    </View>

                    {expandedInfo && (
                      <View style={styles.expandedContent}>
                        <Text style={styles.expandedText}>
                          {pet.healthInfo}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
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
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#667eea",
    marginTop: 2,
    fontWeight: "500",
  },
  answerText: {
    fontSize: 15,
    fontWeight: "600",
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
});

export default HealthModalStackScreen;
