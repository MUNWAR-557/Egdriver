
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Loader2 } from 'lucide-react';
import {
  suggestTaskNotifications,
  SuggestTaskNotificationsOutput,
} from '@/ai/flows/suggest-task-notifications';

export function AiSuggestions() {
  const [suggestions, setSuggestions] = useState<
    SuggestTaskNotificationsOutput['suggestedTasks'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await suggestTaskNotifications({
        driverId: 'driver-007',
        currentLocation: { latitude: 34.0522, longitude: -118.2437 },
        availableCapacity: 3,
      });
      setSuggestions(
        result.suggestedTasks && result.suggestedTasks.length > 0
          ? result.suggestedTasks
          : []
      );
    } catch (err) {
      setError('Failed to fetch AI suggestions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Bot className="mr-2 h-4 w-4" />
          Get AI Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AI-Powered Order Suggestions</DialogTitle>
          <DialogDescription>
            Let our AI find the most optimal orders for you based on your
            location and capacity.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Button
            onClick={handleGetSuggestions}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Analyzing...' : 'Suggest Me Orders Now'}
          </Button>
        </div>
        <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {suggestions === null && !isLoading && (
            <p className="text-center text-muted-foreground">
              Click the button to get your personalized order suggestions.
            </p>
          )}
          {suggestions && suggestions.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground">
              No new suggestions found at the moment.
            </p>
          )}
          {suggestions &&
            suggestions.map((order) => (
              <Card key={order.taskId} className="bg-secondary">
                <CardHeader>
                  <CardTitle className="text-base">
                    Deliver to: {order.deliveryAddress}
                  </CardTitle>
                  <CardDescription>
                    Estimated Earnings:{' '}
                    <span className="font-bold text-primary">
                      ₹{order.estimatedEarnings.toFixed(2)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Pickup: {order.pickupLocation.latitude},{' '}
                    {order.pickupLocation.longitude}
                  </p>
                  <p>Items: {order.orderItems}</p>
                  <p>Timeframe: {order.deliveryTimeframe}</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">
                    Accept Suggested Order
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
