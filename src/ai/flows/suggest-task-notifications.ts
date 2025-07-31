'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting delivery tasks to drivers based on their location and availability.
 *
 * - suggestTaskNotifications - A function that triggers the task suggestion flow.
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
      taskId: z.string().describe('The unique identifier of the delivery task.'),
      pickupLocation: z
        .object({
          latitude: z.number().describe('The latitude of the pickup location.'),
          longitude: z.number().describe('The longitude of the pickup location.'),
        })
        .describe('The pickup location of the task.'),
      deliveryAddress: z.string().describe('The delivery address of the task.'),
      orderItems: z.string().describe('The items to be delivered in the order.'),
      deliveryTimeframe: z.string().describe('The delivery timeframe for the task.'),
      estimatedEarnings: z
        .number()
        .describe('The estimated earnings for completing the task.'),
    })
  ).describe('A list of suggested delivery tasks for the driver.'),
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
  prompt: `You are an AI assistant that suggests delivery tasks to drivers based on their current location and availability.

You will receive the driver's current location, available capacity, and a list of available delivery tasks.
Your goal is to identify the most relevant tasks for the driver to maximize their earnings and efficiently utilize their time.

Driver ID: {{{driverId}}}
Current Location: Latitude: {{{currentLocation.latitude}}}, Longitude: {{{currentLocation.longitude}}}
Available Capacity: {{{availableCapacity}}}

Consider the proximity of tasks to the driver's current location, the estimated earnings for each task, and the driver's available capacity when making your suggestions.
Prioritize tasks that are close to the driver and offer high earnings.

Output a JSON array of suggested tasks, including the task ID, pickup location, delivery address, order items, delivery timeframe, and estimated earnings for each task.

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
`, // Fixed the prompt to correctly utilize Handlebars syntax and include example output.
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
