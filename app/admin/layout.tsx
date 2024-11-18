import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Weather App',
  description: 'Admin dashboard for managing weather alerts and news',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Weather Admin</h1>
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/admin">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/alerts">Alerts</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/news">News</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}