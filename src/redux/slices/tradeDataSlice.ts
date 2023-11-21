"use client";
import { IndexSymbolList } from "@/constants/common";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTradeData = createAsyncThunk("users/fetchTradeData", async (searchKey: string) => {
  let symbol = searchKey;
  let isIndex = false;
  if (Object.keys(IndexSymbolList || {}).includes(searchKey)) {
    isIndex = true;
    symbol += `,${IndexSymbolList[searchKey].symbol}`;
  }
  const response: any = await apiWithToken.get(`v1/markets/quotes?symbols=${symbol}&greeks=true`);
  // return response.data.quotes.quote;
  let data = response?.data?.quotes?.quote || {};
  try {
    if (isIndex) {
      const [index = [], stock = []] = data as any;
      data = {
        ...index,
        last: (stock?.last || 0) * IndexSymbolList[searchKey].value,
        change: ((stock?.change || 0) * IndexSymbolList[searchKey].value).toFixed(2),
        change_percentage: (stock?.change_percentage || 0).toFixed(2),
      };
    }
  } catch (error) {}
  return { data, status: response.status };
});
export interface tradingDataState {
  value: number;
  entities: any;
  status: number;
}

const initialState: tradingDataState = {
  value: 0,
  entities: [],
  status: 200,
};

export const tradeDataSlice = createSlice({
  name: "tradeData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTradeData.fulfilled, (state, action) => {
      state.entities.push(action.payload.data);
      state.status = action.payload.status;
    });
    builder.addCase(fetchTradeData.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
  },
});

export const tradingData = (state: any) => state.tradeData.entities;
export const tradingDataStatusNum = (state: any) => state.tradeData.status;

export default tradeDataSlice.reducer;
