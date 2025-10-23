import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "../../types/UserTypes";

interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role?: Role;
  isBlocked: boolean;
  isVerified: boolean;
  isOnboardingRequired: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface LoginPayload {
  user: User;
  token: string;
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
        isVerified: user.isVerified,
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
      state.token = action.payload.newAccessToken;
    }
  },
});

export const { login, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
