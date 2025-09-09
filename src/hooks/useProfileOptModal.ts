import { useCallback, useState } from "react";

type Options = {
  onEditProfile: () => void; // lógica real de editar perfil (la pasás desde la screen)
  onCloseAccount: () => void; // lógica real de cerrar cuenta (signOut/delete/etc.)
};

export function useProfileOptModal({ onEditProfile, onCloseAccount }: Options) {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const editProfile = useCallback(() => {
    // 1) cierro el modal
    setVisible(false);
    // 2) corro la lógica real
    onEditProfile();
  }, [onEditProfile]);

  const closeAccount = useCallback(() => {
    setVisible(false);
    onCloseAccount();
  }, [onCloseAccount]);

  return {
    // estado
    visible,
    // controles
    open,
    close,
    // acciones ya “binded” a tu lógica
    editProfile,
    closeAccount,
  };
}
