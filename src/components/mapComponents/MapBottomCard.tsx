import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { PetPin } from "../../types/mapTypes";

const BOTTOM_CARD_HEIGHT = 180;

interface MapBottomCardProps {
  selected: PetPin | null;
  isMarked: boolean;
  onViewMore: () => void;
  onMark: () => void;
  onClose: () => void;
}

export const MapBottomCard: React.FC<MapBottomCardProps> = ({
  selected,
  isMarked,
  onViewMore,
  onMark,
  onClose,
}) => {
  return (
    <View style={[styles.bottomCard, { height: BOTTOM_CARD_HEIGHT }]}>
      {selected ? (
        <>
          <Image source={{ uri: selected.image }} style={styles.bottomImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomTitle}>
              {selected.label === "PERDIDO" ? "Perdido" : "Avistamiento"}
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <TouchableOpacity onPress={onViewMore} style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>Ver más</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onMark} style={styles.btnOutline}>
                <Text style={styles.btnOutlineText}>
                  {isMarked ? "Desmarcar" : "Marcar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                fontSize: 22,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              ×
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ fontWeight: "700", color: "#333" }}>
          Seleccioná un cuadradito del mapa
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomCard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    zIndex: 3,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  bottomImg: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  bottomTitle: {
    fontWeight: "800",
    fontSize: 16,
  },

  btnPrimary: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },

  btnOutline: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnOutlineText: {
    color: "#333",
    fontWeight: "700",
  },
});
