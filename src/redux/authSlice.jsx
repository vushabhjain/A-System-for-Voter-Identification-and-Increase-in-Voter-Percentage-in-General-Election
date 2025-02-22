import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: (() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  })(),
  admin: (() => {
    try {
      const storedAdmin = localStorage.getItem("admin");
      return storedAdmin && storedAdmin !== "undefined" ? JSON.parse(storedAdmin) : null;
    } catch (error) {
      console.error("Error parsing admin data:", error);
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;

      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }

      if (action.payload.admin) {
        state.admin = action.payload.admin;
        localStorage.setItem("admin", JSON.stringify(action.payload.admin));
      }

      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.admin = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;