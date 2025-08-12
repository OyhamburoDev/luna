import { PetPost } from "../types/petPots";

export const mockPets: PetPost[] = [
  {
    id: "1",
    petName: "Carboncito",
    description:
      "Una publicación con video y fotos. Luna es muy especial: le gusta observar el atardecer, tomar agua de fuentes y acompañarte mientras leés un libro. Tiene una mirada que transmite paz y una energía muy tranquila.",
    createdAt: "2025-07-01T20:00:00Z",
    videoUri: require("../../assets/media/reels/black-dog.mp4"),
    imageUris: [require("../../assets/media/images/black-dog-pictures.jpeg")],
    thumbnailUri: require("../../assets/media/images/black-dog-photo.png"),
    age: 2,
    gender: "Hembra",
    size: "Mediano",
    species: "Perro",

    // ✅ USUARIO 1: Juan (dueño de Carboncito)
    ownerId: "2vbyGg3zIlMnzooBBTWowwJqTbu2",
    ownerName: "Ramiro oyhamburo",
    ownerEmail: "Rami@example.com",
  },
  {
    id: "2",
    petName: "Dora",
    description:
      "Un perro salchicha muy simpático que ama correr por el parque, esconderse debajo de la manta y recibir muchos mimos. ",
    createdAt: "2025-07-01T10:00:00Z",
    videoUri: require("../../assets/media/reels/dora.mp4"),
    thumbnailUri: require("../../assets/media/images/dora-photo.png"),
    age: 2,
    gender: "Macho",
    size: "Pequeño",
    species: "Perro",

    // Campos opcionales
    breed: "Dachshund",
    healthInfo: "Sin problemas de salud conocidos.",
    isVaccinated: "Sí",
    isNeutered: "No",
    hasMedicalConditions: "No",
    medicalDetails: "N/A",
    goodWithKids: "Sí",
    goodWithOtherPets: "Sí",
    friendlyWithStrangers: "Sí",
    needsWalks: "Sí",
    energyLevel: "Alto",

    // ✅ USUARIO 2: María (dueña de Dora)
    ownerId: "user_maria_456",
    ownerName: "María García",
    ownerEmail: "maria@example.com",
  },
  {
    id: "3",
    petName: "Max",
    description: "El más tierno de todos.",
    createdAt: "2025-07-01T13:00:00Z",
    imageUris: [
      require("../../assets/media/images/frutilla-uno.jpeg"),
      require("../../assets/media/images/frutilla-dos.jpeg"),
      require("../../assets/media/images/frutilla-tres.jpeg"),
      require("../../assets/media/images/frutilla-cuatro.jpeg"),
    ],
    age: 1,
    gender: "Hembra",
    size: "Pequeño",
    species: "Gato",

    // ✅ USUARIO 3: Ana (dueña de Max)
    ownerId: "user_ana_789",
    ownerName: "Ana López",
    ownerEmail: "ana@example.com",
  },
  {
    id: "4",
    petName: "Fermin",
    description:
      "Aprendiendo a caminar con ternura y torpeza. Este pequeño gato está dando sus primeros pasos y cada movimiento es una aventura. Ideal para alguien que busca ver crecer a su mascota desde el inicio.",
    createdAt: "2025-07-01T16:00:00Z",
    videoUri: require("../../assets/media/reels/fermin.mp4"),
    thumbnailUri: require("../../assets/media/images/fermin-photo.png"),
    age: 0.2,
    gender: "Hembra",
    size: "Pequeño",
    species: "Gato",

    // ✅ USUARIO 1: Juan (también dueño de fermin)
    ownerId: "user_juan_123",
    ownerName: "Juan Pérez",
    ownerEmail: "juan@example.com",
  },
  {
    id: "5",
    petName: "Vitto",
    description:
      "Un perro salchicha muy simpático que ama correr por el parque, esconderse debajo de la manta y recibir muchos mimos. ",
    createdAt: "2025-07-01T10:00:00Z",
    videoUri: require("../../assets/media/reels/vitto.mp4"),
    thumbnailUri: require("../../assets/media/images/vitto-photo.png"),
    age: 2,
    gender: "Macho",
    size: "Pequeño",
    species: "Perro",

    // Campos opcionales
    breed: "Dachshund",
    healthInfo: "Sin problemas de salud conocidos.",
    isVaccinated: "Sí",
    isNeutered: "No",
    hasMedicalConditions: "No",
    medicalDetails: "N/A",
    goodWithKids: "Sí",
    goodWithOtherPets: "Sí",
    friendlyWithStrangers: "Sí",
    needsWalks: "Sí",
    energyLevel: "Alto",

    // ✅ USUARIO 5: Sofía (dueña de Vitto)
    ownerId: "user_sofia_202",
    ownerName: "Sofía Martínez",
    ownerEmail: "sofia@example.com",
  },
  {
    id: "6",
    petName: "Caminador",
    description:
      "Aprendiendo a caminar con ternura y torpeza. Este pequeño gato está dando sus primeros pasos y cada movimiento es una aventura. Ideal para alguien que busca ver crecer a su mascota desde el inicio.",
    createdAt: "2025-07-01T16:00:00Z",
    videoUri: require("../../assets/media/reels/gatito-caminando.mp4"),
    thumbnailUri: require("../../assets/media/images/caminador-photo.png"),
    age: 0.2,
    gender: "Hembra",
    size: "Pequeño",
    species: "Gato",

    // ✅ USUARIO 6: Diego (dueño de Caminador)
    ownerId: "user_diego_303",
    ownerName: "Diego Fernández",
    ownerEmail: "diego@example.com",
  },
  {
    id: "7",
    petName: "Shila",
    description: "Un bulldog francés juguetón.",
    createdAt: "2025-07-01T11:00:00Z",
    videoUri: require("../../assets/media/reels/timida.mp4"),
    thumbnailUri: require("../../assets/media/images/timida-photo.png"),
    age: 3,
    gender: "Macho",
    size: "Mediano",
    species: "Perro",
    // Campos opcionales
    breed: "Dachshund",
    healthInfo: "Sin problemas de salud conocidos.",
    isVaccinated: "Sí",

    // ✅ USUARIO 7: Valentina (dueña de Shila)
    ownerId: "user_valentina_404",
    ownerName: "Valentina Torres",
    ownerEmail: "valentina@example.com",
  },
  {
    id: "8",
    petName: "Coby",
    description: "Cobayo curioso.",
    createdAt: "2025-07-01T17:00:00Z",
    videoUri: require("../../assets/media/reels/cuy.mp4"),
    thumbnailUri: require("../../assets/media/images/cuy-photo.png"),
    age: 1,
    gender: "Macho",
    size: "Pequeño",
    species: "Cobayo",

    // ✅ USUARIO 8: Mateo (dueño de Coby)
    ownerId: "user_mateo_505",
    ownerName: "Mateo Silva",
    ownerEmail: "mateo@example.com",
  },
  {
    id: "9",
    petName: "Bruno",
    description:
      "Un pitbull protector y cariñoso. Siempre está atento a los sonidos de la casa y no duda en acompañarte en todo momento. Le encanta jugar con la pelota y descansar al sol después de un largo paseo.",
    createdAt: "2025-07-01T12:00:00Z",
    videoUri: require("../../assets/media/reels/dog-sad.mp4"),
    thumbnailUri: require("../../assets/media/images/sad-photo.png"),
    age: 4,
    gender: "Macho",
    size: "Grande",
    species: "Perro",
    // Campos opcionales
    breed: "Dachshund",
    healthInfo: "Sin problemas de salud conocidos.",

    // ✅ USUARIO 9: Isabella (dueña de Bruno)
    ownerId: "user_isabella_606",
    ownerName: "Isabella Morales",
    ownerEmail: "isabella@example.com",
  },
  {
    id: "10",
    petName: "Copito",
    description:
      "Día de spa para el caniche. Disfruta de baños, masajes y ser peinado. Es una mascota coqueta y alegre, ideal para quien quiera mimar a un compañero peludo todos los días.",
    createdAt: "2025-07-01T19:00:00Z",
    imageUris: [
      require("../../assets/media/images/perro-caniche-1.png"),
      require("../../assets/media/images/perro-caniche-2.png"),
      require("../../assets/media/images/perro-caniche-3.png"),
      require("../../assets/media/images/perro-caniche-4.png"),
    ],
    age: 3,
    gender: "Hembra",
    size: "Pequeño",
    species: "Perro",

    // ✅ USUARIO 10: Sebastián (dueño de Copito)
    ownerId: "user_sebastian_707",
    ownerName: "Sebastián Vega",
    ownerEmail: "sebastian@example.com",
  },
  {
    id: "11",
    petName: "Blanquito",
    description:
      "Un pitbull protector y cariñoso. Siempre está atento a los sonidos de la casa y no duda en acompañarte en todo momento. Le encanta jugar con la pelota y descansar al sol después de un largo paseo.",
    createdAt: "2025-07-01T12:00:00Z",
    videoUri: require("../../assets/media/reels/gatito-siames.mp4"),
    thumbnailUri: require("../../assets/media/images/siames-photo.png"),
    age: 4,
    gender: "Macho",
    size: "Grande",
    species: "Perro",
    // Campos opcionales
    breed: "Dachshund",
    healthInfo: "Sin problemas de salud conocidos.",

    // ✅ USUARIO 11: Camila (dueña de Blanquito)
    ownerId: "user_camila_808",
    ownerName: "Camila Herrera",
    ownerEmail: "camila@example.com",
  },
];
