export type AdoptionFormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  hasPets: string;
  petTypes?: string;
  housingType: string;
  housingDetails: string;
  hasYard: string;
  hasChildren: string;
  availableTime: string;
  reason: string;
  comments: string;
  petId: string;
  petName: string;

  // ✅ NUEVOS: Campos para el sistema de notificaciones
  ownerId: string; // ← ID del usuario dueño
  ownerName: string; // ← Nombre del dueño
  ownerEmail?: string;
  applicantId: string; // ← Quién hace la solicitud
};

// ✅ Agregar esto abajo
export type AdoptionFormDataWithId = AdoptionFormData & {
  id: string;
  submittedAt?: any; // Firebase timestamp (opcional)
  status?: "pending" | "approved" | "rejected"; // Estado (opcional)
};
