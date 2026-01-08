export const StatusBadge = ({
  isBlocked,
  isDeleted,
}: {
  isBlocked: boolean;
  isDeleted: boolean;
}) => {
  if (isDeleted) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
        Deleted
      </span>
    );
  }

  if (isBlocked) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
        Blocked
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
      Active
    </span>
  );
};

