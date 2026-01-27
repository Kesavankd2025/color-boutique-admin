import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; 
import brandSlice from "./slices/brandSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    brandSlice:brandSlice
  },
});

export default store;
