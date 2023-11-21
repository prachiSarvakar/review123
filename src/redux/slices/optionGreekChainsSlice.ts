"use client";
import { WeeklyIndexSymbolList } from "@/constants/common";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOptionGreekChains = createAsyncThunk(
  "users/fetchOptionGreekChains",
  async ({ searchKey, expiration }: { searchKey: string; expiration: any }) => {
    if (searchKey) {
      if (WeeklyIndexSymbolList[searchKey]) {
        searchKey = WeeklyIndexSymbolList[searchKey];
      }
      const response: any = await apiWithToken.get(
        `v1/markets/options/chains?symbol=${searchKey}&expiration=${expiration}&greeks=true`
      );
      // return response.data.options.option;
      return { data: response.data.options.option, status: response.status, expiration: expiration };
    }
  }
);

export interface optionGreekChainsState {
  entities: any;
  status: number;
}

const initialState: optionGreekChainsState = {
  entities: [],
  status: 200,
};

export const optionGreekChainsSlice = createSlice({
  name: "optionGreekChains",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOptionGreekChains.fulfilled, (state, action) => {
      const expirationDate = action.payload?.expiration; // Assuming expiration is a valid date string

      // Find the index of an object with the same expiration in the entities array
      const existingIndex = state.entities.findIndex((item) => item.hasOwnProperty(expirationDate));

      if (existingIndex !== -1) {
        // If an object with the same expiration exists, replace it
        state.entities[existingIndex][expirationDate] = action.payload?.data;
      } else {
        // If no object with the same expiration exists, add it to the array
        const newObj = { [expirationDate]: action.payload?.data };
        state.entities.push(newObj);
      }
      state.status = action.payload?.status;
    });

    builder.addCase(fetchOptionGreekChains.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
  },
});

export const optionGreekChainsData = (state: any) => state.optionGreekChains && state.optionGreekChains.entities;
export const optionGreekChainsStatus = (state: any) => state.optionGreekChains && state.optionGreekChains.status;

export default optionGreekChainsSlice.reducer;
