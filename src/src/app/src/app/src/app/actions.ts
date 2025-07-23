"use server";

import { z } from "zod";
import { symptomChecker } from "@/ai/flows/symptom-checker";
import { dentalKnowledge } from "@/lib/dental-knowledge";

// Symptom Checker Action
export async function runSymptomChecker(symptoms: string) {
  if (!symptoms || symptoms.trim().length < 10) {
    return { error: "Please provide a more detailed description of your symptoms." };
  }

  try {
    const result = await symptomChecker({
      symptoms,
      dentalKnowledge,
    });
    return { potentialIssues: result.potentialIssues };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

// Appointment Form Action
const appointmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  preferredDate: z.string().min(1, "Please select a date."),
  preferredTime: z.string().min(1, "Please select a time slot."),
  reason: z.string().min(1, "Please provide a reason for your visit.").optional().or(z.literal('')),
});

export type AppointmentFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    preferredDate?: string[];
    preferredTime?: string[];
    reason?: string[];
  } | {};
  success: boolean;
};

export async function submitAppointmentRequest(
  prevState: AppointmentFormState,
  formData: FormData
): Promise<AppointmentFormState> {
  const validatedFields = appointmentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    reason: formData.get("reason"),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to submit request. Please check the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // Here you would typically save the data to a database.
  // For this example, we'll just log it to the console.
  console.log("New Appointment Request:", validatedFields.data);

  return {
    message: "Thank you! Your appointment request has been submitted. We will contact you shortly to confirm.",
    success: true,
    errors: {},
  };
}
