"use client";
import { createSlice } from "@reduxjs/toolkit";
import { Strategy } from "@/utils/strategy";
export interface AllStrategiesDataState {
  strategies: Strategy[];
  previousStrategy?: Strategy[];
}

const initialState: AllStrategiesDataState = {
  strategies: [],
  previousStrategy: [],
};

export const allStrategiesSlice = createSlice({
  name: "allStrategiesData",
  initialState,
  reducers: {
    setStrategyData: (state, action) => {
      state.previousStrategy = state.strategies;
      state.strategies = action.payload;
    },
  },
});

export const AllStrategiesData = (state: any) => state.allStrategiesData.strategies;
export const PreviousStrategy = (state: any) => state.allStrategiesData.previousStrategy; // Selector to access the previous strategy
export const { setStrategyData } = allStrategiesSlice.actions;
export default allStrategiesSlice.reducer;
