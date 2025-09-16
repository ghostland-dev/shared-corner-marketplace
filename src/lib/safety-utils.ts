// Utilitaires de sécurité pour éviter les erreurs runtime
export const safeArrayAccess = <T>(arr: T[] | undefined | null, index: number, defaultValue?: T): T | undefined => {
  if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
    return defaultValue;
  }
  return arr[index];
};

export const safeArrayLength = (arr: any[] | undefined | null): number => {
  return Array.isArray(arr) ? arr.length : 0;
};

export const safeObjectAccess = <T>(obj: any, key: string, defaultValue?: T): T | undefined => {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }
  return obj[key] !== undefined ? obj[key] : defaultValue;
};

export const safePriceRange = (range: any): [number, number] => {
  if (!Array.isArray(range) || range.length < 2) {
    return [0, 1000];
  }
  const [min, max] = range;
  return [
    typeof min === 'number' && !isNaN(min) ? min : 0,
    typeof max === 'number' && !isNaN(max) ? max : 1000
  ];
};

export const safeString = (value: any, defaultValue: string = ''): string => {
  return typeof value === 'string' ? value : defaultValue;
};

export const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = Number(value);
  return !isNaN(num) ? num : defaultValue;
};

export const safeBoolean = (value: any, defaultValue: boolean = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return defaultValue;
};

// Validation des filtres de recherche
export const validateSearchFilters = (filters: any): any => {
  if (!filters || typeof filters !== 'object') {
    return {
      query: '',
      category: '',
      location: '',
      priceRange: [0, 1000],
      priceUnit: 'jour',
      features: [],
      sortBy: 'date_desc'
    };
  }

  return {
    query: safeString(filters.query),
    category: safeString(filters.category),
    location: safeString(filters.location),
    priceRange: safePriceRange(filters.priceRange),
    priceUnit: safeString(filters.priceUnit, 'jour'),
    features: Array.isArray(filters.features) ? filters.features : [],
    sortBy: ['price_asc', 'price_desc', 'date_desc', 'popularity'].includes(filters.sortBy) 
      ? filters.sortBy 
      : 'date_desc'
  };
};

// Validation d'URL et d'images
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url) || url.includes('placeholder');
  } catch {
    return false;
  }
};

export const getValidImageUrl = (url: any, fallback: string = '/placeholder.svg'): string => {
  const urlString = safeString(url);
  return isValidImageUrl(urlString) ? urlString : fallback;
};

// Validation des données de listing
export const validateListing = (listing: any): any => {
  if (!listing || typeof listing !== 'object') {
    return null;
  }

  return {
    ...listing,
    id: safeString(listing.id),
    title: safeString(listing.title, 'Titre non disponible'),
    description: safeString(listing.description),
    price: safeNumber(listing.price),
    price_unit: safeString(listing.price_unit, 'jour'),
    location: safeString(listing.location, 'Localisation non précisée'),
    image_urls: Array.isArray(listing.image_urls) ? listing.image_urls : [],
    features: Array.isArray(listing.features) ? listing.features : [],
    is_available: safeBoolean(listing.is_available, true),
    views: safeNumber(listing.views),
    created_at: listing.created_at || new Date().toISOString(),
    updated_at: listing.updated_at || new Date().toISOString()
  };
};

// Gestion d'erreurs globale
export const handleError = (error: any, context: string = 'Unknown'): void => {
  console.error(`[${context}] Error:`, error);
  
  // En développement, afficher plus de détails
  if (import.meta.env.DEV) {
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
};

// Accès sécurisé à une propriété imbriquée avec chemin type "a.b.c"
export const safeProp = <T = any>(obj: any, path: string, defaultValue?: T): T => {
  try {
    if (!obj || typeof path !== 'string' || !path) return defaultValue as T;
    const parts = path.split('.');
    let current: any = obj;
    for (const key of parts) {
      if (current == null) return defaultValue as T;
      current = current[key];
    }
    return (current === undefined || current === null) ? (defaultValue as T) : (current as T);
  } catch {
    return defaultValue as T;
  }
};

// Debounce pour les recherches
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Validation d'email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format de prix sécurisé
export const formatPrice = (price: any, unit: string = 'jour'): string => {
  const safePrice = safeNumber(price);
  return `${safePrice.toFixed(2)}€/${unit}`;
};

// Truncate text de manière sécurisée
export const truncateText = (text: any, maxLength: number = 100): string => {
  const safeText = safeString(text);
  if (safeText.length <= maxLength) return safeText;
  return safeText.slice(0, maxLength) + '...';
};