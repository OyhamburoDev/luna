import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { textStyles } from "../theme/textStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

type Props = {
  currentPage?: number;
  onPressArrow?: () => void;
};

const { height, width } = Dimensions.get("window");

export default function CustomHeaderTop({ currentPage, onPressArrow }: Props) {
  if (currentPage === 1) return null;

  return (
    <>
      {/* IZQ: Chips Refugio + App */}

      <View style={styles.logoContainer}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 1)", "rgba(0,0,0,0)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 220, // ajustá según necesites
          }}
        />
        <View style={styles.logoWrap}>
          <Image
            source={require("../../assets/media/images/logoOcho.png")}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* <View style={styles.logoContainer}>
        <View style={styles.chipsRow}>
          <View style={[styles.chip, styles.chipTransparent]}>
            <Text style={[styles.chipText, textStyles.title]}>Refugio</Text>
          </View>

          <View style={[styles.chip, styles.chipSolid]}>
            <Text style={styles.chipText}>App</Text>
          </View>
        </View>
      </View> */}

      {/* DER: Descubrí más */}
      {/* <View style={styles.container}>
        <TouchableOpacity
          onPress={onPressArrow}
          activeOpacity={0.7}
          style={styles.discoverButton}
        >
          <Text style={styles.text}>
            Ver detalle <Text style={styles.arrow}>→</Text>
          </Text>
        </TouchableOpacity>
      </View> */}
    </>
  );
}

const VIOLET = "#667eea";

const styles = StyleSheet.create({
  logoContainer: {
    position: "absolute",
    top: height * 0.04, // 👈 4.5% de la altura de la pantalla
    left: 0,
    right: 0,
    zIndex: 50,
  },
  chipsRow: {
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "rgba(102, 126, 234, 0.47)",
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  chipTransparent: {
    paddingRight: 5,
    paddingLeft: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: "rgba(120, 110, 234, 0.47)",
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  chipSolid: {
    paddingRight: 5,
    paddingLeft: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: VIOLET,
    borderColor: "rgba(102, 126, 234, 0.5)",
  },
  chipText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  container: {
    position: "absolute",
    top: 58,
    right: 10,
    zIndex: 50,
  },
  discoverButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrow: {
    fontSize: 16,
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 75,
    overflow: "hidden", // 👈 recorta en círculo
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: "110%",
    height: "110%",
    borderRadius: 75, // 👈 opcional, ayuda en Android
    resizeMode: "cover",
  },
});
