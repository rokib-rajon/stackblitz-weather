import { NextResponse } from 'next/server';
import { getHistoricalData } from '@/lib/api/weather';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const days = searchParams.get('days') || '7';

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing coordinates' },
      { status: 400 }
    );
  }

  try {
    const data = await getHistoricalData(
      parseFloat(lat),
      parseFloat(lon),
      parseInt(days)
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}