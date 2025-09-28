import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EnhancedSearchProps {
  area?: string;
  placeholder?: string;
}

const EnhancedSearch = ({ area = "general", placeholder = "Search..." }: EnhancedSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Simple client-side search handling
    const searchUrl = `/search?q=${encodeURIComponent(query.trim())}`;
    window.location.href = searchUrl;
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default EnhancedSearch;