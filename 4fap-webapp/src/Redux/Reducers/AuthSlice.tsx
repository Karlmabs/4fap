import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/Types/AuthType";

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
};

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setUserData(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, loginFailed, setUserData } =
  AuthSlice.actions;

export default AuthSlice.reducer;
