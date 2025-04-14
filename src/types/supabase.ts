
export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  phone_number: string | null;
  bio: string | null;
  location: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  price_unit: string;
  location: string;
  category_id: string;
  owner_id: string;
  image_urls: string[];
  features: string[];
  is_available: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export type Reservation = {
  id: string;
  listing_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  message: string | null;
  created_at: string;
  updated_at: string;
}

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'reservation' | 'message' | 'system' | 'payment';
  read: boolean;
  related_id: string | null;
  created_at: string;
}

export type Subscription = {
  id: string;
  user_id: string;
  plan: 'free' | 'premium' | 'business';
  status: 'active' | 'cancelled' | 'expired';
  stripe_subscription_id: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export type Review = {
  id: string;
  listing_id: string;
  reviewer_id: string;
  owner_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
