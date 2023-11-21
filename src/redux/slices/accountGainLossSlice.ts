"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAccountGainLoss = createAsyncThunk(
  "accounts/fetchAccountGainLoss",
  async ({ accountId }: { accountId: string }) => {
    if (accountId) {
      const response: any = await apiWithToken.get(`v1/accounts/${accountId}/gainloss`);
      return { data: response.data.gainloss.closed_position, status: response.status };
    }
  }
);

export interface accountGainLossState {
  gainLoss: IGainLoss[];
  status: number;
}

export interface IGainLoss {
  close_date: string;
  cost: number;
  gain_loss: number;
  gain_loss_percent: number;
  open_date: string;
  proceeds: number;
  quantity: number;
  symbol: string;
  term: number;
}

const initialState: accountGainLossState = {
  gainLoss: [],
  status: 200,
};

export const accountGainLossSlice = createSlice({
  name: "accountGainLoss",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccountGainLoss.fulfilled, (state, action) => {
      state.gainLoss = action.payload?.data || [];
      state.status = action.payload?.status;
    });
    builder.addCase(fetchAccountGainLoss.rejected, (state, action: any) => {
      state.gainLoss = action.payload?.data || [];
      state.status = action.payload?.status || 401;
      console.log("Server error", action);
    });
  },
});

export const accountGainLossData = (state: any) => state.accountGainLoss && state.accountGainLoss.gainLoss;
export const accountGainStatus = (state: any) => state.accountGainLoss && state.accountGainLoss.status;

export default accountGainLossSlice.reducer;
