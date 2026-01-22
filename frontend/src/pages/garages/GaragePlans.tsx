import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "@components/layouts/admin/AdminSidebar";
import {
  fetchAllPlansApi,
  getCurrentSubscriptionApi,
  retriveTransactionApi,
  subscribePlanApi,
} from "@/services/garageServices";
import AdminHeader from "@components/layouts/admin/AdminHeader";
import _ from "lodash";
import type { IPlan, IRetriveSessionData } from "@/types/PlanTypes";
import Pagination from "@components/layouts/admin/Pagination";
import { errorToast } from "@/utils/notificationAudio";
import { useLocation } from "react-router-dom";
import PaymentSuccess from "@components/layouts/PaymentSuccess";
import Spinner from "@components/elements/Spinner";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { ISubscription } from "@/types/SubscriptionTypes";
import PaymentFailed from "@components/modal/PaymentFailed";
import { PlanCard } from "@/components/elements/PlanCard";

const GaragePlans = () => {
  const [currentPlan, setCurrentPlan] = useState<ISubscription | null>(null);
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [paymentData, setPaymentData] = useState<IRetriveSessionData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [hasActivePlan, setActivePlan] = useState<boolean>(false);
  const [isPaymentFailed, setPaymentFailed] = useState<boolean>(false);
  const plansPerPage = 6;

  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const status = queryParams.get("payment");
    if (status === "failed") {
      setPaymentFailed(true);
      window.history.replaceState(null, "", "/garage/plans");
    }
  }, [queryParams]);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (user) {
        const res = await getCurrentSubscriptionApi(user._id);
        setCurrentPlan(res.plan);
        setActivePlan(res.isActive);
      }
    };
    fetchSubscriptionDetails();
  }, [user]);

  // Fetch plans
  const fetchPlans = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await fetchAllPlansApi(
          currentPage,
          plansPerPage,
          searchQuery,
        );
        setPlans(response.plans);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    },
    [plansPerPage],
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => fetchPlans(page, query), 300),
    [fetchPlans],
  );

  useEffect(() => {
    if (!searchQuery) fetchPlans(currentPage, "");
    else debouncedFetch(currentPage, searchQuery);

    return () => debouncedFetch.cancel();
  }, [currentPage, searchQuery, fetchPlans, debouncedFetch]);

  const handleSubscribe = async (
    planId: string,
    planName: string,
    planPrice: number,
  ) => {
    if (hasActivePlan) {
      errorToast(
        "You currently have an active subscription. You can buy another plan after it expires.",
      );
      return;
    }

    try {
      const response = await subscribePlanApi({ planId, planName, planPrice });
      if (response.url) window.location.href = response.url;
      else errorToast("No checkout URL received");
    } catch (error) {
      console.error(error);
      errorToast(
        (error as Error).message || "Error while creating payment session.",
      );
    }
  };

  const handleRenew = async (
    planId: string,
    planName: string,
    planPrice: number,
    daysLeft: number,
  ) => {
    if (!hasActivePlan && daysLeft > 7) {
      errorToast("Renewal is available only within 7 days of plan expiry.");
      return;
    }

    try {
      const response = await subscribePlanApi({ planId, planName, planPrice });
      if (response.url) window.location.href = response.url;
      else errorToast("No checkout URL received");
    } catch (error) {
      console.error(error);
      errorToast(
        (error as Error).message || "Error while creating payment session.",
      );
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!sessionId) return;
      setLoading(true);
      try {
        const res = await retriveTransactionApi(sessionId);
        setPaymentData(res);
      } catch (error) {
        if (error instanceof Error)
          errorToast("Failed to fetch transaction details");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [sessionId]);

  const activePlan = useMemo(() => {
    if (!currentPlan) return null;
    return plans.find((p) => p._id === currentPlan.planId) || null;
  }, [plans, currentPlan]);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="garage" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          text="Plans"
          searchPlaceholder="Search Plans..."
          setSearchQuery={setSearchQuery}
        />

        {sessionId ? (
          <PaymentSuccess paymentData={paymentData} />
        ) : (
          <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
            {/* Current Plan Expiry Info */}
            {currentPlan && (
              <div className="text-center mt-6 mb-6">
                {new Date(currentPlan.expiryDate) > new Date() ? (
                  <h3 className="text-gray-300 text-lg">
                    Your current plan will expire on{" "}
                    <span className="text-red-500 font-semibold">
                      {new Date(currentPlan.expiryDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                    .
                  </h3>
                ) : (
                  <h3 className="text-red-500 text-lg font-semibold">
                    Your plan expired on{" "}
                    <span className="text-gray-300 font-normal">
                      {new Date(currentPlan.expiryDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                    .
                  </h3>
                )}
              </div>
            )}

            {/* Plans Section */}
            <div className="flex flex-wrap justify-center gap-8">
              {activePlan ? (
                <PlanCard
                  plan={activePlan}
                  currentPlan={currentPlan}
                  handleRenew={handleRenew}
                />
              ) : (
                plans.map((plan) => (
                  <PlanCard
                    key={plan._id}
                    plan={plan}
                    currentPlan={currentPlan}
                    handleSubscribe={handleSubscribe}
                  />
                ))
              )}
            </div>

            <Spinner loading={loading} />

            <PaymentFailed
              isOpen={isPaymentFailed}
              onClose={() => setPaymentFailed(false)}
            />

            {!currentPlan && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GaragePlans;
