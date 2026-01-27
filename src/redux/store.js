import { configureStore } from '@reduxjs/toolkit';
import productSlice from './slices/product';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    product: productSlice,
    auth: authReducer,
  },
});

export default store;
