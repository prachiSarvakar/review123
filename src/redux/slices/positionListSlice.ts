"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPositionList = createAsyncThunk("users/fetchPositionList", async (accountId: string) => {
  const response: any = await apiWithToken.get(`/v1/accounts/${accountId}/positions`);
  return { data: response.data.positions, status: response.status };
});
export interface positionListState {
  entities: any;
  status: number;
}

const initialState: positionListState = {
  entities: [],
  status: 200,
};

export const positionListSlice = createSlice({
  name: "positionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPositionList.fulfilled, (state, action) => {
      state.entities = action.payload.data;
      state.status = action.payload.status;
    });
    builder.addCase(fetchPositionList.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
      console.log("Server error", action);
    });
  },
});

export const positionList = (state: any) => state.positionList && state.positionList.entities;
export const positionListStatusNum = (state: any) => state.positionList && state.positionList.status;

export default positionListSlice.reducer;
