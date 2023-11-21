"use client";
import { apiWithToken } from "@/utils/apiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOrderList = createAsyncThunk("users/fetchOrderList", async (accountId: string) => {
  const response: any = await apiWithToken.get(`/v1/accounts/${accountId}/orders?includeTags=true`);
  // return response.data.orders;
  return { data: response.data.orders, status: response.status };
});

export const deleteOrder = createAsyncThunk("users/deleteOrder", async (data: any) => {
  try {
    const response = await apiWithToken.delete(`/v1/accounts/${data.accountId}/orders/${data.orderId}`);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error.response.data;
  }
});

export interface orderListState {
  entities: any;
  status: number;
  toast: object;
}

const initialState: orderListState = {
  entities: [],
  status: 200,
  toast: { 
    type: '',
    message: '',
  },
};

export const orderListSlice = createSlice({
  name: "orderList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrderList.fulfilled, (state, action) => {
      state.entities = action.payload.data;
      state.status = action.payload.status;
    });
    builder.addCase(fetchOrderList.rejected, (state, action: any) => {
      state.entities = action.payload?.data || [];
      state.status = action.payload?.status || 401;
      console.log("Server error", action);
    });
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
        const idToRemove = action.payload.data.order.id;
        if(state.entities.length===1) {
          state.entities = []
        } else {
          for (const key in state.entities) {
            if (state.entities[key].id === idToRemove) {
              delete state.entities[key];
              break; // Assuming there's only one matching entry
            }
          }
        }
      state.status = action.payload.status;
    });
  },
});

export const orderList = (state: any) => state.orderList && state.orderList.entities;
export const orderStatusNumber = (state: any) => state.orderList && state.orderList.status;
export const orderToast = (state: any) => state.orderList && state.orderList.toast;

export default orderListSlice.reducer;
