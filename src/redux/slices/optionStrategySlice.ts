"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOptionStrategySelection = createAsyncThunk(
  "users/fetchOptionStrategySelection",
  async (searchKey: string) => {
    if (searchKey) {
      const response: any = await apiWithToken.get(`/v1/markets/options/expirations?symbol=${searchKey}`);

      // return response.data.expirations;
      return { data: response.data.expirations, status: response.status };
    }
  }
);

export interface optionState {
  entities: any;
  status: number;
}

const initialState: optionState = {
  entities: [],
  status: 200,
};

export const optionStrategySlice = createSlice({
  name: "optionStrategySelection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOptionStrategySelection.fulfilled, (state, action) => {
      state.entities = action.payload.data;
      state.status = action.payload.status;
    });
    builder.addCase(fetchOptionStrategySelection.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
  },
});

export const optionStrategiSelectionData = (state: any) =>
  state.optionStrategySelection && state.optionStrategySelection.entities;
export const optionSelectionStatusCheck = (state: any) =>
  state.optionStrategySelection && state.optionStrategySelection.status;

export default optionStrategySlice.reducer;
