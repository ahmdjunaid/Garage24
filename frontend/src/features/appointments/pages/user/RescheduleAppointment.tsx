import UserFooter from "@/features/home/components/UserFooter";
import UserHeader from "@/features/home/components/UserHeader";
import RescheduleAppointmentForm from "@/features/appointments/components/RescheduleAppointmentForm";
import { motion } from "framer-motion";

const RescheduleAppointment = () => {
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

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <RescheduleAppointmentForm />
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

export default RescheduleAppointment;