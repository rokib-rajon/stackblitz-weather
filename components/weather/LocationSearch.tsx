'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [loading, setLoading] = useState(false);

  const handleGeolocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSelect(position.coords.latitude, position.coords.longitude);
        setLoading(false);
      },
      (error) => {
        toast.error('Failed to get your location');
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handleGeolocation}
        disabled={loading}
      >
        Use My Location
      </Button>
    </div>
  );
}