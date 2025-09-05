// src/hooks/useProfileForm.ts
import { useState } from "react";
import type { Usuario } from "../types/user";

type Form = Pick<
  Usuario,
  "firstName" | "lastName" | "phone" | "bio" | "location" | "photoUrl" | "email"
>;

export function useProfileForm(initial: Partial<Form> = {}) {
  const [form, setForm] = useState<Form>({
    firstName: initial.firstName ?? "",
    lastName: initial.lastName ?? "",
    phone: initial.phone ?? "",
    bio: initial.bio ?? "",
    location: initial.location ?? "",
    photoUrl: initial.photoUrl ?? "",
    email: initial.email ?? "",
  });

  // setter básico: set("firstName", "Ramiro")
  const set = (key: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // para TextInput: onChangeText={onChange("phone")}
  const onChange = (key: keyof Form) => (text: string) => set(key, text);

  const reset = () =>
    setForm({
      firstName: initial.firstName ?? "",
      lastName: initial.lastName ?? "",
      phone: initial.phone ?? "",
      bio: initial.bio ?? "",
      location: initial.location ?? "",
      photoUrl: initial.photoUrl ?? "",
      email: initial.email ?? "",
    });

  return { form, set, onChange, reset };
}
