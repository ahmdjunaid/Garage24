import React from "react";
import DarkModal from "../../../components/modal/DarkModal";
import { useNavigate } from "react-router-dom";
import type { ISubscription } from "@/types/SubscriptionTypes";
import { calculateDaysLeft } from "@/utils/calculateDaysLeft";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription?: ISubscription | null;
}

const SubscriptionAlertModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
}) => {
  const navigate = useNavigate();

  let daysLeft;
  if (currentSubscription) {
    daysLeft = calculateDaysLeft(currentSubscription?.expiryDate);
  }

  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {currentSubscription
            ? "Subscription Expiring Soon"
            : "No Active Subscription"}
        </h2>

        {currentSubscription ? (
          <p className="text-sm text-white/70">
            Your current subscription will expire in{" "}
            <span className="font-semibold text-white">{daysLeft} days</span>.
            <br />
            Renew your plan to avoid service interruption.
          </p>
        ) : (
          <p className="text-sm text-white/70">
            Your garage does not have an active subscription plan. Please choose
            a plan to continue receiving bookings and access platform features.
          </p>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => navigate("/garage/plans", { replace: true })}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white"
          >
            {currentSubscription ? "Renew Now" : "Get a Plan"}
          </button>
        </div>
      </div>
    </DarkModal>
  );
};

export default SubscriptionAlertModal;
