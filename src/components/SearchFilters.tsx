
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { categories } from '@/data/categories';

interface FilterProps {
  onApplyFilters: (filters: any) => void;
  initialFilters?: {
    priceRange?: [number, number];
    distance?: number;
    categories?: string[];
  };
}

const SearchFilters = ({ onApplyFilters, initialFilters }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || [0, 200]);
  const [distance, setDistance] = useState(initialFilters?.distance || 10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setDistance(10);
    setSelectedCategories([]);
  };

  const applyFilters = () => {
    onApplyFilters({
      priceRange,
      distance,
      categories: selectedCategories
    });
    
    // Optionnellement, fermer les filtres après application
    // setIsOpen(false);
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-kiwiiz-primary" />
          <h3 className="font-medium">Filtrer les résultats</h3>
        </div>
        <div>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>

      {/* Filters content */}
      {isOpen && (
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-4">Prix (€)</h4>
              <Slider 
                defaultValue={priceRange}
                value={priceRange}
                max={200}
                step={5}
                onValueChange={setPriceRange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
              </div>
            </div>
            
            {/* Distance */}
            <div>
              <h4 className="font-medium mb-4">Distance maximale (km)</h4>
              <Slider 
                defaultValue={[distance]} 
                value={[distance]}
                max={50}
                step={1}
                onValueChange={(value) => setDistance(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 km</span>
                <span>{distance} km</span>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-6">
            <h4 className="font-medium mb-4">Catégories</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer flex items-center">
                    <category.icon className="h-4 w-4 mr-1 text-gray-500" />
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={clearFilters}
            >
              <X className="mr-1 h-4 w-4" />
              Effacer les filtres
            </Button>
            
            <Button 
              className="kiwiiz-btn-primary"
              onClick={applyFilters}
            >
              Appliquer les filtres
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
