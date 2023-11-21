"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBalanceDetails = createAsyncThunk("users/fetchBalanceDetails", async (accountId: string) => {
  const response: any = await apiWithToken.get(`/v1/accounts/${accountId}/balances`);
  // return response.data.balances;
  return { data: response.data.balances, status: response.status, selectedAccountId: accountId };
});
export interface balanceDataState {
  balances: any;
  status: number;
  selectedAccountId: string;
}

const initialState: balanceDataState = {
  balances: [],
  status: 200,
  selectedAccountId: ''
};

export const balanceSlice = createSlice({
  name: "balancesData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBalanceDetails.fulfilled, (state, action) => {
      state.balances = action.payload.data;
      state.status = action.payload.status;
      state.selectedAccountId = action.payload.selectedAccountId;
    });
    builder.addCase(fetchBalanceDetails.rejected, (state, action: any) => {
      state.balances = action.payload?.data || [];
      state.status = action.payload?.status || 401;
      console.log("Server error", action);
    });
  },
});

export const balancesData = (state: any) => state.balancesData;
export const statusCheck = (state: any) => state.balancesData.status;
export default balanceSlice.reducer;
