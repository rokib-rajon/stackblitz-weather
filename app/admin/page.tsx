import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Bell, Newspaper } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/alerts">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage and create weather alerts for specific areas in Bangladesh
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/news">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Weather News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Post and manage weather-related news articles
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}