import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfileImage } from "../../hooks/useProfileImage";
import { ImagePickerModal } from "./ImagePickerModal";
import { ImageViewer } from "./ImageViewer";
import { textStyles } from "../../theme/textStyles";
import { useUserStore } from "../../store/userStore";

type Props = {
  onBackPress: () => void;
  onFieldEdit: (config: any) => void;
};

export default function ProfileEdit({ onBackPress, onFieldEdit }: Props) {
  const {
    showImageOptions,
    isModalVisible,
    closeModal,
    takePhoto,
    pickFromGallery,
    viewPhoto,
    isViewerVisible,
    closeViewer,
  } = useProfileImage();

  const userInfo = useUserStore((state) => state.userInfo);

  const handleFieldEdit = (field: string) => {
    let config;

    switch (field) {
      case "nombre":
        config = {
          title: "Nombre",
          value: userInfo.firstName,
          placeholder: "Añade tu nombre",
          maxLength: 30,
          description: "El apodo solo se puede cambiar una vez cada 7 días.",
          fieldType: "firstName",
        };
        break;
      case "apellido":
        config = {
          title: "Apellido",
          value: userInfo.lastName,
          placeholder: "Añadir tu apellido",
          maxLength: 30,
          description: "El apellido solo se puede cambiar una vez cada 7 días.",
          fieldType: "lastName",
        };
        break;
      case "telefono":
        config = {
          title: "Teléfono",
          value: userInfo.phone,
          placeholder: "+54 11 1234-5678",
          maxLength: 20,
          multiline: false, // El teléfono no necesita multiline
          keyboardType: "phone-pad", // Teclado numérico para teléfonos
          description: "Tu número de teléfono no será visible públicamente.",
          fieldType: "phone",
        };
        break;
      case "biografia":
        config = {
          title: "Descripción corta",
          value: userInfo.bio,
          placeholder: "Añadir una descripción corta",
          maxLength: 80,
          multiline: true,
          fieldType: "bio",
        };
        break;
      // más campos...
    }

    // Acá navegás al componente FieldEdit
    onFieldEdit(config);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        {/* Header superior */}
        <View style={styles.editHeader}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2d3436" />
          </TouchableOpacity>
          <Text style={[textStyles.title, styles.headerTitle]}>
            Editar perfil
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Header con foto de perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {userInfo.photoUrl ? (
              <Image
                source={{ uri: userInfo.photoUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.profilePlaceholder]}>
                <Ionicons name="person" size={40} color="#ccc" />
              </View>
            )}
            {/* Botón de cámara */}
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={showImageOptions}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={[textStyles.body, styles.userHandle]}>Cambiar foto</Text>
        </View>

        {/* <View style={styles.statsContainer}>
            <View style={styles.statItemSingle}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Publicaciones</Text>
            </View>
          </View> */}
      </View>

      {/* Información del usuario */}
      <View style={styles.userInfoSection}>
        <Text style={[textStyles.body, styles.titleInput]}>Acerca de ti</Text>
        <View style={styles.editForm}>
          {/* Nombre */}
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => handleFieldEdit("nombre")}
          >
            <Text
              style={[
                textStyles.title,
                styles.inputLabelTitle,
                { marginBottom: 0 },
              ]}
            >
              Nombre
            </Text>
            <View style={styles.inputButtonRight}>
              <Text style={[textStyles.body, styles.inputValue]}>
                {userInfo.firstName || "Añadir"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          {/* Apellido */}
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => handleFieldEdit("apellido")}
          >
            <Text
              style={[
                textStyles.title,
                styles.inputLabelTitle,
                { marginBottom: 0 },
              ]}
            >
              Apellido
            </Text>
            <View style={styles.inputButtonRight}>
              <Text style={[textStyles.body, styles.inputValue]}>
                {userInfo.lastName || "Añadir"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity style={styles.inputButton} disabled={true}>
            <Text
              style={[
                textStyles.title,
                styles.inputLabelTitle,
                { marginBottom: 0 },
              ]}
            >
              Email
            </Text>
            <View style={styles.inputButtonRight}>
              <Text style={[textStyles.body, styles.inputValue]}>
                {userInfo.email || "Ejemplo@gmail.com"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Teléfono */}
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => handleFieldEdit("telefono")}
          >
            <Text
              style={[
                textStyles.title,
                styles.inputLabelTitle,
                { marginBottom: 0 },
              ]}
            >
              Telefono
            </Text>
            <View style={styles.inputButtonRight}>
              <Text style={[textStyles.body, styles.inputValue]}>
                {userInfo.phone || "Añadir"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          {/* Ubicación */}
          {/* <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ubicación</Text>
              <TextInput
                style={styles.textInput}
                value={userInfo.location}
                onChangeText={(text) =>
                  onUserInfoChange({ ...userInfo, location: text })
                }
              />
            </View> */}

          {/* Biografía */}
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => handleFieldEdit("biografia")}
          >
            <View>
              <Text
                style={[
                  textStyles.title,
                  styles.inputLabelTitle,
                  { marginBottom: 0 },
                ]}
              >
                Biografía
              </Text>
            </View>
            <View style={styles.inputButtonRight}>
              <Text
                style={[textStyles.body, styles.inputValue]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {userInfo.bio
                  ? userInfo.bio.length > 26
                    ? `${userInfo.bio.substring(0, 26)}...`
                    : userInfo.bio
                  : "Añadir una descripción..."}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorBtn} />
      </View>

      {/* Botón de registrar mascota */}
      {/* <TouchableOpacity style={styles.adoptButton} onPress={() => {}}>
          <View style={styles.adoptButtonGradient}>
            <Ionicons
              name="add-circle"
              size={20}
              color="white"
              style={styles.adoptIcon}
            />
            <Text style={styles.adoptButtonText}>Registrar mascota</Text>
          </View>
        </TouchableOpacity> */}

      <ImagePickerModal
        visible={isModalVisible}
        onClose={closeModal}
        onTakePhoto={takePhoto}
        onPickFromGallery={pickFromGallery}
        onViewPhoto={viewPhoto}
        hasPhoto={!!userInfo.photoUrl}
      />
      <ImageViewer
        visible={isViewerVisible}
        imageUri={userInfo.photoUrl || null}
        onClose={closeViewer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  editHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffffff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#000000ff",
    textAlign: "center",
    fontSize: 20,
  },
  headerRight: {
    width: 40, // Para balancear el espacio del botón izquierdo
  },
  headerBackground: {
    backgroundColor: "#ffffffff",
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 0,
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#667eea",
  },
  profilePlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#667eea",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  userHandle: {
    fontSize: 16,
    color: "#636e72",
    fontWeight: "500",
  },
  statsContainer: {
    paddingVertical: 20,
    marginBottom: 0,
    alignItems: "center",
  },
  statItemSingle: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#667eea",
  },
  statLabel: {
    fontSize: 14,
    color: "#636e72",
    fontWeight: "500",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  topEditButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#667eea",
    borderWidth: 1,
    borderColor: "#667eea",
  },
  titleInput: {
    fontSize: 15,
    color: "#00000077",
  },
  userInfoSection: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 10,
    marginBottom: 2,
  },
  editForm: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    backgroundColor: "white",
    marginBottom: 10,
  },
  inputButtonRight: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  inputValue: {
    fontSize: 15,
    color: "#00000077",
    marginRight: 8,
  },
  inputLabelTitle: {
    fontSize: 15,
    color: "#2d3436",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  adoptButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 2,
  },
  adoptButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: "#667eea",
  },
  adoptIcon: {
    marginRight: 10,
  },
  adoptButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  separatorBtn: {
    height: 1,
    backgroundColor: "#0000000b",
  },
});
