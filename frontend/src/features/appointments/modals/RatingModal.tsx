import DarkModal from "@/components/modal/DarkModal";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { Star } from "lucide-react";
import React, { useState } from "react";
import { rateAppointmentApi } from "../services/appointmentServices";

interface RatingModalContentProps {
  appointmentId: string;
  onClose: () => void;
  isOpen: boolean;
}

export interface IReview {
  appointmentId: string;
  userId: string;
  garageId: string;
  rating: number;
  review: string;
}

const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

const RatingModal: React.FC<RatingModalContentProps> = ({
  appointmentId,
  onClose,
  isOpen,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeRating = hovered || rating;

  const handleSubmit = async () => {
    if (rating === 0) return;
    try {
      setIsSubmitting(true);
      await rateAppointmentApi({
        appointmentId,
        rating,
        review,
      });
      successToast("Review added success.")
      onClose()
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      <div className="flex flex-col gap-6">
        {/* Stars */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[#aaa] text-sm">
            How would you rate this service?
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={36}
                  className={`transition-colors duration-150 ${
                    star <= activeRating
                      ? "fill-[#f59e0b] text-[#f59e0b]"
                      : "fill-transparent text-[#3a3a3a]"
                  }`}
                />
              </button>
            ))}
          </div>
          {/* Rating Label */}
          <p
            className={`text-sm font-medium transition-opacity duration-200 ${
              activeRating ? "opacity-100 text-[#f59e0b]" : "opacity-0"
            }`}
          >
            {activeRating ? LABELS[activeRating - 1] : "—"}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2a2a2a]" />

        {/* Review Text Area */}
        <div className="flex flex-col gap-2">
          <label className="text-[#ccc] text-sm font-medium">
            Write a review{" "}
            <span className="text-[#555] font-normal">(optional)</span>
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this service..."
            rows={4}
            maxLength={500}
            className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#ef4444] focus:outline-none rounded-lg px-4 py-3 text-[#ddd] text-sm placeholder-[#444] resize-none transition-colors"
          />
          <p className="text-[#444] text-xs text-right">
            {review.length} / 500
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              rating === 0 || isSubmitting
                ? "bg-[#7f1d1d] text-[#f87171] cursor-not-allowed opacity-60"
                : "bg-[#ef4444] hover:bg-[#dc2626] text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </DarkModal>
  );
};

export default RatingModal;
