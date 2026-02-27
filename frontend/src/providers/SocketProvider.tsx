import { getUnreadCountApi } from "@/components/services/chatServices";
import { getNotificationByUserIdApi } from "@/components/services/notificationServices";
import { socket } from "@/lib/socket";
import { incrementUnread, setUnreadCounts } from "@/redux/slice/chatSlice";
import {
  addNotification,
  setNotifications,
  type NotificationType,
} from "@/redux/slice/notificationSlice";
import type { RootState } from "@/redux/store/store";
import { errorToast, successToast } from "@/utils/notificationAudio";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const fetchNotifications = useCallback(async () => {
    try {
      const notifications = await getNotificationByUserIdApi();
      dispatch(setNotifications(notifications));
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  }, [dispatch]);

  const fetchMessageUnreadCount = useCallback(async () => {
    try {
      const unreadCount = await getUnreadCountApi();
      dispatch(setUnreadCounts(unreadCount));
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join", user._id);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
      fetchMessageUnreadCount();
    }
  }, [user, fetchNotifications, fetchMessageUnreadCount]);

  useEffect(() => {
    const handleNotification = ({
      appointmentId,
    }: {
      appointmentId: string;
    }) => {
      dispatch(incrementUnread(appointmentId));
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, []);

  useEffect(() => {
    const handler = (data: NotificationType) => {
      dispatch(addNotification(data));
      successToast(data.message);
    };

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default SocketProvider;
