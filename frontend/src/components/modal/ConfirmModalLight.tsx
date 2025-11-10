import Modal from "../layouts/Modal";

interface ConfirmModalProps {
  title?: string;
  message: string | null;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmModalLight = ({
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  isOpen,
  onClose,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      {title && <h2 className="text-center text-black/50 font-bold mb-3 mt-6">{title}</h2>}
      <p className="text-gray-700 dark:text-gray-600 mb-6">{message}</p>
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
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
