import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [],
  coupon: null,
  discount: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1, size, color } = action.payload;
      const key = `${product._id}-${size || ''}-${color || ''}`;
      const existing = state.items.find(i => i.key === key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          key,
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || '',
          quantity,
          size,
          color,
          slug: product.slug,
          stock: product.stock,
        });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.key !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const item = state.items.find(i => i.key === key);
      if (item) item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
      localStorage.setItem('cart', JSON.stringify([]));
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload.coupon;
      state.discount = action.payload.discount;
    },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    setCartOpen: (state, action) => { state.isOpen = action.payload; },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setCoupon, toggleCart, setCartOpen } = cartSlice.actions;
export const selectCartTotal = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export default cartSlice.reducer;
