interface AuthButtonProps {
  text: string;
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AuthButton = ({ text, action }: AuthButtonProps) => {
  return (
    <button
      onClick={action}
      className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
    >
      {text}
    </button>
  );
};

export default AuthButton;
