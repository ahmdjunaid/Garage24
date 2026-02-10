import { motion } from "framer-motion";
import UserHeader from "@/features/home/components/UserHeader";
import UserFooter from "@/features/home/components/UserFooter";
import { VehicleListing } from "@/features/myGarage/components/VehicleListing";
import AboutJourney from "@/features/home/components/AboutJourney";

const MyGarage = () => {
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
        <VehicleListing/>
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

export default MyGarage;
