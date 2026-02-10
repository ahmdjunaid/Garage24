import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import Spinner from "@/components/common/Spinner";
import type { approvalStatus } from "@/types/GarageTypes";
import { errorToast } from "@/utils/notificationAudio";
import { useNavigate } from "react-router-dom";
import { fetchGarageStatusApi } from "@/features/subscription/services/subscriptionService";
import UnderReview from "../components/UnderReview";
import OnboardingForm from "../components/OnboardingForm";

interface GarageStatus {
  hasGarage: boolean;
  approvalStatus: approvalStatus;
  hasActivePlan?: boolean;
}

const GarageOnboarding = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [garageStatus, setGarageStatus] = useState<GarageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUnderReview, setShowUnderReview] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const data = await fetchGarageStatusApi();
        setGarageStatus(data);
      } catch (err) {
        console.error("Error fetching garage status:", err);
        errorToast("Failed to load garage status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [user]);

  const handleOnboardingSubmit = async () => {
    try {
      setShowUnderReview(true);
    } catch (err) {
      console.error("Error on submit:", err);
    }
  };

  if (loading) return <Spinner loading={loading} />;

  if (
    showUnderReview ||
    (garageStatus?.hasGarage && garageStatus.approvalStatus === "pending")
  ) {
    return <UnderReview />;
  }

  if(garageStatus?.hasGarage && garageStatus.approvalStatus === "approved"){
    navigate('/garage')
    return
  }

  return <OnboardingForm handleSubmit={handleOnboardingSubmit} />;
};

export default GarageOnboarding;
