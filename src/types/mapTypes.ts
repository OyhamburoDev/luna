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

// Nuevos tipos para información detallada
export interface PetDetailData {
  id: string;
  name?: string;
  species: "PERRO" | "GATO";
  breed?: string;
  gender: "MACHO" | "HEMBRA" | "NO_ESPECIFICADO";
  size: "PEQUEÑO" | "MEDIANO" | "GRANDE" | "GIGANTE";
  color: string;
  age?: string;
  hasCollar: boolean;
  description?: string;
  images: string[];
  status: "PERDIDO" | "AVISTAMIENTO";
  location: string;
  detailedLocation: string;
  reportedAt: string;
  lastSeenAt: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactInfo: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    preferredContact: "phone" | "whatsapp" | "email" | "app";
  };
  reporter: {
    id: string;
    name: string;
    avatar?: string;
    joinedDate: string;
    reportsCount: number;
    rating: number;
    isVerified: boolean;
  };
  isActive: boolean;
  tags: string[];
  rewardOffered?: number;
  urgencyLevel: 1 | 2 | 3 | 4 | 5; // 1 = baja, 5 = crítica
}

// Tipos para el sistema de contacto
export interface ContactRequest {
  id: string;
  petId: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  contactType: "phone" | "whatsapp" | "message";
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  messageType: "text" | "image" | "location";
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  petId: string;
  participants: string[];
  lastMessage: ChatMessage;
  unreadCount: number;
  isActive: boolean;
}

// Tipos para reportes y moderación
export interface Report {
  id: string;
  petId: string;
  reportedBy: string;
  reportType: "inappropriate" | "spam" | "fake" | "resolved" | "duplicate";
  description?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
}

// Tipos para notificaciones
export interface Notification {
  id: string;
  userId: string;
  type: "contact_request" | "message" | "pet_update" | "nearby_sighting";
  title: string;
  body: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}

// Extensión del hook useMapLogic
export interface MapLogicExtended {
  // ... propiedades existentes
  selectedDetail: PetDetailData | null;
  modalVisible: boolean;

  // Nuevas funciones
  loadPetDetails: (petId: string) => Promise<void>;
  closeModal: () => void;
  handleContact: (contactInfo: ContactInfo) => void;
  handleReport: (reportData: ReportData) => void;
  isOwner: (petId: string) => boolean;
}

export interface ContactInfo {
  type: "phone" | "whatsapp" | "message";
  value: string;
  petId: string;
}

export interface ReportData {
  petId: string;
  reportType: "inappropriate" | "spam" | "fake" | "resolved";
  description?: string;
}
