"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Loader2 } from "lucide-react";

import { submitAppointmentRequest, type AppointmentFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const appointmentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  preferredDate: z.date({ required_error: "Please select a date." }),
  preferredTime: z.string({ required_error: "Please select a time slot." }),
  reason: z.string().min(1, { message: "Please provide a reason for your visit." }).optional().or(z.literal('')),
});

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit Request"
      )}
    </Button>
  );
}

export function AppointmentForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const initialState: AppointmentFormState = { message: "", success: false, errors: {} };
    const [state, formAction] = useFormState(submitAppointmentRequest, initialState);

    const form = useForm<z.infer<typeof appointmentSchema>>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: { name: "", email: "", phone: "", reason: "" },
    });

    useEffect(() => {
        if (state.success) {
            toast({ title: "Success!", description: state.message });
            form.reset();
            formRef.current?.reset();
            setShowSuccess(true);
        } else if (state.message && !state.success && state.errors && Object.keys(state.errors).length > 0) {
            toast({
                title: "Please Correct Errors",
                description: state.message,
                variant: "destructive",
            });
            for (const [key, value] of Object.entries(state.errors)) {
                form.setError(key as keyof z.infer<typeof appointmentSchema>, {
                    type: "server",
                    message: (value as string[])[0],
                });
            }
        }
    }, [state, form, toast]);

    if (showSuccess) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>Request an Appointment</CardTitle>
                <CardDescription>Fill out the form below to request an appointment. We'll be in touch soon!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center gap-4 p-8">
                <Alert variant="default" className="border-green-500">
                    <CheckCircle className="h-4 w-4 !text-green-500" />
                    <AlertTitle className="text-green-700 font-semibold">Request Sent Successfully!</AlertTitle>
                    <AlertDescription className="text-green-600">
                        {state.message}
                    </AlertDescription>
                </Alert>
                <Button onClick={() => setShowSuccess(false)}>Make Another Appointment</Button>
            </CardContent>
        </Card>
      )
    }

  return (
    <Card id="appointment-form">
      <CardHeader>
        <CardTitle>Request an Appointment</CardTitle>
        <CardDescription>Fill out the form below to request an appointment. We'll be in touch soon!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(() => {
                  formAction(new FormData(formRef.current!));
              })(evt);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="preferredDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Preferred Date</FormLabel>
                  <Popover><PopoverTrigger asChild>
                    <FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button></FormControl>
                  </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                  </PopoverContent></Popover><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="preferredTime" render={({ field }) => (
                <FormItem><FormLabel>Preferred Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a time slot" /></SelectTrigger></FormControl>
                    <SelectContent>{timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="reason" render={({ field }) => (
              <FormItem><FormLabel>Reason for Visit (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Routine check-up, tooth pain, etc." className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <input type="hidden" name="name" value={form.watch('name')} />
            <input type="hidden" name="email" value={form.watch('email')} />
            <input type="hidden" name="phone" value={form.watch('phone')} />
            <input type="hidden" name="preferredDate" value={form.watch('preferredDate') ? format(form.watch('preferredDate'), 'yyyy-MM-dd') : ''} />
            <input type="hidden" name="preferredTime" value={form.watch('preferredTime') || ''} />
            <input type="hidden" name="reason" value={form.watch('reason')} />
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
