'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface WeatherMapProps {
  lat: number;
  lon: number;
  temperature: number;
}

export function WeatherMap({ lat, lon, temperature }: WeatherMapProps) {
  useEffect(() => {
    // Fix for Leaflet icon in Next.js
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
  }, []);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lon]}>
          <Popup>
            Current temperature: {temperature}°C
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}