import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../theme/fonts";
import { AdoptionService } from "../../api/adoptionServiceApplication";
import { useNotificationsStore } from "../../store/notificationsStore";
import { AppNotification } from "../../types/notifications";

type Props = {
  notification: AppNotification;
  onGoBack: () => void;
};

export const AdoptionRequestDetail = ({ notification, onGoBack }: Props) => {
  // TODO: Acá va todo el contenido
  const MOCK_ADOPTION_DATA = {
    applicantName: "María González",
    petName: "Luna",
    submittedAt: "Hace 2 horas",
    whatsapp: "+54 9 11 2345-6789",
    instagram: "mariagonzalez",
    email: "maria.gonzalez@email.com",
    facebook: "María González",
    housingType: "Casa",
    hasYard: true,
    housingDetails:
      "Casa de 3 ambientes con patio amplio y cerco perimetral seguro.",
    hasPets: true,
    petTypes: "Tengo 2 perros (Golden Retriever y Beagle) y 1 gato.",
    hasChildren: true,
    childrenAges: "8 y 12 años",
    availableTime: "4-6 horas diarias",
    reason: "Siempre he amado a los animales...",
    comments: "Tenemos experiencia previa con adopciones...",
  };

  return (
    <ScrollView
      style={styles.adoptionScroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {MOCK_ADOPTION_DATA.applicantName}
            </Text>
            <Text style={styles.profileSubtitle}>
              Quiere adoptar a {MOCK_ADOPTION_DATA.petName}
            </Text>
            <Text style={styles.timestamp}>
              {MOCK_ADOPTION_DATA.submittedAt}
            </Text>
          </View>
        </View>
      </View>

      {/* Contacto Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <View style={styles.contactList}>
          {/* WhatsApp - Clickeable */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => {
              const phone = MOCK_ADOPTION_DATA.whatsapp.replace(/[^\d]/g, "");
              Linking.openURL(`whatsapp://send?phone=${phone}`);
            }}
          >
            <View style={[styles.contactIcon, { backgroundColor: "#E7F9F5" }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </View>
            <Text style={styles.contactText}>
              {MOCK_ADOPTION_DATA.whatsapp}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Instagram - No clickeable */}
          <View style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: "#FFF0F5" }]}>
              <Ionicons name="logo-instagram" size={20} color="#E4405F" />
            </View>
            <Text style={styles.contactText}>
              @{MOCK_ADOPTION_DATA.instagram}
            </Text>
          </View>

          {/* Email - Clickeable */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => {
              Linking.openURL(`mailto:${MOCK_ADOPTION_DATA.email}`);
            }}
          >
            <View style={[styles.contactIcon, { backgroundColor: "#F5F5F5" }]}>
              <Ionicons name="mail" size={20} color="#666" />
            </View>
            <Text style={styles.contactText}>{MOCK_ADOPTION_DATA.email}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Facebook - No clickeable */}
          <View style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: "#EBF3FF" }]}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </View>
            <Text style={styles.contactText}>
              {MOCK_ADOPTION_DATA.facebook}
            </Text>
          </View>
        </View>
      </View>

      {/* Vivienda Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vivienda</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo de vivienda</Text>
            <Text style={styles.infoValue}>
              {MOCK_ADOPTION_DATA.housingType}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tiene patio</Text>
            <View
              style={[
                styles.badge,
                MOCK_ADOPTION_DATA.hasYard ? styles.badgeYes : styles.badgeNo,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  MOCK_ADOPTION_DATA.hasYard
                    ? styles.badgeTextYes
                    : styles.badgeTextNo,
                ]}
              >
                {MOCK_ADOPTION_DATA.hasYard ? "Sí" : "No"}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.detailsText}>
            {MOCK_ADOPTION_DATA.housingDetails}
          </Text>
        </View>
      </View>

      {/* Mascotas actuales Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mascotas actuales</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tiene mascotas</Text>
            <View
              style={[
                styles.badge,
                MOCK_ADOPTION_DATA.hasPets ? styles.badgeYes : styles.badgeNo,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  MOCK_ADOPTION_DATA.hasPets
                    ? styles.badgeTextYes
                    : styles.badgeTextNo,
                ]}
              >
                {MOCK_ADOPTION_DATA.hasPets ? "Sí" : "No"}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.detailsText}>{MOCK_ADOPTION_DATA.petTypes}</Text>
        </View>
      </View>

      {/* Familia Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Familia y disponibilidad</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tiene hijos</Text>
            <View
              style={[
                styles.badge,
                MOCK_ADOPTION_DATA.hasChildren
                  ? styles.badgeYes
                  : styles.badgeNo,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  MOCK_ADOPTION_DATA.hasChildren
                    ? styles.badgeTextYes
                    : styles.badgeTextNo,
                ]}
              >
                {MOCK_ADOPTION_DATA.hasChildren ? "Sí" : "No"}
              </Text>
            </View>
          </View>
          {MOCK_ADOPTION_DATA.hasChildren && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Edades</Text>
                <Text style={styles.infoValue}>
                  {MOCK_ADOPTION_DATA.childrenAges}
                </Text>
              </View>
            </>
          )}
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tiempo disponible</Text>
            <Text style={styles.infoValue}>
              {MOCK_ADOPTION_DATA.availableTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Motivación Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Por qué quiere adoptar?</Text>
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{MOCK_ADOPTION_DATA.reason}</Text>
        </View>
      </View>

      {/* Comentarios Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentarios adicionales</Text>
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{MOCK_ADOPTION_DATA.comments}</Text>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Eliminar solicitud",
              "¿Estás seguro? Esta acción no se puede deshacer.",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Eliminar",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      // 1. Eliminar de Firebase
                      await AdoptionService.deleteAdoptionRequest(
                        notification.id
                      );

                      // 2. Actualizar el store local
                      const removeNotification =
                        useNotificationsStore.getState().removeNotification;
                      removeNotification(notification.id);

                      // 3. Volver atrás
                      onGoBack();
                    } catch (error) {
                      Alert.alert("Error", "No se pudo eliminar la solicitud");
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.deleteButtonText}>Eliminar solicitud</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  adoptionScroll: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: "#000000",
    marginBottom: 4,
  },
  profileSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  timestamp: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: "#999999",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "#000000",
    marginBottom: 12,
  },
  contactList: {
    gap: 0,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: "#000000",
  },
  infoCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: "#666666",
  },
  infoValue: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: "#000000",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeYes: {
    backgroundColor: "#E8F5E9",
  },
  badgeNo: {
    backgroundColor: "#FFEBEE",
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  badgeTextYes: {
    color: "#2E7D32",
  },
  badgeTextNo: {
    color: "#C62828",
  },
  detailsText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    paddingTop: 4,
  },
  messageCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
  },
  messageText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
  },
  deleteButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});
