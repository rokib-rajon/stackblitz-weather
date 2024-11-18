import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import { getLocationName } from './geocoding';

const BASE_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface WeatherCache {
  data: any;
  timestamp: number;
}

const weatherCache = new Map<string, WeatherCache>();

export async function getWeatherData(lat: number, lon: number): Promise<any> {
  const cacheKey = `${lat},${lon}`;
  const now = Date.now();
  const cached = weatherCache.get(cacheKey);

  // Check if we have valid cached data
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  // Fetch fresh data
  const response = await fetch(
    `${BASE_URL}?lat=${lat}&lon=${lon}`,
    {
      headers: {
        'User-Agent': 'WeatherApp/1.0',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  // Update cache
  weatherCache.set(cacheKey, {
    data,
    timestamp: now,
  });

  // Save current weather to history
  try {
    const locationName = await getLocationName(lat, lon);
    const current = data.properties.timeseries[0];
    
    // Save location name to cache
    db.prepare(`
      INSERT OR REPLACE INTO location_cache (id, latitude, longitude, name, last_updated)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(cacheKey, lat, lon, locationName);

    // Save weather data to history
    db.prepare(`
      INSERT INTO weather_history (
        id, location_name, latitude, longitude,
        temperature, humidity, wind_speed, wind_direction,
        precipitation, symbol_code, recorded_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      randomUUID(),
      locationName,
      lat,
      lon,
      current.data.instant.details.air_temperature,
      current.data.instant.details.relative_humidity,
      current.data.instant.details.wind_speed,
      current.data.instant.details.wind_from_direction,
      current.data.next_1_hours?.details.precipitation_amount || 0,
      current.data.next_1_hours?.summary.symbol_code || 'cloudy'
    );
  } catch (error) {
    console.error('Failed to save historical data:', error);
  }

  return data;
}

export async function getHistoricalData(lat: number, lon: number, days: number = 7) {
  return db.prepare(`
    SELECT *
    FROM weather_history
    WHERE latitude = ? AND longitude = ?
      AND recorded_at >= datetime('now', '-' || ? || ' days')
    ORDER BY recorded_at DESC
  `).all(lat, lon, days);
}

export async function getLocationNameFromCache(lat: number, lon: number): Promise<string> {
  const cacheKey = `${lat},${lon}`;
  const cached = db.prepare(`
    SELECT name
    FROM location_cache
    WHERE latitude = ? AND longitude = ?
      AND last_updated >= datetime('now', '-1 hour')
  `).get(lat, lon);

  if (cached) {
    return cached.name;
  }

  const name = await getLocationName(lat, lon);
  return name;
}