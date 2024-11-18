'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function NewsPage() {
  const [newsData, setNewsData] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData),
      });

      if (response.ok) {
        toast.success('News article created successfully');
        setNewsData({
          title: '',
          content: '',
          imageUrl: '',
        });
      } else {
        toast.error('Failed to create news article');
      }
    } catch (error) {
      toast.error('Error creating news article');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Weather News Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Weather News</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newsData.title}
                onChange={(e) => setNewsData({ ...newsData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={newsData.content}
                onChange={(e) => setNewsData({ ...newsData, content: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                type="url"
                value={newsData.imageUrl}
                onChange={(e) => setNewsData({ ...newsData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <Button type="submit">Create News Article</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}