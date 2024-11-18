'use client';

import { Button } from '@/components/ui/button';
import { useWeatherStore } from '@/lib/store/weather';

export function SettingsToggle() {
  const { unit, language, setUnit, setLanguage } = useWeatherStore();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
      >
        {unit === 'celsius' ? '°C' : '°F'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
      >
        {language === 'en' ? 'EN' : 'বাং'}
      </Button>
    </div>
  );
}