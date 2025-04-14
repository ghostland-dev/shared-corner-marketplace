import { Wrench, Car, Home, BookOpen, Package, Camera, Music, Monitor, Briefcase } from 'lucide-react';

// Catégories principales
export const categories = [
  {
    id: "bricolage",
    name: "Bricolage",
    icon: Wrench,
    color: "bg-kiwiiz-primary",
    link: "/categories/bricolage",
  },
  {
    id: "vehicules",
    name: "Véhicules",
    icon: Car,
    color: "bg-kiwiiz-secondary",
    link: "/categories/vehicules",
  },
  {
    id: "immobilier",
    name: "Immobilier",
    icon: Home,
    color: "bg-pink-500",
    link: "/categories/immobilier",
  },
  {
    id: "services",
    name: "Services",
    icon: Briefcase,
    color: "bg-purple-500",
    link: "/categories/services",
  },
  {
    id: "loisirs",
    name: "Loisirs",
    icon: BookOpen,
    color: "bg-yellow-500",
    link: "/categories/loisirs",
  },
  {
    id: "colis",
    name: "Colis",
    icon: Package,
    color: "bg-orange-500",
    link: "/categories/colis",
  },
  {
    id: "multimedia",
    name: "Multimédia",
    icon: Monitor,
    color: "bg-blue-500",
    link: "/categories/multimedia",
  },
  {
    id: "photo",
    name: "Photo/Vidéo",
    icon: Camera,
    color: "bg-red-500",
    link: "/categories/photo-video",
  },
];

// Listes d'annonces
export const listings = [
  {
    id: "1",
    title: "Perceuse Bosch professionnelle",
    description: "Perceuse à percussion Bosch Professional GSB 18V-55, en excellent état avec deux batteries et chargeur. Idéale pour tous vos travaux de bricolage.",
    price: 8.99,
    priceUnit: "jour",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c",
    location: "Lyon 3e",
    category: "Bricolage",
    categoryId: "bricolage",
    rating: 4.8,
    distance: 0.8,
    owner: {
      name: "Thomas",
      rating: 4.9,
      memberSince: "2022"
    }
  },
  {
    id: "2",
    title: "Vélo électrique Decathlon",
    description: "Vélo électrique ville Decathlon Elops 900E, autonomie 70km, batterie en bon état. Parfait pour vos déplacements urbains.",
    price: 15.00,
    priceUnit: "jour",
    imageUrl: "https://images.unsplash.com/photo-1560799486-f4b72635081c",
    location: "Lyon 7e",
    category: "Véhicules",
    categoryId: "vehicules",
    rating: 4.5,
    distance: 2.1,
    owner: {
      name: "Marie",
      rating: 4.7,
      memberSince: "2021"
    }
  },
  {
    id: "3",
    title: "Salle de réunion équipée",
    description: "Salle de réunion entièrement équipée pour 8 personnes, avec projecteur, tableau blanc et machine à café. Idéale pour vos réunions professionnelles.",
    price: 29.00,
    priceUnit: "heure",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    location: "Lyon 6e",
    category: "Immobilier",
    categoryId: "immobilier",
    rating: 4.9,
    distance: 3.4,
    owner: {
      name: "Pierre",
      rating: 5.0,
      memberSince: "2020"
    }
  },
  {
    id: "4",
    title: "Garde de chien à domicile",
    description: "Je propose de garder votre chien à votre domicile pendant vos absences. Expérience avec tous types de races, références disponibles.",
    price: 20.00,
    priceUnit: "jour",
    imageUrl: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69",
    location: "Lyon 2e",
    category: "Services",
    categoryId: "services",
    rating: 5.0,
    distance: 1.2,
    owner: {
      name: "Sophie",
      rating: 4.8,
      memberSince: "2021"
    }
  },
  {
    id: "5",
    title: "Appareil photo Canon EOS 5D",
    description: "Canon EOS 5D Mark IV avec objectif 24-70mm f/2.8. Parfait pour la photographie professionnelle ou amateur avancée.",
    price: 45.00,
    priceUnit: "jour",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    location: "Lyon 1er",
    category: "Photo/Vidéo",
    categoryId: "photo-video",
    rating: 4.7,
    distance: 1.5,
    owner: {
      name: "Antoine",
      rating: 4.6,
      memberSince: "2022"
    }
  },
  {
    id: "6",
    title: "Console PS5 avec 5 jeux",
    description: "PlayStation 5 avec manette supplémentaire et 5 jeux (FIFA 23, Call of Duty, Spider-Man, God of War, Gran Turismo 7).",
    price: 20.00,
    priceUnit: "jour",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3",
    location: "Lyon 8e",
    category: "Multimédia",
    categoryId: "multimedia",
    rating: 4.5,
    distance: 4.2,
    owner: {
      name: "Jules",
      rating: 4.3,
      memberSince: "2022"
    }
  },
  {
    id: "7",
    title: "Transport de meubles",
    description: "Propose aide au déménagement avec camionnette 12m³. Disponible les week-ends et en soirée.",
    price: 35.00,
    priceUnit: "heure",
    imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99",
    location: "Lyon 3e",
    category: "Services",
    categoryId: "services",
    rating: 4.9,
    distance: 0.6,
    owner: {
      name: "Lucas",
      rating: 4.9,
      memberSince: "2020"
    }
  },
  {
    id: "8",
    title: "Guitare acoustique Martin",
    description: "Guitare acoustique Martin D-15M en acajou massif. Son chaleureux, excellent état. Idéale pour concerts acoustiques ou enregistrements.",
    price: 15.00,
    priceUnit: "jour",
    imageUrl: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f",
    location: "Lyon 5e",
    category: "Loisirs",
    categoryId: "loisirs",
    rating: 4.6,
    distance: 2.8,
    owner: {
      name: "Emma",
      rating: 4.7,
      memberSince: "2021"
    }
  }
];

// Témoignages
export const testimonials = [
  {
    id: "1",
    name: "Alexandre D.",
    text: "Kiwiiz m'a permis d'emprunter une perceuse pour mon déménagement sans avoir à l'acheter. Service au top !",
    rating: 5,
    location: "Paris"
  },
  {
    id: "2",
    name: "Julie M.",
    text: "J'ai loué mon appareil photo qui ne servait plus et j'ai gagné plus de 300€ en quelques mois. Super plateforme !",
    rating: 5,
    location: "Lyon"
  },
  {
    id: "3",
    name: "Thomas P.",
    text: "Parfait pour trouver quelqu'un pour garder mon chat pendant les vacances. Pratique et rassurant.",
    rating: 4,
    location: "Bordeaux"
  }
];
