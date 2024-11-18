import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { title, content, imageUrl } = data;

  try {
    const newsId = randomUUID();
    db.prepare(`
      INSERT INTO weather_news (id, title, content, image_url)
      VALUES (?, ?, ?, ?)
    `).run(newsId, title, content, imageUrl);

    return NextResponse.json({ id: newsId });
  } catch (error) {
    console.error('Failed to create news:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const news = db.prepare(`
      SELECT * FROM weather_news 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();

    return NextResponse.json(news);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}