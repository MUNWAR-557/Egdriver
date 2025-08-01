'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting delivery orders to drivers based on their location and availability.
 *
 * - suggestTaskNotifications - A function that triggers the order suggestion flow.
 * - SuggestTaskNotificationsInput - The input type for the suggestTaskNotifications function.
 * - SuggestTaskNotificationsOutput - The return type for the suggestTaskNotifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskNotificationsInputSchema = z.object({
  driverId: z.string().describe('The unique identifier of the driver.'),
  currentLocation: z
    .object({
      latitude: z.number().describe('The latitude of the driver.'),
      longitude: z.number().describe('The longitude of the driver.'),
    })
    .describe('The current location of the driver.'),
  availableCapacity: z
    .number()
    .describe('The available delivery capacity of the driver (e.g., number of orders).'),
});
export type SuggestTaskNotificationsInput = z.infer<
  typeof SuggestTaskNotificationsInputSchema
>;

const SuggestTaskNotificationsOutputSchema = z.object({
  suggestedTasks: z.array(
    z.object({
      taskId: z.string().describe('The unique identifier of the delivery order.'),
      pickupLocation: z
        .object({
          latitude: z.number().describe('The latitude of the pickup location.'),
          longitude: z.number().describe('The longitude of the pickup location.'),
        })
        .describe('The pickup location of the order.'),
      deliveryAddress: z.string().describe('The delivery address of the order.'),
      orderItems: z.string().describe('The items to be delivered in the order.'),
      deliveryTimeframe: z.string().describe('The delivery timeframe for the order.'),
      estimatedEarnings: z
        .number()
        .describe('The estimated earnings for completing the order.'),
    })
  ).describe('A list of suggested delivery orders for the driver.'),
});
export type SuggestTaskNotificationsOutput = z.infer<
  typeof SuggestTaskNotificationsOutputSchema
>;

export async function suggestTaskNotifications(
  input: SuggestTaskNotificationsInput
): Promise<SuggestTaskNotificationsOutput> {
  return suggestTaskNotificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskNotificationsPrompt',
  input: {schema: SuggestTaskNotificationsInputSchema},
  output: {schema: SuggestTaskNotificationsOutputSchema},
  prompt: `You are an AI assistant that suggests delivery orders to drivers based on their current location and availability.

You will receive the driver's current location, available capacity, and a list of available delivery orders.
Your goal is to identify the most relevant orders for the driver to maximize their earnings and efficiently utilize their time.

Driver ID: {{{driverId}}}
Current Location: Latitude: {{{currentLocation.latitude}}}, Longitude: {{{currentLocation.longitude}}}
Available Capacity: {{{availableCapacity}}}

Consider the proximity of orders to the driver's current location, the estimated earnings for each order, and the driver's available capacity when making your suggestions.
Prioritize orders that are close to the driver and offer high earnings.

Output a JSON array of suggested orders, including the order ID, pickup location, delivery address, order items, delivery timeframe, and estimated earnings for each order.

Example output:
{
  "suggestedTasks": [
    {
      "taskId": "123",
      "pickupLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "deliveryAddress": "123 Main St, Los Angeles, CA",
      "orderItems": "Pizza and drinks",
      "deliveryTimeframe": "12:00 PM - 1:00 PM",
      "estimatedEarnings": 15.00
    }
  ]
}

Follow the output schema strictly.
`,
});

const suggestTaskNotificationsFlow = ai.defineFlow(
  {
    name: 'suggestTaskNotificationsFlow',
    inputSchema: SuggestTaskNotificationsInputSchema,
    outputSchema: SuggestTaskNotificationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
