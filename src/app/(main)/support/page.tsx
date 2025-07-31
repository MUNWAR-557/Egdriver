import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const faqs = [
    {
        question: "How do I update my payment information?",
        answer: "You can update your payment information in the 'Profile' section under 'Payment Settings'. Ensure your details are correct to avoid any delays in payouts."
    },
    {
        question: "What should I do if I can't find the pickup location?",
        answer: "If you're having trouble finding a pickup location, first try using the in-app map for precise directions. If you still can't find it, you can contact the restaurant or store directly using the contact information provided in the task details."
    },
    {
        question: "How are my earnings calculated?",
        answer: "Your earnings are calculated based on the base fare for each delivery, plus any tips you receive from the customer. The base fare considers distance, time, and effort. You can see a detailed breakdown in your 'Earnings' tab."
    },
    {
        question: "What happens if a customer is not available for delivery?",
        answer: "Follow the in-app instructions for unavailable customers. This usually involves trying to contact the customer via call or message, waiting for a specified amount of time, and then following the prompts to resolve the delivery."
    }
];

export default function SupportPage() {
    return (
        <div className="container mx-auto grid gap-12 md:grid-cols-2">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index + 1}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Support</CardTitle>
                        <CardDescription>If you can't find an answer in the FAQ, feel free to reach out to us directly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g., Issue with task TSK004" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea id="message" placeholder="Please describe your issue in detail..." rows={5} />
                        </div>
                        <Button className="w-full">Send Message</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
