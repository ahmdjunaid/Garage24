import { socket } from "@/lib/socket";
import { addNotification } from "@/redux/slice/notificationSlice";
import type { RootState } from "@/redux/store/store";
import { successToast } from "@/utils/notificationAudio";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id && !socket.connected) {
      socket.connect();
      socket.emit("join", user._id);
    }
  }, [user]);

  useEffect(() => {
    socket.on("notification", (data) => {
      dispatch(addNotification(data))
      successToast(data.message)
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return children;
};

export default SocketProvider;
