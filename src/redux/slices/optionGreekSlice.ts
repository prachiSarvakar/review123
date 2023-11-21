"use client";
import { WeeklyIndexSymbolList } from "@/constants/common";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOptionGreek = createAsyncThunk(
  "users/fetchOptionGreek",
  async ({ searchKey, expiration }: { searchKey: string; expiration: any }) => {
    if (searchKey) {
      if (WeeklyIndexSymbolList[searchKey]) {
        searchKey = WeeklyIndexSymbolList[searchKey];
      }
      const response: any = await apiWithToken.get(
        `v1/markets/options/chains?symbol=${searchKey}&expiration=${expiration}&greeks=true`
      );
      // return response.data.options.option;
      return { data: response.data.options.option, status: response.status };
    }
  }
);

export interface optionGreekState {
  entities: any;
  status: number;
}

const initialState: optionGreekState = {
  entities: [],
  status: 200,
};

export const optionGreekSlice = createSlice({
  name: "optionGreek",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOptionGreek.fulfilled, (state, action) => {
      state.entities = action.payload.data;
      state.status = action.payload.status;
    });
    builder.addCase(fetchOptionGreek.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
  },
});

export const optionGreekData = (state: any) => state.optionGreek && state.optionGreek.entities;
export const optionGreekStatus = (state: any) => state.optionGreek && state.optionGreek.status;

export default optionGreekSlice.reducer;
