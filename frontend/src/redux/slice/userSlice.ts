import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/UserTypes";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface LoginPayload {
  user: User;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { user, token } = action.payload;

      state.user = {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        isDeleted: user.isDeleted,
        isOnboardingRequired: user.isOnboardingRequired
      };
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setAccessToken: (state, action) => {
      state.token = action.payload;
    }
  },
});

export const { login, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
