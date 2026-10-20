import { useApp } from '../contexts/AppContext';

export function useAppointments() {
  const {
    appointments,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    openBookingModal,
    closeBookingModal,
    bookingDoctor,
    loading,
  } = useApp();

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'upcoming');
  const pastAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    cancelledAppointments,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    openBookingModal,
    closeBookingModal,
    bookingDoctor,
    loading,
  };
}
