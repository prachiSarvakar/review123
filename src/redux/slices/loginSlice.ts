"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLoginApi = createAsyncThunk("users/fetchLoginApi", async (codes: any) => {
  if (codes) {
    const response: any = await axios.post(
      `https://x7czl7xilapoo3ibjlul7doo6e0wlxgk.lambda-url.us-east-1.on.aws?code=${codes}&env=${process.env.ENVIRONMENT_LOCALHOST}`
    );
    return response;
  }
});
export interface loginState {
  entities: any;
  loading: boolean;
}

const initialState: loginState = {
  entities: {},
  loading: false,
};

export const loginSlice = createSlice({
  name: "loginData",
  initialState,
  reducers: {
    clear: (state) => {
      state.entities = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLoginApi.fulfilled, (state, action) => {
      state.entities = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchLoginApi.rejected, (state, action) => {
      console.log("Server error", action);
    });
    builder.addCase(fetchLoginApi.pending, (state, action) => {
      state.entities = {};
      state.loading = true;
    });
  },
});

export const loginDatas = (state: any) => state.loginData && state.loginData.entities;
export const { clear } = loginSlice.actions;
export default loginSlice.reducer;
