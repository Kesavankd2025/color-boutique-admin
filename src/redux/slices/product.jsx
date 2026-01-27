import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  view: false,
  isEdit: false,
  id: ''
}

const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    handleFormProduct(state, action) {
      const { view, isEdit, id } = action.payload
      state.isEdit = isEdit
      state.view = view
      state.id = id
    }
  },
});

export const {handleFormProduct} = ProductSlice.actions;

export default ProductSlice.reducer;
