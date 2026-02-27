import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  unreadCounts: Record<string, number>;
  totalUnread: number;
}

const initialState: ChatState = {
  unreadCounts: {},
  totalUnread: 0,
};

const chatSlice = createSlice({
  initialState,
  name: "chat",
  reducers: {
    setUnreadCounts: (state, action) => {
      state.unreadCounts = action.payload.appointments;
      state.totalUnread = action.payload.total;
    },

    incrementUnread: (state, action) => {
      const id = action.payload;

      state.unreadCounts[id] = (state.unreadCounts[id] || 0) + 1;

      state.totalUnread += 1;
    },

    clearUnread: (state, action) => {
      const id = action.payload;

      state.totalUnread -= state.unreadCounts[id] || 0;
      state.unreadCounts[id] = 0;
    },
  },
});

export const { setUnreadCounts, incrementUnread, clearUnread } =
  chatSlice.actions;
export default chatSlice.reducer;