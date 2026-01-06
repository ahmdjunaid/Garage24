import AdminSidebar from "@components/layouts/admin/AdminSidebar";
import AdminHeader from "@components/layouts/admin/AdminHeader";
import { useEffect, useState } from "react";
import { getCurrentSubscriptionApi } from "@/services/garageServices";
import type { ISubscription } from "@/types/SubscriptionTypes";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import SubscriptionAlertModal from "@/components/modal/SubscriptionAlertModal";
import { calculateDaysLeft } from "@/utils/calculateDaysLeft";

const GarageHome = () => {
  const [currentPlan, setCurrentPlan] = useState<ISubscription | null>(null);
  const [hasActivePlan, setActivePlan] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);

  let daysLeft;
  if (currentPlan) {
    daysLeft = calculateDaysLeft(currentPlan?.expiryDate)
  }

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (user) {
        const res = await getCurrentSubscriptionApi(user._id);
        console.log(res, "dashboard");
        setCurrentPlan(res.plan);
        setActivePlan(res.isActive);
      }
    };
    fetchSubscriptionDetails();
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="garage" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader text={"Dashboard"} />
      </div>

      <SubscriptionAlertModal
        isOpen={!hasActivePlan || (typeof daysLeft === "number" && daysLeft < 7)}
        onClose={() => {
          setActivePlan(true)
          setCurrentPlan(null)
        }}
        currentSubscription={currentPlan}
      />
    </div>
  );
};

export default GarageHome;
