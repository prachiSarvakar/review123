"use client";
import { createSlice } from "@reduxjs/toolkit";
import { Strategy } from "@/utils/strategy";
export interface AllDatesIndexesState {
  indexes: number;
}

const initialState: AllDatesIndexesState = {
  indexes: 0,
};

export const allDatesIndexesSlice = createSlice({
  name: "allDatesIndexes",
  initialState,
  reducers: {
    setDatesIndexes: (state, action) => {
      state.indexes = action.payload;
    },
  },
});

export const allDatesIndexes = (state: any) => state.allDatesIndexes.indexes;
export const { setDatesIndexes } = allDatesIndexesSlice.actions;
export default allDatesIndexesSlice.reducer;
