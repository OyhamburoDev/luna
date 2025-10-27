import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfileImage } from "../../hooks/useProfileImage";
import { ImagePickerModal } from "./ImagePickerModal";
import { ImageViewer } from "./ImageViewer";
import { textStyles } from "../../theme/textStyles";
import { fonts } from "../../theme/fonts";
import { useUserStore } from "../../store/userStore";
import { ProfileOptionsModal } from "./ProfileOptionsModal";
import { useProfileOptModal } from "../../hooks/useProfileOptModal";
import { useAuth } from "../../hooks/useAuth";
import useProfilePosts from "../../hooks/useProfilePosts";
import DeletePostModal from "../DeletePostModal";
import { useProfileLikes } from "../../hooks/useProfileLikes";
import { likesService } from "../../api/likesService";
import { useAuthStore } from "../../store/auth";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
  onEditPress: () => void;
  onPublishPress: () => void;
};

export default function ProfileView({
  onTabChange,
  onEditPress,
  onPublishPress,
}: Props) {
  const { logout } = useAuth();
  const { visible, open, close, editProfile, closeAccount } =
    useProfileOptModal({
      onEditProfile: onEditPress, // ya la tenés por props
      onCloseAccount: () => {
        console.log("Se ejecutó onCloseAccount");
        logout();
      },
    });
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
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");
  const { posts, loading, error, handleDeletePost } = useProfilePosts();
  const {
    posts: likedPosts,
    loading: loadingLikes,
    refresh: refreshLikes,
  } = useProfileLikes();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const userId = useAuthStore((state) => state.user?.uid);

  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Refrescando likes del perfil...");
      refreshLikes();
    }, [refreshLikes])
  );

  const handleEditProfile = () => {
    close(); // cierra el modal primero
    onEditPress(); // ya tenés esta lógica
  };

  const handleCloseAccount = () => {
    close();
    // TODO: tu lógica real de cerrar cuenta (signOut / deleteAccount / etc.)
  };

  const handleDeletePress = (post: any) => {
    setSelectedPost(post);
    setDeleteModalVisible(true);
  };

  const handleUnlike = async (post: any) => {
    if (!userId) return;

    try {
      await likesService.toggleLike(userId, post.id, true);
      // Refrescar la lista de likes
      const { posts: likedPosts } = useProfileLikes();
    } catch (error) {
      console.log("Error removing like:", error);
    }
  };

  return (
    <>
      {isFocused && (
        <StatusBar style="dark" translucent backgroundColor="transparent" />
      )}
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ height: 20 }} />
          <View style={styles.headerBackground}>
            {/* Header con foto de perfil */}

            <View style={styles.profileHeader}>
              <TouchableOpacity style={styles.topRightIcon} onPress={open}>
                <Ionicons
                  name="menu-outline"
                  size={28}
                  color="rgba(133, 129, 129, 0.64)"
                />
              </TouchableOpacity>
              <View style={styles.profileImageContainer}>
                {userInfo.photoUrl ? (
                  <Image
                    source={{ uri: userInfo.photoUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View
                    style={[styles.profileImage, styles.profilePlaceholder]}
                  >
                    <Ionicons name="person" size={40} color="#ccc" />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.editPhotoButton}
                  onPress={showImageOptions}
                >
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>

              {userInfo.firstName || userInfo.lastName ? (
                <Text style={styles.userName}>
                  {[userInfo.firstName, userInfo.lastName]
                    .filter(Boolean)
                    .join(" ")}
                </Text>
              ) : (
                <Text style={[textStyles.title, styles.userNameDefault]}>
                  Añadir nombre
                </Text>
              )}

              {userInfo.bio ? (
                <Text style={styles.userBio}>{userInfo.bio}</Text>
              ) : (
                <TouchableOpacity
                  style={styles.addBioButton}
                  onPress={onEditPress}
                >
                  <Text
                    style={[{ fontFamily: fonts.semiBold }, styles.addBioText]}
                  >
                    + Añade una biografía
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Botón de editar perfil */}
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={onEditPress}
            >
              <Text style={[textStyles.subtitle, styles.editProfileButtonText]}>
                Editar perfil
              </Text>
            </TouchableOpacity>
          </View>

          {/* Información de contacto compacta */}
          <View style={styles.contactSection}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color="#667eea" />
              <Text style={[textStyles.body, styles.contactText]}>
                {userInfo.email || "Email no configurado"}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color="#ff6b6b" />
              <Text style={[textStyles.body, styles.contactText]}>
                {userInfo.phone || "Teléfono no configurado"}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={16} color="#43e97b" />
              <Text style={[textStyles.body, styles.contactText]}>
                {userInfo.location || "Ubicación no configurada"}
              </Text>
            </View>
          </View>

          {/* Tabs para publicaciones y likes */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "posts" && styles.activeTab]}
              onPress={() => setActiveTab("posts")}
            >
              <Ionicons
                name="grid-outline"
                size={20}
                color={activeTab === "posts" ? "#667eea" : "#999"}
              />
              <Text
                style={[
                  textStyles.title,
                  styles.tabText,
                  activeTab === "posts" && styles.activeTabText,
                ]}
              >
                Publicaciones
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "likes" && styles.activeTab]}
              onPress={() => setActiveTab("likes")}
            >
              <Ionicons
                name="heart-outline"
                size={20}
                color={activeTab === "likes" ? "#ff6b6b" : "#999"}
              />
              <Text
                style={[
                  textStyles.title,
                  styles.tabText,
                  activeTab === "likes" && styles.activeTabText,
                ]}
              >
                Me gusta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grid de contenido o estado vacío */}
          {(activeTab === "posts" ? posts : likedPosts).length > 0 ? (
            <View
              style={styles.contentGrid}
              key={`${activeTab}-${
                (activeTab === "posts" ? posts : likedPosts).length
              }`}
            >
              {(activeTab === "posts" ? posts : likedPosts).map((post) => (
                <View key={post.id} style={styles.postItem}>
                  <Image
                    source={{
                      uri: post.thumbnailUri || post.imageUris?.[0]?.uri,
                    }}
                    style={styles.postImage}
                  />
                  {activeTab === "posts" && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeletePress(post)}
                    >
                      <Ionicons name="close" size={18} color="white" />
                    </TouchableOpacity>
                  )}
                  <View style={styles.postOverlay}>
                    <Ionicons name="heart" size={16} color="white" />
                    <Text style={styles.postLikes}>{post.likes}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              {activeTab === "posts" ? (
                <>
                  {/* <Ionicons name="paw-outline" size={50} color="#ccc" /> */}
                  <Text style={[textStyles.title, styles.emptyTitle]}>
                    Aún no has compartido con otros usuarios una publicación
                  </Text>
                  {/* <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={onPublishPress}
                >
                  <Text
                    style={[
                      { fontFamily: fonts.bold },
                      styles.uploadButtonText,
                    ]}
                  >
                    Publicar
                  </Text>
                </TouchableOpacity> */}
                </>
              ) : (
                <>
                  <Text
                    style={[{ fontFamily: fonts.bold }, styles.emptyLikeTitle]}
                  >
                    Aún no has dado "Me gusta" a ninguna publicación
                  </Text>
                  {/* <Text style={styles.emptySubtitle}>
                  Aquí aparecerán todas las fotos y videos que te gusten de
                  otros usuarios
                </Text> */}
                </>
              )}
            </View>
          )}
        </ScrollView>

        <ProfileOptionsModal
          visible={visible}
          onClose={close}
          onEditProfile={editProfile}
          onCloseAccount={closeAccount}
        />

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
        <DeletePostModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={async () => {
            if (selectedPost) {
              await handleDeletePost(
                selectedPost.id,
                selectedPost.mediaUrls || [],
                selectedPost.thumbnailUri
              );
            }
            setDeleteModalVisible(false);
          }}
          petName={selectedPost?.petName || ""}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  headerBackground: {
    backgroundColor: "#ffffffff",
    paddingBottom: 10,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
  },
  topRightIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6, // opcional para agrandar el área táctil
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
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
  userName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: "#2d3436",
    marginBottom: 8,
  },
  userNameDefault: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: "#636e72",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 10,
  },
  addBioButton: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  addBioText: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "500",
  },
  editProfileButton: {
    backgroundColor: "rgba(161, 159, 159, 0.12)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24, // Añadido para controlar el ancho
    alignItems: "center",
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 5,
  },
  editProfileButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000ff",
  },
  contactSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginBottom: 2,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactText: {
    fontSize: 14,
    color: "#2d3436",
    marginLeft: 12,
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingTop: 16,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#667eea",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#667eea",
  },
  contentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  postItem: {
    width: "33.33%",
    aspectRatio: 0.75,
    position: "relative",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: 6,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.11)",
    justifyContent: "center",
    alignItems: "center",
  },
  postOverlay: {
    position: "absolute",
    bottom: 4,
    left: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.11)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postLikes: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyState: {
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 0,
    gap: 0,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3436",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 5,
    marginTop: 10,
  },
  emptyLikeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3436",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 5,
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: "#FE2C55",
    paddingVertical: 9,
    paddingHorizontal: 17,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});
