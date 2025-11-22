import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/layouts/AdminSidebar";
// import { errorToast, successToast } from "../../utils/notificationAudio";
import { fetchAllPlansApi } from "../../services/garageServices";
import AdminHeader from "../../components/layouts/AdminHeader";
import _ from "lodash";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import type { ActionPayload } from "../../types/CommonTypes";
import type { IPlan } from "../../types/PlanTypes";
import Pagination from "../../components/layouts/Pagination";

const GaragePlans = () => {
  const [currentPlan, setCurrentPlan] = useState(true);
  const [plans, allPlans] = useState<IPlan[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const mechanicsPerPage = 5;

  const fetchPlans = useCallback(
    async (currentPage: number, searchQuery: string) => {
      try {
        const response = await fetchAllPlansApi(
          currentPage,
          mechanicsPerPage,
          searchQuery
        );
        console.log(response)
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

  // const handleActivePlan = (planId) => {
  //   if(!planId) return

  //   try {
      
  //   } catch (error) {
      
  //   }
  // }

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
        <div className="flex-1 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 overflow-auto">

          {/* Table with glass effect */}
          <div className="min-h-screen bg-transparent text-white pt-10">
            {/* {currentPlan && (
              <div className="text-center mt-6 mb-6">
                {currentPlan.status === "inactive" ? (
                  <h3 className="text-yellow-400 text-lg font-semibold">
                    Your plan is not yet activated.
                  </h3>
                ) : new Date(currentPlan.expiryDate) > new Date() ? (
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
            )} */}

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
                    <span className="text-gray-400"> for {plan.validity} Days</span>
                  </div>

                  <button
                    disabled={plan.current}
                    className={`w-full py-2 mt-2 rounded-lg font-semibold transition-all ${
                      plan.current
                        ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {plan.current ? "Current Plan" : `Get ${plan.name}`}
                  </button>

                  <ul className="mt-6 text-sm text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✔</span> {plan.noOfMechanics} Mechanics are allowed.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✔</span> {plan.noOfServices} Services are allowed.
                      </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <Pagination 
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default GaragePlans;
