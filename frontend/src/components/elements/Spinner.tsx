import React from "react";

interface SpinnerOverlayProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerOverlayProps> = ({ loading }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 ${
        loading
          ? "opacity-100 bg-black/40 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;