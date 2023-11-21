"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getFormattedData = (data: Record<string, any>) => {
  let values: any = [];
  if (data) {
    if (data.security?.length > 0) {
      return data.security;
    } else {
      values.push(data.security);
    }
  }
  return values;
};

// Create an AbortController instance
let abortController = new AbortController();

export const fetchSearchApi = createAsyncThunk("users/fetchSearchApi", async (searchKey: string, { signal }) => {
  // Before making the request, check if there's an existing request and cancel it.
  if (abortController) {
    abortController.abort();
  }

  // Create a new AbortController for this request
  abortController = new AbortController();

  try {
    if (searchKey) {
      const response: any = await apiWithToken.get(`/v1/markets/search?q=${searchKey}`, {
        signal: abortController.signal,
      });
      const lookUpResponse: any = await apiWithToken.get(`v1/markets/lookup?q=${searchKey}`, {
        signal: abortController.signal,
      });
      const searchData = getFormattedData(response.data.securities);
      const lookUpData = getFormattedData(lookUpResponse.data.securities);

      const searchResponse = [...lookUpData, ...searchData];
      searchResponse.sort((a, b) => {
        const aLower = a.symbol.toLowerCase();
        const bLower = b.symbol.toLowerCase();
        const searchKeyLower = searchKey.toLowerCase();

        if (aLower === searchKeyLower && bLower !== searchKeyLower) {
          return -1;
        } else if (aLower !== searchKeyLower && bLower === searchKeyLower) {
          return 1;
        } else {
          return 0;
        }
      });

      return searchResponse;
    }
    return [];
  } catch (error) {
    // Handle the cancellation error or other errors as needed
    if (error.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      // Handle other errors
      throw error;
    }
  }
});

export interface CounterState {
  value: number;
  entities: any;
  data: any;
}

const initialState: CounterState = {
  value: 0,
  entities: [],
  data: [],
};

export const recentSearchSlice = createSlice({
  name: "searchStock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSearchApi.fulfilled, (state, action) => {
      state.entities = action.payload;
    });
  },
});

export const searchData = (state: any) => state.searchStock.entities;

export default recentSearchSlice.reducer;
