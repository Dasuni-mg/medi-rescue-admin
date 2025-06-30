// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   isAuthenticated: false,
//   permissions: [],
//   token: '',
//   user: {}
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     signIn: (state, action) => {
//       state.isAuthenticated = true;
//       state.permissions = action.payload.permissions;
//       state.token = action.payload.token;
//       state.user = action.payload.user;
//     },
//     signOut: (state) => {
//       state.isAuthenticated = initialState.isAuthenticated;
//       state.permissions = initialState.permissions;
//       state.token = initialState.token;
//       state.user = initialState.user;
//     }
//   }
// });

// export const { signIn, signOut } = authSlice.actions;
// export default authSlice.reducer;
