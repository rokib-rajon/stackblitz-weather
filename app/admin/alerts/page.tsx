'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { bangladeshDistricts } from '@/lib/constants/districts';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function AlertsPage() {
  const [alertData, setAlertData] = useState({
    title: '',
    content: '',
    areas: [] as string[],
    severity: 'info',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alertData.areas.length === 0) {
      toast.error('Please select at least one area');
      return;
    }

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        toast.success('Alert created and notifications sent');
        setAlertData({
          title: '',
          content: '',
          areas: [],
          severity: 'info',
        });
      } else {
        toast.error('Failed to create alert');
      }
    } catch (error) {
      toast.error('Error creating alert');
    }
  };

  const toggleArea = (district: string) => {
    setAlertData(prev => ({
      ...prev,
      areas: prev.areas.includes(district)
        ? prev.areas.filter(a => a !== district)
        : [...prev.areas, district],
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Weather Alerts Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Weather Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={alertData.title}
                onChange={(e) => setAlertData({ ...alertData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={alertData.content}
                onChange={(e) => setAlertData({ ...alertData, content: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Areas</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                {bangladeshDistricts.map((district) => (
                  <div key={district} className="flex items-center space-x-2">
                    <Checkbox
                      id={district}
                      checked={alertData.areas.includes(district)}
                      onCheckedChange={() => toggleArea(district)}
                    />
                    <Label htmlFor={district}>{district}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={alertData.severity}
                onValueChange={(value) => setAlertData({ ...alertData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit">Create Alert</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}