"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const getFormattedData = (data: Record<string, any>) => {
  let values: any = [];
  if (data) {
    if (data?.length > 0) {
      return data;
    } else {
      values.push(data);
    }
  }
  return values;
};
export const fetchWatchlistGraph = createAsyncThunk("users/fetchWatchlistData", async () => {
  const response: any = await apiWithToken.get(`v1/watchlists/default`);
  // return response.data.watchlist;
  const result = getFormattedData(response.data?.watchlist?.items?.item);
  return { data: result, status: response.status };
});
export const removeFromWatchlist = createAsyncThunk("users/removeWatchlistData", async (symbol: string) => {
  const response: any = await apiWithToken.delete(`v1/watchlists/default/symbols/${symbol}`);
  const result = getFormattedData(response.data?.watchlist?.items?.item);
  return { data: result, status: response.status };
});

export const addToWatchlist = createAsyncThunk("users/addWatchlistData", async (symbol: string) => {
  const response: any = await apiWithToken.post(`v1/watchlists/default/symbols`, `symbols=${symbol}`);
  return response.data.watchlist?.items?.item;
});

export interface watchlistState {
  value: number;
  entities: any;
  status: number;
}
const initialState: watchlistState = {
  value: 0,
  entities: [],
  status: 200,
};
export const watchlistDataSlice = createSlice({
  name: "watchlistData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWatchlistGraph.fulfilled, (state, action) => {
      state.entities = action.payload.data;
      state.status = action.payload.status;
    });
    builder.addCase(fetchWatchlistGraph.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
    builder.addCase(removeFromWatchlist.fulfilled, (state, action) => {
      state.entities = action.payload.data;
      state.status = action.payload.status;
    });
    builder.addCase(removeFromWatchlist.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
    builder.addCase(addToWatchlist.fulfilled, (state, action) => {
      state.entities = action.payload;
    });
  },
});
export const watchlistData = (state: any) => state.watchlistData.entities;
export const watchlistDataStatus = (state: any) => state.watchlistData.status;
export default watchlistDataSlice.reducer;