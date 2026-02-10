import AdminSidebar from "@/components/common/AdminSidebar";
import AdminHeader from "@/components/common/AdminHeader";
import { useEffect, useState } from "react";
import { getCurrentSubscriptionApi } from "@/features/management/garage/services/garageServices";
import type { ISubscription } from "@/types/SubscriptionTypes";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import SubscriptionAlertModal from "@/features/subscription/modals/SubscriptionAlertModal";
import { calculateDaysLeft } from "@/utils/calculateDaysLeft";
import { errorToast } from "@/utils/notificationAudio";

const GarageHome = () => {
  const [currentPlan, setCurrentPlan] = useState<ISubscription | null>(null);
  const [hasActivePlan, setActivePlan] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<ISubscription[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);

  let daysLeft;
  if (currentPlan) {
    daysLeft = calculateDaysLeft(currentPlan?.expiryDate);
  }

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await getCurrentSubscriptionApi(user._id);
          setCurrentPlan(res.plan);
          setActivePlan(res.isActive);
          setPendingPlan(res.pendingSubs);
        } catch (error) {
          console.error(error);
          if (error instanceof Error) errorToast(error.message);
        } finally {
          setLoading(false);
        }
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

      {!loading && pendingPlan === null && (
        <SubscriptionAlertModal
          isOpen={
            !hasActivePlan || (typeof daysLeft === "number" && daysLeft < 7)
          }
          onClose={() => {
            setActivePlan(true);
            setCurrentPlan(null);
          }}
          currentSubscription={currentPlan}
        />
      )}
    </div>
  );
};

export default GarageHome;
