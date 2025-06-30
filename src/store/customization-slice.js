// // project imports

// // action - state management
// import { createSlice } from '@reduxjs/toolkit';

// export const initialState = {
//   isOpen: [], // for active default menu
//   defaultId: 'default',
//   fontFamily: config.fontFamily,
//   borderRadius: config.borderRadius,
//   opened: true
// };

// // ==============================|| CUSTOMIZATION REDUCER ||============================== //

// const CustomizationSlice = createSlice({
//   name: 'customization',
//   initialState: initialState,
//   reducers: {
//     menuOpen: (state, action) => {
//       state.isOpen = [action.payload.id];
//     },
//     setMenu: (state, action) => {
//       state.opened = action.payload.opened;
//     },
//     setFontFamily: (_state, action) => {
//       state.fontFamil = action.payload.fontFamily;
//     },
//     setBorderRadius: (state, action) => {
//       state.borderRadius = action.payload.borderRadius;
//     }
//   }
// });

// export const { menuOpen, setMenu, setFontFamily, setBorderRadius } = CustomizationSlice.actions;
// export default CustomizationSlice.reducer;
