import { createSlice } from "@reduxjs/toolkit";

export const allStrikesSlice = createSlice({
  name: "allStrikes",
  initialState: {
    strikes: [],
  },
  reducers: {
    setStrikesValue: (state, action) => {
      state.strikes = action.payload;
    },
  },
});

export const allStrikes = (state: any) => state.allStrikes.strikes;
export const { setStrikesValue } = allStrikesSlice.actions;
export default allStrikesSlice.reducer;
