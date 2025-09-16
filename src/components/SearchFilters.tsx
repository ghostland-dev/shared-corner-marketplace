import React from 'react';
import { Search, Filter, SlidersHorizontal, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { categories } from '@/data/categories';

interface SearchFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  location: string;
  onLocationChange: (location: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  priceRange: [number, number];
  onSearch: () => void;
  resultsCount: number;
  loading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  query,
  onQueryChange,
  location,
  onLocationChange,
  category,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  priceRange,
  onSearch,
  resultsCount,
  loading = false
}) => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);
  const [tempPriceRange, setTempPriceRange] = React.useState<[number, number]>(priceRange);

  const handlePriceRangeChange = (values: number[]) => {
    setTempPriceRange([values[0], values[1]]);
  };

  const applyFilters = () => {
    onPriceChange(tempPriceRange[0], tempPriceRange[1]);
    onSearch();
    setIsFilterDialogOpen(false);
  };

  const resetFilters = () => {
    onQueryChange('');
    onLocationChange('');
    onCategoryChange('');
    onPriceChange(0, 1000);
    setTempPriceRange([0, 1000]);
  };

  const hasActiveFilters = query || location || category || minPrice > 0 || maxPrice < 1000;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Que cherchez-vous ?"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>

            {/* Location Input */}
            <div className="relative md:w-64">
              <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Où ?"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>

            {/* Category Select */}
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                  {hasActiveFilters && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      !
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filtres de recherche</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Prix par jour : {tempPriceRange[0]}€ - {tempPriceRange[1]}€
                    </Label>
                    <Slider
                      value={tempPriceRange}
                      onValueChange={handlePriceRangeChange}
                      max={1000}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0€</span>
                      <span>1000€+</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Active Filters Summary */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Filtres actifs</Label>
                    <div className="flex flex-wrap gap-2">
                      {query && (
                        <Badge variant="secondary">
                          Recherche: "{query}"
                        </Badge>
                      )}
                      {location && (
                        <Badge variant="secondary">
                          Lieu: {location}
                        </Badge>
                      )}
                      {category && (
                        <Badge variant="secondary">
                          {categories.find(c => c.id === category)?.name}
                        </Badge>
                      )}
                      {(minPrice > 0 || maxPrice < 1000) && (
                        <Badge variant="secondary">
                          Prix: {minPrice}€ - {maxPrice}€
                        </Badge>
                      )}
                      {!hasActiveFilters && (
                        <span className="text-sm text-muted-foreground">
                          Aucun filtre actif
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    disabled={!hasActiveFilters}
                  >
                    Réinitialiser
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsFilterDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button onClick={applyFilters}>
                      Appliquer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Search Button */}
            <Button onClick={onSearch} disabled={loading} className="md:w-auto">
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {loading ? (
            <span>Recherche en cours...</span>
          ) : (
            <span>
              {resultsCount > 0 
                ? `${resultsCount} résultat${resultsCount > 1 ? 's' : ''} trouvé${resultsCount > 1 ? 's' : ''}`
                : 'Aucun résultat trouvé'
              }
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-auto p-1 text-xs"
          >
            Effacer les filtres
          </Button>
        )}
      </div>
    </div>
  );
};