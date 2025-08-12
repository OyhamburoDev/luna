import { AdoptionFormData } from "./forms";

export type Message_Type = "Adopciones" | "Perdidos" | "Sistema";

export interface MessageBase {
  id: string; // Id único del mensaje
  type: Message_Type;
  date: string; // fecha de creación del mensaje
  isNew: boolean; // si el mensaje es nuevo o ya fue leido
}

export interface AdoptionMessage extends MessageBase {
  type: "Adopciones";
  color: "#4facfe";
  adoptionData: AdoptionFormData;
}

export type MessageType = {
  id: string;
  type: "Adopciones" | "Perdidos" | "Sistema";
  title: string;
  date: string;
  pet: string;
  color: string;
  icon: string;
  isNew: boolean;
  isRead: boolean;
};
