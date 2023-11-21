"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchDividends = createAsyncThunk("users/fetchDividends", async (symbolArray: string[]) => {
    const response: any = await apiWithToken.get(`beta/markets/fundamentals/dividends?symbols=${symbolArray}&greeks=true`);
    return response.data;
});
export interface dividendsDataState {
    dividends: any;
}

const initialState: dividendsDataState = {
    dividends: [],
};

export const dividendsDataSlice = createSlice({
    name: "dividendsData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDividends.fulfilled, (state, action) => {
            if (action.payload) {
                if (Array.isArray(action.payload)) {
                    state.dividends = action.payload;
                } else {
                    state.dividends = ([action.payload]);
                }
            }
        });
        builder.addCase(fetchDividends.rejected, (state, action) => {
            console.log("Server error", action);
        });
    },
});

export const dividendsData = (state: any) => state.dividendsData && state.dividendsData.dividends;

export default dividendsDataSlice.reducer;
