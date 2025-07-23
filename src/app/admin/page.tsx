import { getAppointments, type Appointment } from "@/lib/appointments-store";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import Link from 'next/link';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";


function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    }).format(date);
}

export default function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin-auth')?.value === 'true';

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const appointments = getAppointments();

  return (
    <div className="flex flex-col min-h-screen">
       <header className="py-4 px-4 sm:px-6 lg:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-4">
                <Stethoscope className="h-8 w-8 text-primary" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-headline">
                    Smile Hub
                </h1>
            </Link>
            <div className="flex items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Admin Panel</h2>
              <LogoutButton />
            </div>
        </div>
      </header>
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Preferred Date</TableHead>
                      <TableHead>Preferred Time</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appt: Appointment) => (
                      <TableRow key={appt.id}>
                        <TableCell>{formatDateTime(appt.createdAt)}</TableCell>
                        <TableCell>{appt.name}</TableCell>
                        <TableCell>{appt.email}</TableCell>
                        <TableCell>{appt.phone}</TableCell>
                        <TableCell>{appt.preferredDate}</TableCell>
                        <TableCell>{appt.preferredTime}</TableCell>
                        <TableCell>{appt.reason || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No appointment requests yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
