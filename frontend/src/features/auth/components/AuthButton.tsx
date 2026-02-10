interface AuthButtonProps {
  text: string;
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}

const AuthButton = ({ text, action, loading }: AuthButtonProps) => {
  return (
    <button
      onClick={action}
      className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
      disabled={loading}
    >
      {text}
    </button>
  );
};

export default AuthButton;
