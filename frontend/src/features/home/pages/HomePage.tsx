import { motion } from "framer-motion";
import UserFooter from "@/features/home/components/UserFooter";
import UserHeader from "@/features/home/components/UserHeader";
import UserProcess from "@/features/home/components/UserProcess";
import Garage24Testimonials from "@/features/home/components/UserTestimonials";
import SelectVehicleModal from "@/features/myGarage/modals/SelectVehicleModal";
import { useState } from "react";

export default function HomePage() {
  const [showSelectModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <UserHeader ctaSize="full" showCta={true} handleAppointmentClick={()=>setShowModal(!showSelectModal)}/>
      </motion.div>

      {/* detailed banner */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <UserProcess />
      </motion.div>

      {/* testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <Garage24Testimonials />
      </motion.div>

      {/* footer */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <UserFooter />
      </motion.div>

      <SelectVehicleModal isOpen={showSelectModal} onClose={()=>setShowModal(false)}/>
    </>
  );
}
