import React, { useEffect, useState } from "react";
import { fetchGarageByIdApi, garageApprovalApi } from "../../services/adminServices";
import Spinner from "../elements/Spinner";
import { errorToast, successToast } from "../../utils/notificationAudio";
import { ConfirmModal } from "./ConfirmModal";
import type { ApprovalPayload } from "../../types/GarageTypes";

interface GarageDetailsSectionProps {
  garageId: string | null;
  onBack: () => void;
}

interface GarageData {
  _id: string;
  name: string;
  mobileNumber: string;
  startTime: string;
  endTime: string;
  address: {
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  location: {
    coordinates: [number, number];
    type: string;
  };
  approvalStatus: string;
  isApproved: boolean;
  isRSAEnabled: boolean;
  imageUrl: string;
  docUrl: string;
  selectedHolidays: string[];
  plan: {
    name: string;
    price: number;
    validity: number;
    noOfMechanics: number;
    noOfServices: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

const GarageDetailsSection: React.FC<GarageDetailsSectionProps> = ({
  garageId,
  onBack,
}) => {
  const [garage, setGarage] = useState<GarageData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [approval, setApproval] = useState<ApprovalPayload | null>(null);

  useEffect(() => {
    const fetchGarage = async () => {
      if (!garageId) return;
      try {
        setLoading(true);
        const res = await fetchGarageByIdApi(garageId);
        setGarage(res.garage);
      } catch (error) {
        console.error("Error fetching garage details:", error);
        errorToast("Details not found!");
        onBack();
      } finally {
        setLoading(false);
      }
    };

    fetchGarage();
  }, [garageId, onBack]);

  const handleApproval = async () => {
    if (!approval) return;
    try {
      setLoading(true);
      await garageApprovalApi(approval.id, approval.action);
      setGarage((prev) => {
        if (!prev) return prev;
        return { ...prev, approvalStatus: approval.action };
      });
      successToast(
        approval.action === "approved" ? "Garage Approved" : "Garage Rejected"
      );

      setApproval(null);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner loading={loading} />;
  if (!garage) return null;

  const plan = garage.plan?.[0];

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          {garage.name?.toUpperCase()}
        </h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
        >
          ← Back
        </button>
      </div>

      {/* Details Section */}
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-gray-900 to-gray-950 rounded-2xl p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Info */}
          <div className="space-y-3 text-base leading-relaxed">
            <p>
              <strong>Mobile:</strong> {garage.mobileNumber}
            </p>
            <p>
              <strong>RSA Service:</strong> {garage.isRSAEnabled ? "Yes" : "No"}
            </p>
            <p>
              <strong>Working Hours:</strong> {garage.startTime} -{" "}
              {garage.endTime}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  garage.approvalStatus === "approved"
                    ? "text-green-500"
                    : garage.approvalStatus === "rejected"
                      ? "text-red-500"
                      : "text-yellow-400"
                }`}
              >
                {garage.approvalStatus.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Location:</strong> {garage.address?.city},{" "}
              {garage.address?.district}, {garage.address?.state} -{" "}
              {garage.address?.pincode}
            </p>
            {garage.selectedHolidays?.length > 0 && (
              <p>
                <strong>Holidays:</strong> {garage.selectedHolidays.join(", ")}
              </p>
            )}
            <p>
              <strong>Created On:</strong>{" "}
              {new Date(garage.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(garage.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Plan Details */}
          <div className="bg-gray-800 p-5 rounded-xl h-fit">
            <h3 className="font-semibold mb-3 text-lg">Plan Details</h3>
            {plan ? (
              <>
                <p>
                  <strong>Plan Name:</strong> {plan.name}
                </p>
                <p>
                  <strong>Price:</strong> ₹{plan.price}
                </p>
                <p>
                  <strong>Validity:</strong> {plan.validity} Days
                </p>
                <p>
                  <strong>Mechanics Allowed:</strong> {plan.noOfMechanics}
                </p>
                <p>
                  <strong>Services Allowed:</strong> {plan.noOfServices}
                </p>
              </>
            ) : (
              <p className="text-gray-400 italic">No active plan found.</p>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div>
            <h3 className="font-semibold mb-3 text-lg">Garage Image</h3>
            <img
              src={garage.imageUrl}
              alt="Garage"
              className="rounded-xl w-full h-72 object-cover border border-gray-700 cursor-pointer hover:opacity-90 transition"
              onClick={() => setPreviewImage(garage.imageUrl)}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-lg">Document</h3>
            {garage.docUrl.endsWith(".pdf") ? (
              <iframe
                src={garage.docUrl}
                title="Garage Document"
                className="rounded-xl w-full h-72 border border-gray-700"
              />
            ) : (
              <img
                src={garage.docUrl}
                alt="Garage Document"
                className="rounded-xl w-full h-72 object-cover border border-gray-700 cursor-pointer hover:opacity-90 transition"
                onClick={() => setPreviewImage(garage.docUrl)}
              />
            )}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <strong>Coordinates:</strong>{" "}
          {garage.location?.coordinates?.[0].toFixed(5)},{" "}
          {garage.location?.coordinates?.[1].toFixed(5)}
        </div>
        {garage.approvalStatus === "pending" ? (
          <div className="flex justify-end">
            <button
              onClick={() =>
                setApproval({
                  id: garageId!,
                  name: garage.name,
                  action: "rejected",
                })
              }
              className="px-4 py-2 me-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
            >
              Reject
            </button>
            <button
              onClick={() =>
                setApproval({
                  id: garageId!,
                  name: garage.name,
                  action: "approved",
                })
              }
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition"
            >
              Approve
            </button>
          </div>
        ) : (
          ""
        )}
      </div>

      <ConfirmModal
        isOpen={!!approval}
        message={`Are you sure want ${approval?.action} ${approval?.name}`}
        onClose={() => setApproval(null)}
        onConfirm={() => handleApproval()}
        onCancel={() => setApproval(null)}
      />

      {/* Fullscreen Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 cursor-pointer"
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-5xl max-h-[90vh] rounded-lg border border-gray-600 shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default GarageDetailsSection;
