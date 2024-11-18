import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, icons } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  code: string;
  className?: string;
}

const iconMap: Record<string, typeof icons[keyof typeof icons]> = {
  clearsky: Sun,
  cloudy: Cloud,
  fair: Sun,
  fog: CloudFog,
  heavyrain: CloudRain,
  heavysnow: CloudSnow,
  lightrain: CloudDrizzle,
  lightsnow: CloudSnow,
  partlycloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
};

export function WeatherIcon({ code, className }: WeatherIconProps) {
  const Icon = iconMap[code.split('_')[0]] || Cloud;
  return <Icon className={cn('h-6 w-6', className)} />;
}