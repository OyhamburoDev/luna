export type PetPost = {
  id: string;
  petName: string;
  description: string;
  createdAt: string;
  videoUri?: any;
  imageUris?: any[];
  thumbnailUri?: any;
  age: number;
  gender: string;
  size: string;
  species: string;

  // ✅ NUEVO: Campo para identificar al dueño
  ownerId: string; // ← ID del usuario dueño
  ownerName: string; // ← Nombre del dueño (para mostrar)
  ownerAvatar?: any;

  // Campos opcionales
  breed?: string;
  healthInfo?: string;
  isVaccinated?: string;
  isNeutered?: string;
  hasMedicalConditions?: string;
  medicalDetails?: string;
  goodWithKids?: string;
  goodWithOtherPets?: string;
  friendlyWithStrangers?: string;
  needsWalks?: string;
  energyLevel?: string;
};
