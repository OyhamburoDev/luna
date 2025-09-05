export interface AuthUserBasic {
  uid: string;
  email: string;
  emailVerified: boolean;
}

// Documento de la colección "usuarios"
export interface UserInfo {
  uid: string; // mismo uid que Auth
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string; // requerido
  bio: string | null; // antes “biografia”
  photoUrl?: string | null; // opcional
  createdAt: Date; // más adelante si querés lo pasamos a Timestamp
  active: boolean;
}
