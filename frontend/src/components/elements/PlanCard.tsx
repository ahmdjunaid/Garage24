import type { IPlan } from "@/types/PlanTypes";
import type { ISubscription } from "@/types/SubscriptionTypes";
import { calculateDaysLeft } from "@/utils/calculateDaysLeft";
import type React from "react";

export interface PlanCardProps {
  plan: IPlan;
  currentPlan: ISubscription | null;
  handleSubscribe?: (planId: string, name: string, price: number) => void;
  handleRenew?: (planId: string, name: string, price: number, daysLeft: number) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  currentPlan,
  handleSubscribe,
  handleRenew,
}) => {
  let daysLeft;
  if (currentPlan) {
    daysLeft = calculateDaysLeft(currentPlan?.expiryDate);
  }

  return (
    <div
      className={`w-[300px] rounded-2xl shadow-lg border border-red-700 p-6 bg-gradient-to-br 
        from-gray-900 to-black overflow-hidden backdrop-blur-sm 
        hover:scale-105 hover:shadow-red-700/40 transition-all duration-300`}
    >
      <h2 className="text-2xl font-semibold mb-3 text-center">{plan.name}</h2>

      <div className="text-center mb-4">
        <span className="text-4xl font-bold">₹{plan.price}</span>
        <span className="text-gray-400"> for {plan.validity} Days</span>
      </div>

      <button
        disabled={!!currentPlan}
        className={`w-full py-2 mt-2 rounded-lg font-semibold transition-all ${
          currentPlan
            ? "bg-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-800 text-white"
        }`}
        onClick={() => handleSubscribe?.(plan._id, plan.name, plan.price)}
      >
        {currentPlan ? "Current Plan" : `Get ${plan.name}`}
      </button>

      {currentPlan && daysLeft !== undefined && daysLeft < 7 && (
        <button
          className="w-full py-2 mt-2 rounded-lg font-semibold transition-all bg-red-600 hover:bg-red-800 text-white"
          onClick={() => handleRenew?.(plan._id, plan.name, plan.price, daysLeft!)}
        >
          Renew Plan
        </button>
      )}

      <ul className="mt-6 text-sm text-gray-300 space-y-2">
        <li className="flex items-center gap-2">
          <span className="text-green-500">✔</span>
          {plan.noOfMechanics} Mechanics are allowed.
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-500">✔</span>
          {plan.noOfServices} Services are allowed.
        </li>
      </ul>
    </div>
  );
};
