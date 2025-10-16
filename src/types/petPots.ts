export type PetPost = {
  id: string;
  petName: string;
  description: string;
  createdAt: string | Date | null;
  videoUri?: any;
  imageUris?: any[];
  thumbnailUri?: any;
  age: number;
  gender: string;
  size: string;
  species: string;

  //  Campo para identificar al dueño
  ownerId: string; // ← ID del usuario dueño
  ownerName: string; // ← Nombre del dueño (para mostrar)
  ownerAvatar?: any;
  ownerLocation?: string | null;
  ownerCreatedAt?: Date | string | null;

  // Para los likes
  likes?: number;

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
