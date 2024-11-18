'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { translations } from '@/lib/i18n/translations';

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  symbolCode: string;
  precipitation: number;
  time: string;
  unit: 'celsius' | 'fahrenheit';
  language: 'en' | 'bn';
}

export function WeatherCard({
  temperature,
  humidity,
  windSpeed,
  windDirection,
  symbolCode,
  precipitation,
  time,
  unit,
  language,
}: WeatherCardProps) {
  const t = translations[language];
  const formattedTime = new Date(time).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{formattedTime}</CardTitle>
        <WeatherIcon code={symbolCode} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {temperature.toFixed(1)}°{unit === 'celsius' ? 'C' : 'F'}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>{t.humidity}: {humidity}%</div>
          <div>{t.windSpeed}: {windSpeed} m/s</div>
          <div>{t.precipitation}: {precipitation} mm</div>
        </div>
      </CardContent>
    </Card>
  );
}