'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { translations } from '@/lib/i18n/translations';
import { Sun } from 'lucide-react';

interface UVIndexProps {
  coordinates: { lat: number; lon: number };
  language: 'en' | 'bn';
}

export function UVIndex({ coordinates, language }: UVIndexProps) {
  const t = translations[language];
  
  // Mock UV data (replace with actual API call)
  const uvIndex = 7;
  
  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: t.uvLow, color: 'text-green-500' };
    if (index <= 5) return { level: t.uvModerate, color: 'text-yellow-500' };
    if (index <= 7) return { level: t.uvHigh, color: 'text-orange-500' };
    if (index <= 10) return { level: t.uvVeryHigh, color: 'text-red-500' };
    return { level: t.uvExtreme, color: 'text-purple-500' };
  };

  const { level, color } = getUVLevel(uvIndex);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            {t.uvIndex}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-4xl font-bold ${color}`}>
            {language === 'bn' ? convertToBengaliNumerals(uvIndex) : uvIndex}
          </div>
          <p className="mt-2 text-muted-foreground">{level}</p>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>{t.healthPrecautions}</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4 space-y-2">
            {getHealthPrecautions(uvIndex, language).map((precaution, index) => (
              <li key={index}>{precaution}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function getHealthPrecautions(uvIndex: number, language: string): string[] {
  const t = translations[language];
  const precautions = [];

  if (uvIndex > 2) {
    precautions.push(t.wearSunscreen);
    precautions.push(t.wearHat);
  }
  if (uvIndex > 5) {
    precautions.push(t.limitSunExposure);
    precautions.push(t.seekShade);
  }
  if (uvIndex > 7) {
    precautions.push(t.avoidOutdoor);
    precautions.push(t.wearProtectiveClothing);
  }

  return precautions;
}

function convertToBengaliNumerals(number: number): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return number.toString().split('').map(digit => bengaliNumerals[parseInt(digit)]).join('');
}