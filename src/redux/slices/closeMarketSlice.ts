"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCloseMarketData = createAsyncThunk("users/fetchCloseMarketData", async () => {
  const response: any = await apiWithToken.get(`v1/markets/clock`);
  return response;
});
export interface closeMarketState {
  value: number;
  entities: any;
}

const initialState: closeMarketState = {
  value: 0,
  entities: [],
};

export const closeMarketGraphDataSlice = createSlice({
  name: "closeMarketGraphData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCloseMarketData.fulfilled, (state, action) => {
      state.entities.push(action.payload);
    });
  },
});

export const closeMarketGraphData = (state: any) => state.closeMarketGraphData.entities;
export default closeMarketGraphDataSlice.reducer;
