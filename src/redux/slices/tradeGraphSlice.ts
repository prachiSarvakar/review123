"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IGraphPayload {
  searchKey: string | null;
  start: string;
  end: string;
}
export const fetchTradeDataofGraph = createAsyncThunk(
  "users/fetchTradeGraphData",
  async ({ searchKey, start, end }: IGraphPayload) => {
    const response: any = await apiWithToken.get(
      `v1/markets/timesales?symbol=${searchKey}&interval=15min&start=${start}&end=${end}&session_filter=open`
    );
    // return response.data.series.data;
    return { data: response.data.series.data, status: response.status };
  }
);
export interface tradingDataGraphState {
  value: number;
  entities: any;
  loading: boolean;
  status: number;
}

const initialState: tradingDataGraphState = {
  value: 0,
  entities: [],
  loading: false,
  status: 200,
};

export const tradeGraphDataSlice = createSlice({
  name: "tradeGraphData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTradeDataofGraph.pending, (state, action) => {
      state.entities = [];
      state.loading = true;
    });
    builder.addCase(fetchTradeDataofGraph.fulfilled, (state, action) => {
      state.entities = [];
      state.entities.push(action.payload.data);
      state.loading = false;
      state.status = action.payload.status;
    });
    builder.addCase(fetchTradeDataofGraph.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.loading = false;
      state.status = action.payload?.status || 401;
    });
  },
});

export const tradingGraphData = (state: any) => state.tradeGraphData.entities;
export const loadingGraphData = (state: any) => state.tradeGraphData.loading;
export const statusNumberGraphData = (state: any) => state.tradeGraphData.status;

export default tradeGraphDataSlice.reducer;
