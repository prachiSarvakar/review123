"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAccountHistory = createAsyncThunk(
  "accounts/fetchAccountHistory",
  async ({ accountId }: { accountId: string }) => {
    if (accountId) {
      const response: any = await apiWithToken.get(`v1/accounts/${accountId}/history`);
      // return response.data.history;
      return { data: response.data.history, status: response.status };
    }
  }
);

export interface accountHistoryState {
  history: IEvent[];
  status: number;
}

interface IDividend {
  description: string;
  quantity: string;
}

interface ITrade {
  commission: number;
  description: string;
  price: number;
  quantity: number;
  symbol: string;
  trade_type: string;
}

export interface IEvent {
  amount: number;
  date: string;
  type: string;
  dividend?: IDividend;
  fees?: IDividend;
  journal?: IDividend;
  trade?: ITrade;
  transfer?: IDividend;
}

const initialState: accountHistoryState = {
  history: [],
  status: 200,
};

export const accountHistorySlice = createSlice({
  name: "accountHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccountHistory.fulfilled, (state, action) => {
      state.history = action.payload?.data?.event;
      state.status = action.payload?.status;
    });
    builder.addCase(fetchAccountHistory.rejected, (state, action: any) => {
      console.log("Server error", action);
      state.history = action.payload?.data?.event || [];
      state.status = action.payload?.status || 401;
    });
  },
});

export const accountHistoryData = (state: any) => state.accountHistory && state.accountHistory.history;
export const accountHistoryDataStatus = (state: any) => state.accountHistory && state.accountHistory.status;

export default accountHistorySlice.reducer;
