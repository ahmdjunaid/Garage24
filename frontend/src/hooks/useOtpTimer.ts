import { useEffect, useState } from "react";

export const useOtpTimer = (initialSeconds: number, active: boolean) => {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (!active) return;
    setSeconds(initialSeconds);

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [active, initialSeconds]);

  const resetTimer = () => setSeconds(initialSeconds);

  return { seconds, resetTimer };
};
