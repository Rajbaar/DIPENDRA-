import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    featured: [],
    trending: [],
    saleProducts: [],
    categories: [],
    recentlyViewed: [],
    loading: false,
  },
  reducers: {
    setFeatured: (state, action) => { state.featured = action.payload; },
    setTrending: (state, action) => { state.trending = action.payload; },
    setSaleProducts: (state, action) => { state.saleProducts = action.payload; },
    setCategories: (state, action) => { state.categories = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    addRecentlyViewed: (state, action) => {
      const existing = state.recentlyViewed.findIndex(p => p._id === action.payload._id);
      if (existing > -1) state.recentlyViewed.splice(existing, 1);
      state.recentlyViewed.unshift(action.payload);
      if (state.recentlyViewed.length > 10) state.recentlyViewed.pop();
    },
  },
});

export const { setFeatured, setTrending, setSaleProducts, setCategories, setLoading, addRecentlyViewed } = productSlice.actions;
export default productSlice.reducer;
