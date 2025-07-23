
export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  reason?: string;
  createdAt: Date;
};

// This is our "database"
const appointments: Appointment[] = [];

export function addAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
  const newAppointment: Appointment = {
    ...appointmentData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  appointments.push(newAppointment);
  return newAppointment;
}

export function getAppointments(): Appointment[] {
  // Return a sorted copy of the appointments, most recent first.
  return [...appointments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
