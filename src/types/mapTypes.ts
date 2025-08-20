export type FilterType =
  | "all"
  | "perdidos"
  | "avistamientos"
  | "perros"
  | "gatos";

export interface PetPin {
  id: string;
  lat: number;
  lng: number;
  image: string;
  label: "PERDIDO" | "AVISTAMIENTO";
  species: "PERRO" | "GATO";
}
