export type NotificationType = "adoption_request" | "like" | "system";

export type AppNotification = {
  id: string; // id del documento o notificación
  type: NotificationType; // tipo de notificación
  title: string; // texto principal
  subtitle: string; // texto secundario (por ejemplo "Juan quiere adoptar a Luna")
  icon: string; // nombre del icono (ej: "paw")
  color: string; // color del icono
  createdAt: Date; // fecha
  read: boolean; // si la notificación fue vista o no
  userImage?: string;
};
