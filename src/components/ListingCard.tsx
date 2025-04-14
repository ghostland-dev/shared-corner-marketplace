
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  imageUrl: string;
  location: string;
  category: string;
  rating: number;
  distance?: number;
}

const ListingCard = ({
  id,
  title,
  price,
  priceUnit,
  imageUrl,
  location,
  category,
  rating,
  distance
}: ListingCardProps) => {
  return (
    <Link to={`/annonces/${id}`}>
      <div className="kiwiiz-card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <Badge 
            className="absolute top-3 left-3 bg-kiwiiz-primary text-white" 
            variant="outline"
          >
            {category}
          </Badge>
        </div>
        
        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium text-lg line-clamp-2 mb-2">{title}</h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
            {distance && (
              <span className="ml-2 text-xs text-kiwiiz-primary font-medium">
                {distance < 1 ? (distance * 1000).toFixed(0) + 'm' : distance.toFixed(1) + 'km'}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm mb-2">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{rating.toFixed(1)}</span>
          </div>
          
          <div className="mt-auto">
            <span className="text-lg font-bold text-kiwiiz-primary">
              {price.toFixed(2)}€
            </span>
            <span className="text-sm text-gray-500 ml-1">/ {priceUnit}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
