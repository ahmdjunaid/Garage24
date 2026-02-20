import { createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface NotificationType {
  _id: string;
  recipientId: string;
  title: string;
  message: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: NotificationType[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notifications.unshift(action.payload);
    },
    setNotifications: (state, action: PayloadAction<NotificationType[]>) => {
      state.notifications = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n._id === action.payload);
      if (notif) notif.isRead = true;
    },
    markAllAsRead: (state) => {
        state.notifications.map((notif) => notif.isRead = true)
    }
  },
});

export const { addNotification, setNotifications, markAsRead, markAllAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
