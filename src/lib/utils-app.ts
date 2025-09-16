// Fonction utilitaire pour gérer les IDs mixtes (mock vs UUID)
export const isValidUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export const isMockId = (id: string): boolean => {
  return !isValidUUID(id);
};

// Helper pour convertir une date en format français
export const formatDateFR = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper pour formater un prix
export const formatPrice = (price: number, unit: string = 'jour'): string => {
  return `${price.toFixed(2)}€/${unit}`;
};

// Helper pour valider les formats d'images
export const isValidImageFormat = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  return validTypes.includes(file.type.toLowerCase());
};

// Helper pour valider la taille d'image
export const isValidImageSize = (file: File, maxSizeInMB: number = 5): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Helper pour générer des messages d'erreur
export const getImageUploadError = (file: File): string | null => {
  if (!isValidImageFormat(file)) {
    return `Format non supporté pour ${file.name}. Utilisez JPG, PNG, WEBP ou HEIC.`;
  }
  
  if (!isValidImageSize(file)) {
    return `${file.name} est trop volumineux. Taille maximale: 5MB.`;
  }
  
  return null;
};

// Helper pour créer des URL d'placeholder
export const getPlaceholderImage = (width: number = 400, height: number = 300): string => {
  return `/placeholder.svg?w=${width}&h=${height}`;
};

// Helper pour extraire le nom de fichier d'une URL
export const getFileNameFromUrl = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop() || 'image';
  } catch {
    return 'image';
  }
};

// Constants pour l'application
export const APP_CONSTANTS = {
  MAX_IMAGES_PER_LISTING: 8,
  MAX_IMAGE_SIZE_MB: 5,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_COMMENT_LENGTH: 500,
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  PRICE_UNITS: ['heure', 'jour', 'semaine', 'mois'] as const,
  RATING_LABELS: {
    1: 'Très insatisfaisant',
    2: 'Insatisfaisant', 
    3: 'Correct',
    4: 'Bien',
    5: 'Excellent'
  }
} as const;