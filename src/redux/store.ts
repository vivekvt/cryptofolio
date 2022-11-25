import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  authenticated: false,
  email: "",
  uid: "",
  init: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    addAuth: (state, action) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.authenticated = true;
      state.init = true;
    },
    deleteAuth: () => ({ ...initialState, init: true }),
  },
});

export const { addAuth, deleteAuth } = authSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer },
});
