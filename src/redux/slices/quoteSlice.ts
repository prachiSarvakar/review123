"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchQuotesData = createAsyncThunk("users/fetchQuotesData", async (symbolArray: string[]) => {
  const response: any = await apiWithToken.get(`v1/markets/quotes?symbols=${symbolArray}&greeks=true`);
  return response.data.quotes.quote;
  // return { data: response.data.quotes.quote, status: response.status };
});
export interface quoteDataState {
  quotes: any;
  // status: number;
}

const initialState: quoteDataState = {
  quotes: [],
  // status: 200,
};

export const quotesDataSlice = createSlice({
  name: "quotesData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuotesData.fulfilled, (state, action) => {
      if (action.payload) {
        if (Array.isArray(action.payload)) {
          // Create a set to store unique symbols from the incoming payload
          const uniqueSymbols = new Set(action.payload.map((quote) => quote.symbol));

          // Filter out existing objects with the same symbol property
          const updatedQuotes = state.quotes.filter(
            (quote) => !uniqueSymbols.has(quote.symbol)
          );

          // Concatenate the updatedQuotes array with the new payload
          const finalQuotes = updatedQuotes.concat(action.payload);

          // Update the state with the finalQuotes array
          state.quotes = finalQuotes;
        } else {
          // Handle the case where action.payload is not an array (assuming it's an object)
          // You can decide how to handle this based on your application logic
          state.quotes.push(action.payload);
        }
      }
    });
    builder.addCase(fetchQuotesData.rejected, (state, action) => {
      console.log("Server error", action);
    });
  },
});

export const quotesData = (state: any) => state.quotesData && state.quotesData.quotes;
// export const quotesDataStatusNum = (state: any) => state.quotesData && state.quotesData.status;

export default quotesDataSlice.reducer;
