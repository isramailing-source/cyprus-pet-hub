import React, { useState, useCallback } from 'react';
import { Search, X, Filter, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateSearchQuery, createRateLimiter } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchFilters {
  category?: string;
  location?: string;
  priceRange?: string;
  age?: string;
  breed?: string;
}

interface SecureSearchFormProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
  disabled?: boolean;
}

// Rate limiter: max 10 searches per minute
const searchRateLimiter = createRateLimiter(10, 60000);

export function SecureSearchForm({
  onSearch,
  placeholder = "Search for pets...",
  showFilters = true,
  className,
  disabled = false
}: SecureSearchFormProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);
  
  const getUserIdentifier = useCallback(() => {
    // Use IP or session-based identifier for rate limiting
    return 'user_' + (navigator.userAgent + window.location.hostname).slice(0, 20);
  }, []);

  const validateAndSearch = useCallback(async () => {
    if (disabled || isSearching) return;
    
    setErrors([]);
    setIsSearching(true);
    
    try {
      // Rate limiting check
      const userIdentifier = getUserIdentifier();
      if (!searchRateLimiter(userIdentifier)) {
        setErrors(['Too many searches. Please wait a moment before searching again.']);
        return;
      }
      
      // Validate search query
      const validation = validateSearchQuery(query.trim());
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      // Prevent rapid successive searches
      const now = Date.now();
      if (now - lastSearchTime < 500) {
        setErrors(['Please wait a moment between searches.']);
        return;
      }
      
      setLastSearchTime(now);
      
      // Sanitized query is available from validation
      const sanitizedQuery = validation.sanitized || query.trim();
      
      // Perform search with sanitized data
      await onSearch(sanitizedQuery, filters);
      
    } catch (error: any) {
      setErrors([error.message || 'Search failed. Please try again.']);
    } finally {
      setIsSearching(false);
    }
  }, [query, filters, onSearch, disabled, isSearching, lastSearchTime, getUserIdentifier]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    validateAndSearch();
  }, [validateAndSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      validateAndSearch();
    }
  }, [validateAndSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setErrors([]);
    setShowAdvancedFilters(false);
  }, []);

  const removeFilter = useCallback((filterKey: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  }, []);

  const updateFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof SearchFilters]
  ).length;

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled || isSearching}
                className={cn(
                  "pl-10 pr-20",
                  errors.length > 0 && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                maxLength={100}
                autoComplete="off"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                    disabled={disabled || isSearching}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                
                {showFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={cn(
                      "h-6 w-6 p-0 hover:bg-gray-100",
                      (showAdvancedFilters || activeFiltersCount > 0) && "bg-blue-100 text-blue-600"
                    )}
                    disabled={disabled}
                  >
                    <Filter className="h-3 w-3" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Search Button */}
            <div className="mt-2">
              <Button 
                type="submit" 
                disabled={disabled || isSearching || !query.trim()}
                className="w-full sm:w-auto"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {Object.entries(filters).map(([key, value]) => 
                value ? (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {value}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(key as keyof SearchFilters)}
                      className="h-4 w-4 p-0 hover:bg-gray-200 ml-1"
                      disabled={disabled}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ) : null
              )}
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={filters.category || ''} 
                  onValueChange={(value) => updateFilter('category', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any category</SelectItem>
                    <SelectItem value="dogs">Dogs</SelectItem>
                    <SelectItem value="cats">Cats</SelectItem>
                    <SelectItem value="birds">Birds</SelectItem>
                    <SelectItem value="reptiles">Reptiles</SelectItem>
                    <SelectItem value="small-pets">Small Pets</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select 
                  value={filters.location || ''} 
                  onValueChange={(value) => updateFilter('location', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any location</SelectItem>
                    <SelectItem value="nicosia">Nicosia</SelectItem>
                    <SelectItem value="limassol">Limassol</SelectItem>
                    <SelectItem value="larnaca">Larnaca</SelectItem>
                    <SelectItem value="paphos">Paphos</SelectItem>
                    <SelectItem value="famagusta">Famagusta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <Select 
                  value={filters.priceRange || ''} 
                  onValueChange={(value) => updateFilter('priceRange', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any price</SelectItem>
                    <SelectItem value="0-100">€0 - €100</SelectItem>
                    <SelectItem value="100-300">€100 - €300</SelectItem>
                    <SelectItem value="300-500">€300 - €500</SelectItem>
                    <SelectItem value="500-1000">€500 - €1000</SelectItem>
                    <SelectItem value="1000+">€1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <Select 
                  value={filters.age || ''} 
                  onValueChange={(value) => updateFilter('age', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any age</SelectItem>
                    <SelectItem value="puppy">Puppy/Kitten (0-1 year)</SelectItem>
                    <SelectItem value="young">Young (1-3 years)</SelectItem>
                    <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                    <SelectItem value="senior">Senior (7+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Breed</label>
                <Input
                  type="text"
                  placeholder="Enter breed"
                  value={filters.breed || ''}
                  onChange={(e) => updateFilter('breed', e.target.value)}
                  disabled={disabled}
                  maxLength={50}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFilters({});
                    setShowAdvancedFilters(false);
                  }}
                  disabled={disabled || activeFiltersCount === 0}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
