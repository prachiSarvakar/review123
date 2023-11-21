"use client";
// import { prodTradingApiWithToken, paperTradingApiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfileDetails = createAsyncThunk("users/fetchProfileDetails", async () => {
  const accessToken: any = localStorage.getItem("accessToken");

  const response: any = await axios.get(`https://api.tradier.com/v1/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return { data: response.data, status: response.status };
  // return { data: response.data, status: response.status };
});
export const fetchProfileNickName = createAsyncThunk("users/fetchProfileNickName", async () => {
  const accessToken: any = localStorage.getItem("accessToken");

  const response: any = await axios.get("https://p-be-dash.tradier.com/api/settings", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return { data: response.data, status: response.status };
  // return { data: response.data, status: response.status };
});

export const fetchPaperTradingProfileDetails = createAsyncThunk("users/fetchPaperTradingProfileDetails", async () => {
  try {
    const accessToken: any = localStorage.getItem("accessToken");
    const response: any = await axios.get(`https://p-be-dash.tradier.com/api/virtual/accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (error) {
    return error;
  }

  // return { data: response.data, status: response.status };
});
export interface profileDataState {
  profile: any;
  paperTradingProfile: any;
  status: number;
  tradingProfileSetting: any;
}

const initialState: profileDataState = {
  profile: [],
  paperTradingProfile: [],
  status: 200,
  tradingProfileSetting: null,
};

export const profileSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfileDetails.fulfilled, (state, action) => {
      state.profile = action.payload.data.profile;
      state.status = action.payload.status;
    });
    builder.addCase(fetchProfileDetails.rejected, (state, action: any) => {
      state.profile = action.payload?.data?.profile;
      state.status = action.payload?.status;
    });

    builder.addCase(fetchPaperTradingProfileDetails.fulfilled, (state, action) => {
      state.paperTradingProfile = action?.payload?.data;
      state.status = action.payload.status;
    });
    builder.addCase(fetchPaperTradingProfileDetails.rejected, (state, action: any) => {
      state.paperTradingProfile = action?.payload?.data;
      state.status = action.payload?.status;
    });
    builder.addCase(fetchProfileNickName.fulfilled, (state, action) => {
      state.tradingProfileSetting = action?.payload?.data;
    });
    builder.addCase(fetchProfileNickName.rejected, (state, action) => {
      state.tradingProfileSetting = null;
    });
  },
});

export const profileData = (state: any) => state.profileData;
export const tradingProfileSetting = (state: any) => state.tradingProfileSetting;

export default profileSlice.reducer;
