"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCalendars = createAsyncThunk("users/fetchCalendars", async (symbolArray: string[]) => {
    const response: any = await apiWithToken.get(`beta/markets/fundamentals/calendars?symbols=${symbolArray}&greeks=true`);
    return response.data;
});
export interface calendarsDataState {
    calendars: any;
}

const initialState: calendarsDataState = {
    calendars: [],
};

export const calendarsDataSlice = createSlice({
    name: "calendarsData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCalendars.fulfilled, (state, action) => {
            if (action.payload) {
                if (Array.isArray(action.payload)) {
                    state.calendars = action.payload;
                } else {
                    state.calendars = ([action.payload]);
                }
            }
        });
        builder.addCase(fetchCalendars.rejected, (state, action) => {
            console.log("Server error", action);
        });
    },
});

export const calendarsData = (state: any) => state.calendarsData && state.calendarsData.calendars;

export default calendarsDataSlice.reducer;
