'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { translations } from '@/lib/i18n/translations';
import { Skeleton } from '@/components/ui/skeleton';

const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

interface HistoricalWeatherProps {
  coordinates: { lat: number; lon: number };
  language: 'en' | 'bn';
}

interface HistoricalData {
  temperature: number;
  recorded_at: string;
}

export function HistoricalWeather({ coordinates, language }: HistoricalWeatherProps) {
  const [data, setData] = useState<HistoricalData[]>([]);
  const t = translations[language];

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `/api/weather/history?lat=${coordinates.lat}&lon=${coordinates.lon}`
        );
        if (response.ok) {
          const historicalData = await response.json();
          setData(historicalData);
        }
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [coordinates]);

  const chartData = data.map(item => ({
    time: format(new Date(item.recorded_at), 'MMM d, HH:mm'),
    temperature: item.temperature,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.historicalData}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                label={{ value: t.time, position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{
                  value: '°C',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                name={t.temperature}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}