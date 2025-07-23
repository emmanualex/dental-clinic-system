import { ClipboardList, Clock, MapPin, Phone, Stethoscope } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { SymptomChecker } from "@/components/symptom-checker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function ClinicInfo() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Clinic Information</CardTitle>
        <CardDescription>Your trusted local dental care provider.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
          <span>123 Dental Street, kiambu, st 12345</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary flex-shrink-0" />
          <span>(254) 456-789-0123</span>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium">Opening Hours</p>
            <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 5:00 PM</p>
            <p className="text-muted-foreground">Sat: 10:00 AM - 2:00 PM</p>
            <p className="text-muted-foreground">Sun: Closed</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ClipboardList className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
           <div>
            <p className="font-medium">Services</p>
            <p className="text-muted-foreground">General Dentistry, Cosmetic Procedures, Orthodontics, Emergency Care</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Stethoscope className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-headline">
            Smile Hub
          </h1>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Welcome to Your Digital Dental Clinic</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule appointments, check your symptoms with our AI assistant, and find all our clinic information right here.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <ClinicInfo />
            </div>
            <div className="lg:col-span-3">
              <SymptomChecker />
            </div>
          </div>
          <div>
            <AppointmentForm />
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-4 sm:px-6 lg:px-8 mt-8 border-t">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Smile Hub. All rights reserved.</p>
          <p>123 Dental Street, kiambu , ST 12345 | (254) 456-789-0123</p>
        </div>
      </footer>
    </div>
  );
}
