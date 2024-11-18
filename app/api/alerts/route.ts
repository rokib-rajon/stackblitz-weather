import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import webpush from 'web-push';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { title, content, areas, severity } = data;

  if (!areas || areas.length === 0) {
    return NextResponse.json(
      { error: 'At least one area must be selected' },
      { status: 400 }
    );
  }

  try {
    // Create alert for each selected area
    const alertId = randomUUID();
    const values = areas.map(area => 
      `('${alertId}', '${title}', '${content}', '${area}', '${severity}', '${session.user.id}')`
    ).join(',');

    db.prepare(`
      INSERT INTO alerts (id, title, content, area, severity, author_id)
      VALUES ${values}
    `).run();

    // Get subscriptions for the selected areas
    const subscriptions = db.prepare(`
      SELECT * FROM subscriptions WHERE area IN (${areas.map(() => '?').join(',')})
    `).all(areas);

    // Send push notifications
    const notifications = subscriptions.map((sub) => {
      return webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        },
        JSON.stringify({
          title: `Weather Alert: ${title}`,
          body: content,
          tag: 'weather-alert',
        })
      );
    });

    await Promise.allSettled(notifications);

    return NextResponse.json({ id: alertId });
  } catch (error) {
    console.error('Failed to create alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get('area');

  if (!area) {
    return NextResponse.json({ error: 'Missing area parameter' }, { status: 400 });
  }

  try {
    const alerts = db.prepare(`
      SELECT * FROM alerts 
      WHERE area = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all(area);

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}