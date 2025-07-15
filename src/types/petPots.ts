export type PetPost = {
  id: string;
  petName: string;
  description: string;
  createdAt: string;
  videoUri?: any;
  imageUris?: any[];
  age: number;
  gender: string;
  size: string;
  species: string;

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
