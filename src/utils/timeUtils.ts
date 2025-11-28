export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Menos de 1 minuto
  if (diffMinutes < 1) {
    return "Ahora";
  }

  // Menos de 1 hora
  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
  }

  // Menos de 24 horas
  if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  }

  // Ayer
  if (diffDays === 1) {
    return "Ayer";
  }

  // Menos de 7 días
  if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  }

  // Más de 7 días → mostrar fecha
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });
};
