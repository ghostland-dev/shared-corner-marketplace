import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from './ErrorBoundary';
import { FavoriteButton } from './FavoriteButton';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  imageUrl?: string;
  imageUrls?: string[];
  location: string;
  category: string;
  rating: number;
  distance?: number;
  views?: number;
  className?: string;
}

const ListingCard = ({
  id,
  title,
  price,
  priceUnit,
  imageUrl,
  imageUrls,
  location,
  category,
  rating,
  distance,
  views,
  className = ''
}: ListingCardProps) => {
  const displayImage = imageUrls?.[0] || imageUrl || '/placeholder.svg';
  const hasMultipleImages = imageUrls && imageUrls.length > 1;
  return (
    <ErrorBoundary>
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
        <div className="relative">
          <Link to={`/annonces/${id}`}>
            <img 
              src={displayImage} 
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
          
          {/* Indicateur de photos multiples */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-black/70 text-white border-none text-xs">
                +{imageUrls!.length - 1} photos
              </Badge>
            </div>
          )}
          
          {/* Prix badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/70 text-white border-none">
              {price.toFixed(2)}€/{priceUnit}
            </Badge>
          </div>
          
          {/* Bouton favoris */}
          <div className="absolute top-3 right-3">
            <FavoriteButton 
              listingId={id} 
              className="bg-white/80 hover:bg-white text-gray-800"
              size="icon"
              variant="secondary"
            />
          </div>
          
          {/* Catégorie */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <Link to={`/annonces/${id}`} className="block">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
            {distance && (
              <span className="ml-1 text-xs">
                • {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            
            {views !== undefined && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{views}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default ListingCard;
