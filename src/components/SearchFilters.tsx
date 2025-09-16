import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface FilterState {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  priceUnit: string;
  features: string[];
  sortBy: 'price_asc' | 'price_desc' | 'date_desc' | 'popularity';
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  className?: string;
}

const defaultFilters: FilterState = {
  query: '',
  category: '',
  location: '',
  priceRange: [0, 1000],
  priceUnit: 'jour',
  features: [],
  sortBy: 'date_desc'
};

const availableFeatures = [
  'WiFi', 'Parking', 'Climatisation', 'Animaux acceptés',
  'Équipement professionnel', 'Livraison possible'
];

const categories = [
  { id: 'tools', name: 'Outils' },
  { id: 'vehicles', name: 'Véhicules' },
  { id: 'housing', name: 'Logement' },
  { id: 'books', name: 'Livres' },
  { id: 'items', name: 'Objets' },
  { id: 'photo', name: 'Photo' }
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  className = ''
}) => {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une annonce..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilters({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Ville, région..."
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
            />

            <Select
              value={filters.sortBy}
              onValueChange={(value: FilterState['sortBy']) => updateFilters({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Plus récent</SelectItem>
                <SelectItem value="price_asc">Prix croissant</SelectItem>
                <SelectItem value="price_desc">Prix décroissant</SelectItem>
                <SelectItem value="popularity">Popularité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};