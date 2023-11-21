"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { AxiosRequestConfig } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTimesales = createAsyncThunk("users/fetchTimesalesData", async (symbol: string) => {
  const config: AxiosRequestConfig = {
    params: {
      symbol: symbol,
      interval: "1min",
    },
  };
  const response: any = await apiWithToken.get(`/v1/markets/timesales`, config);
  return { symbol, data: response.data, status: response.status };
});

export interface timeSalesState {
  entities: any;
  status: number;
}

const initialState: timeSalesState = {
  entities: [],
  status: 200,
};

export const timeSalesRducer = createSlice({
  name: "timeSales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTimesales.fulfilled, (state, action) => {
      state.entities.push(action.payload);
      state.status = action.payload.status;
    });
    builder.addCase(fetchTimesales.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
  },
});

export const timeSales = (state: any) => state.timeSales.entities;
export const timeSaleStatusNum = (state: any) => state.timeSales.status;

export default timeSalesRducer.reducer;
