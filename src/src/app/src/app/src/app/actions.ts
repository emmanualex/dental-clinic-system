"use server";

import { z } from "zod";
import { symptomChecker } from "@/ai/flows/symptom-checker";
import { dentalKnowledge } from "@/lib/dental-knowledge";
import { addAppointment } from "@/lib/appointments-store";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


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
  
  try {
    addAppointment(validatedFields.data);
  } catch(e) {
      console.error("Failed to save appointment", e);
      return {
          message: "A server error occurred. Could not save your appointment. Please try again later.",
          success: false,
          errors: {},
      }
  }


  return {
    message: "Thank you! Your appointment request has been submitted. We will contact you shortly to confirm.",
    success: true,
    errors: {},
  };
}

export type LoginFormState = {
  error?: string;
  success: boolean;
}

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const password = formData.get('password');
  // In a real application, use an environment variable for the password.
  if (password === 'admin123') {
    cookies().set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/admin');
  } else {
    return {
      error: 'Invalid password.',
      success: false,
    }
  }
}

export async function logout() {
  cookies().delete('admin-auth');
  redirect('/admin/login');
}
