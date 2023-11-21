"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCashFlowApi = createAsyncThunk("users/fetchCashFlowApi", async () => {
  const response: any = await axios.get(
    `${process.env.API_BENZINGA_URL}/v1/signal/option_activity?&token=c7f8477e9fc2427eab3039ccdcbfc4f8`
  );
  return response?.data?.option_activity;
});
export interface loginState {
  entities: any;
  loading: boolean;
}

const initialState: loginState = {
  entities: {},
  loading: false,
};

export const cashFlowSlice = createSlice({
  name: "cashFlowData",
  initialState,
  reducers: {
    clear: (state) => {
      state.entities = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCashFlowApi.fulfilled, (state, action) => {
      state.entities = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCashFlowApi.rejected, (state, action) => {
      console.log("Server error", action);
    });
    builder.addCase(fetchCashFlowApi.pending, (state, action) => {
      state.entities = {};
      state.loading = true;
    });
  },
});

export const cashFlowDataToShow = (state: any) => state.cashFlowData && state.cashFlowData.entities;
export const { clear } = cashFlowSlice.actions;
export default cashFlowSlice.reducer;
