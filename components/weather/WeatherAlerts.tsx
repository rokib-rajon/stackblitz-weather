'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell } from 'lucide-react';
import { useWeatherStore } from '@/lib/store/weather';
import { translations } from '@/lib/i18n/translations';

interface WeatherAlertsProps {
  area: { lat: number; lon: number };
}

interface AlertType {
  id: string;
  title: string;
  content: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
}

export function WeatherAlerts({ area }: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const { language } = useWeatherStore();
  const t = translations[language];

  useEffect(() => {
    // Fetch alerts for the area
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`/api/alerts?lat=${area.lat}&lon=${area.lon}`);
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    fetchAlerts();
  }, [area]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.severity === 'critical' ? 'destructive' : 'default'}
          className="animate-slide-down"
        >
          <Bell className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            {language === 'bn' ? alert.title : alert.title}
          </AlertTitle>
          <AlertDescription>
            {language === 'bn' ? alert.content : alert.content}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}