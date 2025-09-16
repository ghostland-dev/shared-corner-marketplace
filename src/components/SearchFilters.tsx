import React from 'react';
import { Search, SlidersHorizontal, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { categories } from '@/data/categories';

export type FilterState = {
  query: string;
  location: string;
  category: string;
  priceRange: [number, number];
  priceUnit?: string;
  features?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'popularity';
};

interface SearchFiltersProps {
  // Controlled props (optional for backward compatibility)
  query?: string;
  onQueryChange?: (query: string) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
  category?: string;
  onCategoryChange?: (category: string) => void;
  priceRange?: [number, number];
  onPriceChange?: (min: number, max: number) => void;

  // Summary and actions
  onSearch?: () => void;
  resultsCount?: number;
  loading?: boolean;

  // Uncontrolled mode callback
  onFiltersChange?: (filters: FilterState) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  query: controlledQuery,
  onQueryChange,
  location: controlledLocation,
  onLocationChange,
  category: controlledCategory,
  onCategoryChange,
  priceRange: controlledPriceRange,
  onPriceChange,
  onSearch,
  resultsCount = 0,
  loading = false,
  onFiltersChange,
}) => {
  // Internal state (works for both controlled and uncontrolled usage)
  const [query, setQuery] = React.useState(controlledQuery ?? '');
  const [location, setLocation] = React.useState(controlledLocation ?? '');
  const [category, setCategory] = React.useState(controlledCategory ?? '');
  const [priceRange, setPriceRange] = React.useState<[number, number]>(controlledPriceRange ?? [0, 1000]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);

  // Sync internal state when controlled props change
  React.useEffect(() => { if (controlledQuery !== undefined) setQuery(controlledQuery); }, [controlledQuery]);
  React.useEffect(() => { if (controlledLocation !== undefined) setLocation(controlledLocation); }, [controlledLocation]);
  React.useEffect(() => { if (controlledCategory !== undefined) setCategory(controlledCategory); }, [controlledCategory]);
  React.useEffect(() => { if (controlledPriceRange !== undefined) setPriceRange(controlledPriceRange); }, [controlledPriceRange]);

  const emitFiltersChange = (next: Partial<FilterState> = {}) => {
    const filters: FilterState = {
      query,
      location,
      category,
      priceRange,
      priceUnit: 'jour',
      features: [],
      sortBy: 'date_desc',
      ...next,
    };
    onFiltersChange?.(filters);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onQueryChange?.(val);
    emitFiltersChange({ query: val });
  };

  const handleLocationChange = (val: string) => {
    setLocation(val);
    onLocationChange?.(val);
    emitFiltersChange({ location: val });
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    onCategoryChange?.(val);
    emitFiltersChange({ category: val });
  };

  const handlePriceRangeChange = (values: number[]) => {
    const next: [number, number] = [values[0], values[1]];
    setPriceRange(next);
    onPriceChange?.(next[0], next[1]);
    emitFiltersChange({ priceRange: next });
  };

  const applyFilters = () => {
    onPriceChange?.(priceRange[0], priceRange[1]);
    emitFiltersChange();
    onSearch?.();
    setIsFilterDialogOpen(false);
  };

  const resetFilters = () => {
    handleQueryChange('');
    handleLocationChange('');
    handleCategoryChange('');
    handlePriceRangeChange([0, 1000]);
  };

  const hasActiveFilters = !!(query || location || category || priceRange[0] > 0 || priceRange[1] < 1000);

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
                onChange={(e) => handleQueryChange(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
              />
            </div>

            {/* Location Input */}
            <div className="relative md:w-64">
              <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Où ?"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
              />
            </div>

            {/* Category Select */}
            <Select value={category} onValueChange={handleCategoryChange}>
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
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">!</Badge>
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
                      Prix par jour : {priceRange[0]}€ - {priceRange[1]}€
                    </Label>
                    <Slider
                      value={priceRange}
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
                      {query && <Badge variant="secondary">Recherche: "{query}"</Badge>}
                      {location && <Badge variant="secondary">Lieu: {location}</Badge>}
                      {category && (
                        <Badge variant="secondary">{categories.find((c) => c.id === category)?.name}</Badge>
                      )}
                      {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <Badge variant="secondary">Prix: {priceRange[0]}€ - {priceRange[1]}€</Badge>
                      )}
                      {!hasActiveFilters && (
                        <span className="text-sm text-muted-foreground">Aucun filtre actif</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button variant="outline" onClick={resetFilters} disabled={!hasActiveFilters}>
                    Réinitialiser
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={applyFilters}>Appliquer</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Search Button */}
            <Button onClick={() => onSearch?.()} disabled={loading} className="md:w-auto">
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
          {loading ? <span>Recherche en cours...</span> : (
            <span>
              {resultsCount > 0
                ? `${resultsCount} résultat${resultsCount > 1 ? 's' : ''} trouvé${resultsCount > 1 ? 's' : ''}`
                : 'Aucun résultat trouvé'}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-auto p-1 text-xs">
            Effacer les filtres
          </Button>
        )}
      </div>
    </div>
  );
};
