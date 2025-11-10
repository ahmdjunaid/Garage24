import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import UnderReview from "../../components/garage/UnderReview";
import OnboardingForm from "../../components/garage/OnboardingForm";
import Spinner from "../../components/elements/Spinner";
import { fetchGarageStatusApi } from "../../services/garage";

const GarageOnboarding = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [garageStatus, setGarageStatus] = useState<{ hasGarage: boolean; isApproved: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await fetchGarageStatusApi();
        setGarageStatus(data);
        setFormSubmitted(true)
      } catch (err) {
        console.error("Error fetching garage status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [user]);

  if (loading) return <Spinner loading={loading}/>;

  if (garageStatus?.hasGarage && !garageStatus.isApproved && !user?.isOnboardingRequired && formSubmitted) {
    return <UnderReview />;
  }

  return <OnboardingForm handleSubmit={()=>setFormSubmitted(true)}/>;
};

export default GarageOnboarding;
