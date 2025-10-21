// export type AdoptionFormData = {
//   fullName: string;
//   email: string;
//   phone: string;
//   address: string;
//   hasPets: string;
//   petTypes?: string;
//   housingType: string;
//   housingDetails: string;
//   hasYard: string;
//   hasChildren: string;
//   availableTime: string;
//   reason: string;
//   comments: string;
//   petId: string;
//   petName: string;

//   // ✅ NUEVOS: Campos para el sistema de notificaciones
//   ownerId: string; // ← ID del usuario dueño
//   ownerName: string; // ← Nombre del dueño
//   ownerEmail?: string;
//   applicantId: string; // ← Quién hace la solicitud
// };

// // ✅ Agregar esto abajo
// export type AdoptionFormDataWithId = AdoptionFormData & {
//   id: string;
//   submittedAt?: any; // Firebase timestamp (opcional)
//   status?: "pending" | "approved" | "rejected"; // Estado (opcional)
// };

export type AdoptionFormData = {
  // Datos del adoptante
  // Datos del adoptante
  name: string; // Nombre (Obligatorio, no puede ser número)

  // Métodos de contacto (puede elegir varios, pero si o si debe haber uno)
  whatsapp?: string; // Número de WhatsApp
  instagram?: string; // Usuario de Instagram
  email?: string; // Correo electrónico
  facebook?: string; // Usuario de Facebook

  // Vivienda
  housingType: "house" | "apartment" | "other"; // Tipo de vivienda (obligatorio)
  housingDetails?: string; // Detalles de vivienda
  hasYard: boolean; // Tiene patio (true/false) (obligatorio)

  // Sobre mascotas
  hasPets: boolean; // Tiene mascotas (true/false) (obligatorio)
  petTypes?: string; // Tipos de mascotas

  // Familia
  hasChildren: boolean; // Tiene hijos (true/false) (obligatorio)
  availableTime: string; // Tiempo disponible (obligatorio)

  // Motivación
  reason: string; // Razón (obligatorio)
  comments?: string; // Comentarios

  // Metadata
  petId: string; // ID de la mascota
  petName: string; // Nombre de la mascota
  ownerId: string; // ID del dueño
  applicantId: string; // ID del solicitante
};

export type AdoptionFormDataWithId = AdoptionFormData & {
  id: string; // ID del documento
  submittedAt?: any; // Enviado en
  status?: "pending" | "approved" | "rejected"; // Estado
};
