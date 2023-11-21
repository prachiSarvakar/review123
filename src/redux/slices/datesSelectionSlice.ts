"use client";
import { createSlice } from "@reduxjs/toolkit";
export interface datesSelection {
  date: string;
  prevDate: string;
}

const initialState: datesSelection = {
  date: "",
  prevDate: "",
};

export const datesSelectedSlice = createSlice({
  name: "datesSelected",
  initialState,
  reducers: {
    setDatesSelection: (state, action) => {
      state.prevDate = state.date;
      state.date = action.payload;
    },
  },
});

export const datesSelected = (state: any) => state.datesSelected.date;
export const prevDateSelector = (state: any) => state.datesSelected.prevDate;
export const { setDatesSelection } = datesSelectedSlice.actions;
export default datesSelectedSlice.reducer;
