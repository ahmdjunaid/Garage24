import { motion } from "framer-motion";
import UserHeader from "@/components/common/UserHeader";
import UserFooter from "@/components/common/UserFooter";
import AboutJourney from "@/features/home/components/AboutJourney";
import CarServiceAppointmentForm from "@/features/appointments/components/AppointmentForm";
import { useEffect, useState } from "react";
import { errorToast } from "@/utils/notificationAudio";
import AppointmentSuccess from "@/features/appointments/components/AppointmentSuccess";
import type { PopulatedAppointmentData } from "@/types/AppointmentTypes";
import { useSearchParams } from "react-router-dom";
import { getAppointmentDetails } from "../../services/appointmentServices";

const Appointment = () => {
  const [appointment, setAppointment] =
    useState<PopulatedAppointmentData | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const appointmentId = searchParams.get("id");

  const onSuccess = (id: string) => {
    setSearchParams({ success: "true", id });
  };

  useEffect(() => {
    if (success === "true" && appointmentId) {
      fetchAppointmentData(appointmentId);
    }
  }, [success, appointmentId]);

  const fetchAppointmentData = async (appointmentId: string) => {
    if (!appointmentId) return;
    try {
      const res = await getAppointmentDetails(appointmentId);
      setAppointment(res);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  };

  return (
    <>
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <UserHeader />
      </motion.div>

      {!appointment ? (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <CarServiceAppointmentForm onSuccess={(id) => onSuccess(id)} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <AppointmentSuccess
            bookingNumber={appointment?.appId}
            date={appointment?.appointmentDate}
            garageName={appointment?.garageId.name}
            time={appointment?.startTime}
            address={appointment.garageId.address}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <AboutJourney />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <UserFooter />
      </motion.div>
    </>
  );
};

export default Appointment;
