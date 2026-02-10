import { useState } from "react";
import DarkModal from "./DarkModal";

interface ConfirmModalProps {
  title?: string;
  message: string | null;
  onConfirm: (reason:string) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  onClose: () => void;
  isReasonRequired?:boolean
}

export const ConfirmModal = ({
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  isOpen,
  onClose,
  isReasonRequired = false
}: ConfirmModalProps) => {

  const [reason, setReason] = useState<string>("")

  if (!isOpen) return null;

  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      {title && <h2 className="text-center text-white/50 font-bold mb-3 mt-6">{title}</h2>}
      <p className="text-gray-700 dark:text-gray-300 mb-3">{message}</p>
      {isReasonRequired &&
      <>
        <label className="text-gray-700 dark:text-gray-300">Reason of Rejection: </label>
        <textarea 
          className="text-white/50 mb-3 mt-2 bg-[#1c1c1c] border border-transparent focus:border-red-600 focus:outline-none transition w-full rounded-md" 
          onChange={(e)=>setReason(e.target.value)}
          ></textarea>
        </>
      }
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            onCancel?.();
            onClose();
          }}
          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-100"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm(reason);
            onClose();
          }}
          className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          {confirmText}
        </button>
      </div>
    </DarkModal>
  );
};
