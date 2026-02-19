import { motion } from "framer-motion";
import UserHeader from "@/components/common/UserHeader";
import UserFooter from "@/components/common/UserFooter";
import AboutJourney from "@/features/home/components/AboutJourney";
import AppointmentDetailsPageSection from "@/features/appointments/components/AppointmentDetailsPageSection";
import type React from "react";

interface DetailPageProps {
  isUserView: boolean;
}

const Appointment:React.FC<DetailPageProps> = ({isUserView}) => {

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
          <AppointmentDetailsPageSection isUserView={isUserView}/>
        </motion.div>

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
