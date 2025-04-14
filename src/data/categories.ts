
import { Wrench, Car, Home, BookOpen, Package, Camera, Monitor, Briefcase } from 'lucide-react';

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
