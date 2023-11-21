"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPlaceOrder = createAsyncThunk(
  "users/fetchPlaceOrder",
  async (
    {
      type,
      side,
      duration,
      account_id,
      symbol,
      quantity,
      classType,
      price,
      stop,
      option_symbol,
      orders,
      preview,
    }: {
      type: string;
      side: string;
      duration: string;
      account_id: string;
      symbol: string;
      quantity: number;
      classType: string;
      price?: string;
      stop?: string;
      option_symbol?: string;
      orders?: any;
      preview?: boolean;
    },
    { rejectWithValue }
  ) => {
    if (type) {
      let getApiEndpoint = `v1/accounts/${account_id}/orders?account_id=${account_id}&class=${classType}&type=${type}&symbol=${symbol}&duration=${duration}`;
      if (preview) {
        getApiEndpoint += "&preview=true";
      }
      if (classType === "multileg" && (type === "debit" || type === "credit" || type === "even" || type === "market")) {
        if (type === "debit" || (type === "credit" && price !== undefined)) {
          getApiEndpoint += `&price=${price}`;
        }
        if (orders.length > 1) {
          orders.forEach((leg, index) => {
            getApiEndpoint += `&quantity[${index}]=${leg.quantity}&side[${index}]=${leg.side}&option_symbol[${index}]=${leg.option_symbol}`;
          });
        } else {
          getApiEndpoint += `&quantity=${orders?.[0]?.quantity || 1}&side=${orders?.[0]
            ?.side}&option_symbol=${orders?.[0]?.option_symbol}`;
        }
      } else if (
        (classType === "equity" || classType === "option") &&
        (type === "limit" || type === "stop" || type === "stop_limit" || type === "market")
      ) {
        if (type === "limit" && price !== undefined) {
          getApiEndpoint += `&price=${price}`;
        } else if (type === "stop" && stop !== undefined) {
          getApiEndpoint += `&stop=${stop}`;
        } else if (type === "stop_limit" && price !== undefined && stop !== undefined) {
          getApiEndpoint += `&price=${price}&stop=${stop}`;
        }

        if (classType === "option" && option_symbol !== undefined) {
          getApiEndpoint += `&quantity=${quantity}&side=${side}&option_symbol=${option_symbol}`;
        } else if (classType === "equity") {
          getApiEndpoint += `&quantity=${quantity}&side=${side}`;
        }
      } else if (
        classType === "combo" &&
        (type === "debit" || type === "credit" || type === "even" || type === "market")
      ) {
        if (type === "debit" || (type === "credit" && price !== undefined)) {
          getApiEndpoint += `&price=${price}`;
        }
        getApiEndpoint += `&quantity[0]=${quantity}&side[0]=${side}`;
        orders.forEach((leg, index) => {
          getApiEndpoint += `&quantity[${index + 1}]=${leg.quantity}&side[${index + 1}]=${leg.side}&option_symbol[${
            index + 1
          }]=${leg.option_symbol}`;
        });
      }

      try {
        const response: any = await apiWithToken.post(getApiEndpoint);
        // return response.data;
        return { data: response?.data, status: response?.status };
      } catch (error) {
        throw error?.response?.data;
      }
    }
  }
);
export const fetchPlaceOrderNew = createAsyncThunk(
  "users/fetchPlaceOrder",
  async (
    {
      type,
      side,
      duration,
      account_id,
      symbol,
      quantity,
      classType,
      price,
      stop,
      option_symbol,
      orders,
    }: {
      type: string;
      side: string;
      duration: string;
      account_id: string;
      symbol: string;
      quantity: number;
      classType: string;
      price?: string;
      stop?: string;
      option_symbol?: string;
      orders?: any;
    },
    { rejectWithValue }
  ) => {
    if (type && quantity) {
      let getApiEndpoint = `v1/accounts/${account_id.replace(
        "/",
        ""
      )}/orders?account_id=${account_id}&class=${classType}&type=${type}&symbol=${symbol}&duration=${duration}&preview=true`;
      if (classType === "multileg" && (type === "debit" || type === "credit" || type === "even" || type === "market")) {
        if (type === "debit" || (type === "credit" && price !== undefined)) {
          getApiEndpoint += `&price=${price}`;
        }
        orders.forEach((leg, index) => {
          getApiEndpoint += `&quantity[${index}]=${leg.quantity}&side[${index}]=${leg.side}&option_symbol[${index}]=${leg.option_symbol}`;
        });
      } else if (
        (classType === "equity" || classType === "option") &&
        (type === "limit" || type === "stop" || type === "stop_limit" || type === "market")
      ) {
        if (type === "limit" && price !== undefined) {
          getApiEndpoint += `&price=${price}`;
        } else if (type === "stop" && stop !== undefined) {
          getApiEndpoint += `&stop=${stop}`;
        } else if (type === "stop_limit" && price !== undefined && stop !== undefined) {
          getApiEndpoint += `&price=${price}&stop=${stop}`;
        }

        if (classType === "option" && option_symbol !== undefined) {
          getApiEndpoint += `&quantity=${quantity}&side=${side}&option_symbol=${option_symbol}`;
        } else if (classType === "equity") {
          getApiEndpoint += `&quantity=${quantity}&side=${side}`;
        }
      } else if (
        classType === "combo" &&
        (type === "debit" || type === "credit" || type === "even" || type === "market")
      ) {
        if (type === "debit" || (type === "credit" && price !== undefined)) {
          getApiEndpoint += `&price=${price}`;
        }
        getApiEndpoint += `&quantity[0]=${quantity}&side[0]=${side}`;
        orders.forEach((leg, index) => {
          getApiEndpoint += `&quantity[${index + 1}]=${leg.quantity}&side[${index + 1}]=${leg.side}&option_symbol[${
            index + 1
          }]=${leg.option_symbol}`;
        });
      }

      try {
        const response: any = await apiWithToken.post(getApiEndpoint);
        // return response.data;
        return { data: response?.data, status: response?.status };
      } catch (error) {
        throw error?.response?.data;
      }
    }
  }
);

export const editPlaceOrder = createAsyncThunk(
  "users/fetchPlaceOrder",
  async (
    {
      type,
      side,
      duration,
      account_id,
      symbol,
      quantity,
      classType,
      price,
      stop,
      option_symbol,
      orders,
      id,
    }: {
      type: string;
      side: string;
      duration: string;
      account_id: string;
      symbol: string;
      quantity: number;
      classType: string;
      price?: string;
      stop?: string;
      option_symbol?: string;
      orders?: any;
      id: string;
    },
    { rejectWithValue }
  ) => {
    if (type) {
      let getApiEndpoint = `v1/accounts/${account_id}/orders/${id}?account_id=${account_id}&class=${classType}&type=${type}&symbol=${symbol}&duration=${duration}`;
      if (classType === "multileg") {
        orders.forEach((leg, index) => {
          getApiEndpoint += `&quantity[${index}]=${leg.quantity}&side[${index}]=${leg.side}&option_symbol[${index}]=${leg.option_symbol}`;
        });
      } else if (
        (classType === "equity" || classType === "option") &&
        (type === "limit" || type === "stop" || type === "stop_limit" || type === "market")
      ) {
        if (type === "limit" && price !== undefined) {
          getApiEndpoint += `&price=${price}`;
        } else if (type === "stop" && stop !== undefined) {
          getApiEndpoint += `&stop=${stop}`;
        } else if (type === "stop_limit" && price !== undefined && stop !== undefined) {
          getApiEndpoint += `&price=${price}&stop=${stop}`;
        }

        if (classType === "option" && option_symbol !== undefined) {
          getApiEndpoint += `&quantity=${quantity}&side=${side}&option_symbol=${option_symbol}`;
        } else {
          getApiEndpoint += `&quantity=${quantity}`;
        }
      } else if (
        classType === "combo" &&
        (type === "debit" || type === "credit" || type === "even" || type === "market")
      ) {
        if (type === "debit" || (type === "credit" && price !== undefined)) {
          getApiEndpoint += `&price=${price}`;
        }
        getApiEndpoint += `&quantity[0]=${quantity}&side[0]=${side}`;
        orders.forEach((leg, index) => {
          getApiEndpoint += `&quantity[${index + 1}]=${leg.quantity}&side[${index + 1}]=${leg.side}&option_symbol[${
            index + 1
          }]=${leg.option_symbol}`;
        });
      }
      try {
        const response: any = await apiWithToken.put(getApiEndpoint);
        return { data: response.data, status: response.status };
      } catch (error) {
        // rejectWithValue(error);
        console.log("error", error);

        throw error?.response?.data;
      }
    }
  }
);

export interface placeOrderState {
  entities: any;
  loading: boolean;
  status: number;
}

const initialState: placeOrderState = {
  entities: [],
  loading: false,
  status: 200,
};

export const placeOrderSlice = createSlice({
  name: "placeOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlaceOrder.pending, (state, action) => {
      state.entities = [];
      state.loading = true;
    });
    builder.addCase(fetchPlaceOrder.fulfilled, (state, action) => {
      state.entities = action.payload?.data;
      state.status = action.payload?.status;
      state.loading = false;
    });
    builder.addCase(fetchPlaceOrder.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
    });
  },
});

export const placeOrderData = (state: any) => state.placeOrder && state.placeOrder.entities;
export const loadingOrderData = (state: any) => state.placeOrder && state.placeOrder.loading;
export const loadingOrderStatusNum = (state: any) => state.placeOrder && state.placeOrder.status;

export default placeOrderSlice.reducer;
