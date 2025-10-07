import React from "react";

interface SpinnerOverlayProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerOverlayProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
