export type PetPost = {
  id: string;
  petName: string;
  description: string;
  createdAt: string;
  videoUri?: any; // si hay un video
  imageUris?: any[]; // si hay una o más imágenes
};
