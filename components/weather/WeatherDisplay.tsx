'use client';

import { useEffect, useState } from 'react';
import { WeatherCard } from './WeatherCard';
import { LocationSearch } from './LocationSearch';
import { WeatherMap } from './WeatherMap';
import { WeatherAlerts } from './WeatherAlerts';
import { UVIndex } from './UVIndex';
import { HistoricalWeather } from './HistoricalWeather';
import { SettingsToggle } from './SettingsToggle';
import { WeatherData, WeatherError } from '@/lib/types/weather';
import { getWeatherData, getLocationNameFromCache } from '@/lib/api/weather';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useWeatherStore } from '@/lib/store/weather';
import { translations } from '@/lib/i18n/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<WeatherError | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: 23.8103, lon: 90.4125 }); // Default to Dhaka
  const [locationName, setLocationName] = useState('');
  const { unit, language } = useWeatherStore();
  const t = translations[language];

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherData(location.lat, location.lon);
      const name = await getLocationNameFromCache(location.lat, location.lon);
      setWeather(data);
      setLocationName(name);
    } catch (err) {
      setError({ message: 'Failed to fetch weather data' });
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <LocationSearch onLocationSelect={(lat, lon) => setLocation({ lat, lon })} />
        <SettingsToggle />
      </div>

      <WeatherAlerts area={location} />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : weather ? (
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">{t.currentWeather}</TabsTrigger>
            <TabsTrigger value="forecast">{t.sevenDayForecast}</TabsTrigger>
            <TabsTrigger value="health">{t.healthInfo}</TabsTrigger>
            <TabsTrigger value="map">{t.map}</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <WeatherCard
              temperature={weather.properties.timeseries[0].data.instant.details.air_temperature}
              humidity={weather.properties.timeseries[0].data.instant.details.relative_humidity}
              windSpeed={weather.properties.timeseries[0].data.instant.details.wind_speed}
              windDirection={weather.properties.timeseries[0].data.instant.details.wind_from_direction}
              symbolCode={weather.properties.timeseries[0].data.next_1_hours?.summary.symbol_code || 'cloudy'}
              precipitation={weather.properties.timeseries[0].data.next_1_hours?.details.precipitation_amount || 0}
              time={weather.properties.timeseries[0].time}
              unit={unit}
              language={language}
            />
          </TabsContent>

          <TabsContent value="forecast">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weather.properties.timeseries.slice(1, 8).map((timepoint, index) => (
                <WeatherCard
                  key={index}
                  temperature={timepoint.data.instant.details.air_temperature}
                  humidity={timepoint.data.instant.details.relative_humidity}
                  windSpeed={timepoint.data.instant.details.wind_speed}
                  windDirection={timepoint.data.instant.details.wind_from_direction}
                  symbolCode={timepoint.data.next_1_hours?.summary.symbol_code || 'cloudy'}
                  precipitation={timepoint.data.next_1_hours?.details.precipitation_amount || 0}
                  time={timepoint.time}
                  unit={unit}
                  language={language}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="health">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UVIndex coordinates={location} language={language} />
              <HistoricalWeather coordinates={location} language={language} />
            </div>
          </TabsContent>

          <TabsContent value="map">
            <WeatherMap
              lat={location.lat}
              lon={location.lon}
              temperature={weather.properties.timeseries[0].data.instant.details.air_temperature}
            />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}