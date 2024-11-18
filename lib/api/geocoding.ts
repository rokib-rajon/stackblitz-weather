const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export async function getLocationName(lat: number, lon: number): Promise<string> {
  const response = await fetch(
    `${NOMINATIM_API}/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers: {
        'User-Agent': 'WeatherApp/1.0',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch location name');
  }

  const data = await response.json();
  return data.display_name;
}