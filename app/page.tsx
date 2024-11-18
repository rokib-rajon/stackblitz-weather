import { WeatherDisplay } from '@/components/weather/WeatherDisplay';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen">
      <WeatherDisplay />
    </main>
  );
}