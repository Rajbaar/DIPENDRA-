import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : true,
    loading: false,
    searchOpen: false,
    mobileMenu: false,
    compareList: [],
    activeModal: null,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    setSearchOpen: (state, action) => { state.searchOpen = action.payload; },
    toggleMobileMenu: (state) => { state.mobileMenu = !state.mobileMenu; },
    setMobileMenu: (state, action) => { state.mobileMenu = action.payload; },
    addToCompare: (state, action) => {
      if (!state.compareList.find(p => p._id === action.payload._id)) {
        state.compareList.push(action.payload);
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter(p => p._id !== action.payload);
    },
    clearCompare: (state) => { state.compareList = []; },
    setActiveModal: (state, action) => { state.activeModal = action.payload; },
  },
});

export const { toggleDarkMode, setDarkMode, setLoading, toggleSearch, setSearchOpen, toggleMobileMenu, setMobileMenu, addToCompare, removeFromCompare, clearCompare, setActiveModal } = uiSlice.actions;
export default uiSlice.reducer;
