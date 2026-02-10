import UserFooter from "@/features/home/components/UserFooter";
import UserHeader from "@/features/home/components/UserHeader";
import MyAppointmentsSection from "@/features/appointments/components/MyAppointmentSection";
import { motion } from "framer-motion";

const MyAppointments = () => {
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
        <MyAppointmentsSection />
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

export default MyAppointments;
