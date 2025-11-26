import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/layouts/AdminSidebar";
import {
  fetchAllPlansApi,
  getCurrentSubscriptionApi,
  retriveTransactionApi,
  subscribePlanApi,
} from "../../services/garageServices";
import AdminHeader from "../../components/layouts/AdminHeader";
import _ from "lodash";
import type { IPlan, IRetriveSessionData } from "../../types/PlanTypes";
import Pagination from "../../components/layouts/Pagination";
import { errorToast } from "../../utils/notificationAudio";
import { useLocation } from "react-router-dom";
import PaymentSuccess from "../../components/layouts/PaymentSuccess";
import Spinner from "../../components/elements/Spinner";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { ISubscription } from "../../types/Subscription";

const GaragePlans = () => {
  const [currentPlan, setCurrentPlan] = useState<ISubscription | null>(null);
  const [plans, allPlans] = useState<IPlan[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [paymentData, setPaymentData] = useState<IRetriveSessionData|null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasActivePlan, setActivePlan] = useState<boolean>(false)
  const mechanicsPerPage = 5;

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get("session_id");
  const { user } = useSelector((state:RootState)=>state.auth)

  useEffect(()=>{
    const fetchSubscriptionDetails = async () =>{
      if(user){
        const res = await getCurrentSubscriptionApi(user._id)
        setCurrentPlan(res.plan)
        setActivePlan(res.isActive)
      }
    }
    fetchSubscriptionDetails()
  },[user])

  const fetchPlans = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await fetchAllPlansApi(
          currentPage,
          mechanicsPerPage,
          searchQuery
        );
        console.log(response);
        allPlans(response.plans);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error from page:", error);
      }
    },
    [mechanicsPerPage]
  );

  const debouncedFetch = useMemo(
    () =>
      _.debounce((page: number, query: string) => {
        fetchPlans(page, query);
      }, 300),
    [fetchPlans]
  );

  useEffect(() => {
    if (!searchQuery) {
      fetchPlans(currentPage, "");
    } else {
      debouncedFetch(currentPage, searchQuery);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [currentPage, searchQuery, fetchPlans, debouncedFetch]);

  const handleSubscribe = async (
    planId: string,
    planName: string,
    planPrice: number
  ) => {
    if(hasActivePlan) {
      errorToast("You currently have an active subscription. You can buy another plan after it expires.")
      return
    }
    if (!planId || !planName || !planPrice) return;
    try {
      const response = await subscribePlanApi({ planId, planName, planPrice });
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      const err = error as Error;
      console.log(error);
      errorToast(err.message || "Error while creating payment session.");
    }
  };

useEffect(() => {
  const fetchTransactionDetails = async () => {
    if (sessionId) {
      setLoading(true)
      try {
        const res = await retriveTransactionApi(sessionId);
        setPaymentData(res);
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
        errorToast("Failed to fetch transaction details")
      } finally {
        setLoading(false)
      }
    }
  };

  fetchTransactionDetails();
}, [sessionId]);



  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar role="garage" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          text={"Plans"}
          searchPlaceholder={"Search Plans..."}
          setSearchQuery={setSearchQuery}
        />
        {/* Content Area */}
        {sessionId ? (
          <PaymentSuccess paymentData={paymentData}/>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">
            {/* Table with glass effect */}
            <div className="bg-transparent text-white pb-5">
              {currentPlan && (
              <div className="text-center mt-6 mb-6">
                { new Date(currentPlan.expiryDate) > new Date() ? (
                  <h3 className="text-gray-300 text-lg">
                    Your current plan will expire on{" "}
                    <span className="text-red-500 font-semibold">
                      {new Date(currentPlan.expiryDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
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
                        }
                      )}
                    </span>
                    .
                  </h3>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-8">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`w-[300px] rounded-2xl shadow-lg border border-red-700 p-6 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] hover:scale-105 hover:shadow-red-700/40 transition-all duration-300`}
                  >
                    <h2 className="text-2xl font-semibold mb-3 text-center">
                      {plan.name}
                    </h2>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-gray-400">
                        {" "}
                        for {plan.validity} Days
                      </span>
                    </div>

                    <button
                      disabled={plan._id===currentPlan?.planId}
                      className={`w-full py-2 mt-2 rounded-lg font-semibold transition-all ${
                        plan._id===currentPlan?.planId
                          ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                      onClick={() =>
                        handleSubscribe(plan._id, plan.name, plan.price)
                      }
                    >
                      {plan._id===currentPlan?.planId ? "Current Plan" : `Get ${plan.name}`}
                    </button>

                    <ul className="mt-6 text-sm text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✔</span>{" "}
                        {plan.noOfMechanics} Mechanics are allowed.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✔</span>{" "}
                        {plan.noOfServices} Services are allowed.
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Spinner loading={loading}/>

            {/* Pagination */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GaragePlans;
