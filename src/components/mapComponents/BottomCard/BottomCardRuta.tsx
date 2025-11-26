import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { fonts } from "../../../theme/fonts";

interface RouteInfo {
  distance: number;
  duration: number;
  destinationName: string;
}

interface BottomCardRutaProps {
  routeInfo?: RouteInfo | null;
}

export const BottomCardRuta: React.FC<BottomCardRutaProps> = ({
  routeInfo,
}) => {
  // Función para abrir Google Maps
  const openInMaps = () => {
    if (!routeInfo) return;

    const destination = encodeURIComponent(routeInfo.destinationName);
    const url = Platform.select({
      ios: `maps://app?daddr=${destination}`,
      android: `google.navigation:q=${destination}`,
    });

    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback a Google Maps web
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${destination}`
          );
        }
      });
    }
  };

  return (
    <View style={styles.containerRoute}>
      {/* Handle para deslizar */}
      <View style={styles.handleBarContainer}>
        <View style={styles.handleBar} />
      </View>

      <View style={styles.routeMainTitleCnt}>
        <Text style={styles.routeMainTitle}>Ruta a la mascota</Text>
        <Text style={styles.routeAddress}>
          {routeInfo?.destinationName || "Cargando..."}
        </Text>
      </View>

      {/* Info de la ruta */}
      <View style={styles.routeInfoContainer}>
        <View style={styles.routeInfoItem}>
          <Text style={styles.routeInfoLabel}>Distancia</Text>
          <Text style={styles.routeInfoValue}>
            {routeInfo?.distance
              ? `${routeInfo.distance.toFixed(1)} km`
              : "Calculando..."}
          </Text>
        </View>
        <View style={styles.routeInfoDivider} />
        <View style={styles.routeInfoItem}>
          <Text style={styles.routeInfoLabel}>Tiempo estimado</Text>
          <Text style={styles.routeInfoValue}>
            {routeInfo?.duration
              ? `${Math.round(routeInfo.duration)} min`
              : "Calculando..."}
          </Text>
        </View>
      </View>

      {/* Botón grande para abrir en Maps */}
      <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
        <Text style={styles.openMapsButtonText}>Iniciar navegación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerRoute: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  handleBarContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  routeMainTitleCnt: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 12,
    marginBottom: 16,
  },
  routeMainTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    textAlign: "center",
  },
  routeAddress: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  routeInfoContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  routeInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  routeInfoDivider: {
    width: 1,
    backgroundColor: "#DDD",
    marginHorizontal: 16,
  },
  routeInfoLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  routeInfoValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  openMapsButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  openMapsButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
