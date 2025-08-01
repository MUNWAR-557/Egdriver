
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/settings/theme-toggle';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive notifications from us.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="task-updates" className="flex flex-col space-y-1">
            <span>Order Updates</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive notifications for new orders, status changes, and cancellations.
            </span>
          </Label>
          <Switch id="task-updates" defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="promotions" className="flex flex-col space-y-1">
            <span>Promotions & Tips</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Get emails about special promotions, tips for maximizing earnings, and news.
            </span>
          </Label>
          <Switch id="promotions" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
            <span>Dark Mode</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Enable or disable the dark theme for the application.
            </span>
          </Label>
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
     <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="destructive">Deactivate Account</Button>
              <p className="text-sm text-muted-foreground">
                Deactivating your account will permanently disable access. This action cannot be undone.
              </p>
          </CardContent>
        </Card>
        </div>
  );
}
