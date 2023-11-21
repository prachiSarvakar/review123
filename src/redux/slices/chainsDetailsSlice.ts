"use client";
import axios from "axios";
import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiWithToken } from "@/utils/apiConfig";
import { IndexSymbolList, WeeklyIndexSymbolList } from "@/constants/common";
interface BuyToOpenCloseClearPayload {
  data: Data[]; // Replace 'Data' with the correct type of your data array
  key: string;
  item: object;
}

interface Data {
  description: any;
  strike: string;
  underlying: string;
  expiration_date: string;
  last: number;
  change: number;
  greeks: object;
}

interface DataState {
  data: Data[];
  selectedOptions: any[];
}

const initialState: DataState = {
  data: [],
  selectedOptions: [],
};

function getKeyByValue(object, value) {
  for (let key in object) {
    if (object.hasOwnProperty(key) && object[key] === value) {
      return key;
    }
  }
  return null;
}

export const buyMultiOption = createAsyncThunk(
  "chainsDetails/buyMultiOption",
  async ({
    options,
    selectedAccount,
    selectedOrderType,
    selectedTimeInForce,
    price,
  }: {
    options: any;
    selectedAccount: string;
    selectedOrderType: string;
    selectedTimeInForce: string;
    price: number;
  }) => {
    if (options) {
      const ordersQuery = options
        .map((item, index) => {
          return `option_symbol[${index}]=${item.symbol}&side[${index}]=${item.call_put}&quantity[${index}]=${item.quantity}`;
        })
        .join("&");

      let api = "";
      if (["credit", "debit"].includes(selectedOrderType)) {
        api = `${process.env.API_BASEURL}/v1/accounts/${selectedAccount}/orders?account_id=${selectedAccount}&${ordersQuery}&class=multileg&symbol=${options[0]["root_symbol"]}&type=${selectedOrderType}&duration=${selectedTimeInForce}&price=${price}`;
      } else {
        api = `${process.env.API_BASEURL}/v1/accounts/${selectedAccount}/orders?account_id=${selectedAccount}&${ordersQuery}&class=multileg&symbol=${options[0]["root_symbol"]}&type=${selectedOrderType}&duration=${selectedTimeInForce}`;
      }

      try {
        const response = await apiWithToken.post(api);

        const responseData = response.data;

        return responseData;
      } catch (error) {
        throw new Error("Error buying option: " + error.message);
      }
    }
  }
);

export const buyOption = createAsyncThunk(
  "chainsDetails/buyOption",
  async ({ option, selectedAccount }: { option: any; selectedAccount: string }) => {
    if (option) {
      const api = `${process.env.API_BASEURL}/v1/accounts/${selectedAccount}/orders?account_id=${selectedAccount}&class=option&symbol=${option["root_symbol"]}&option_symbol=${option["symbol"]}&side=${option["call_put"]}&quantity=${option["quantity"]}&type=${option["selectedOrderType"]}&duration=${option["selectedTimeInForce"]}`;

      try {
        const response = await apiWithToken.post(api);

        const responseData = response.data;

        return responseData;
      } catch (error) {
        throw new Error("Error buying option: " + error.message);
      }
    }
  }
);

export const fetchChainDetails = createAsyncThunk(
  "chainsDetails/fetchChainDetails",
  async ({ search, expiration }: { search: string; expiration: string }) => {
    if (expiration && search) {
      // const api = `${process.env.API_BASEURL}/v1/markets/options/chains?symbol=${search}&expiration=${expiration}&greeks=true`;
      if (WeeklyIndexSymbolList[search]) {
        search = WeeklyIndexSymbolList[search];
      }

      const response = await apiWithToken.get(
        `/v1/markets/options/chains?symbol=${search}&expiration=${expiration}&greeks=true`
      );

      const dataWithCustomIds = response?.data?.options?.option.map((item, index) => ({
        ...item,
        customid: index,
        call_buy: "",
        call_sell: "",
        put_buy: "",
        put_sell: "",
        call_buy_id: index + 1,
        call_sell_id: index + 2,
        put_buy_id: index + 3,
        put_sell_id: index + 4,
      }));

      return dataWithCustomIds;
    }
    return []; // Return an empty array if search or expiration is missing
  }
);

export const chainsDetailsSlice = createSlice({
  name: "chainsDetails",
  initialState,
  reducers: {
    saveData: (state, action: PayloadAction<Data[]>) => {
      state.data = action.payload;
    },
    buyOrSellSelected: (
      state,
      action: PayloadAction<{ item: object; key: string; customid: number; value: String }>
    ) => {
      const { item, key, customid, value } = action.payload;
      let newItem = { ...item };
      newItem[key] = value;

      const index = state?.data?.findIndex((dataItem) => dataItem["customid"] === customid);
      const indexOfSelectedOptions = state.selectedOptions.findIndex((so) => so["customid"] === item["customid"]);

      if (index !== -1) {
        state.data[index][key] = value;
      }

      if (indexOfSelectedOptions !== -1) {
        // const existingOption = {...state.selectedOptions[indexOfSelectedOptions]};
        if (state.selectedOptions[indexOfSelectedOptions][key] == "") {
          const lastIndex = state.selectedOptions.length - 1;
          if (state.selectedOptions[lastIndex][key] == "") {
            if (key == "call_buy") {
              newItem["call_buy_id"] = item["call_buy_id"];
              newItem["call_sell_id"] = 0;
              newItem["put_buy_id"] = 0;
              newItem["put_sell_id"] = 0;
            } else if (key == "call_sell") {
              newItem["call_buy_id"] = 0;
              newItem["call_sell_id"] = item["call_sell_id"];
              newItem["put_buy_id"] = 0;
              newItem["put_sell_id"] = 0;
            }
            if (key == "put_buy") {
              newItem["call_buy_id"] = 0;
              newItem["call_sell_id"] = 0;
              newItem["put_buy_id"] = item["put_buy_id"];
              newItem["put_sell_id"] = 0;
            }
            if (key == "put_sell") {
              newItem["call_buy_id"] = 0;
              newItem["call_sell_id"] = 0;
              newItem["put_buy_id"] = 0;
              newItem["put_sell_id"] = item["put_sell_id"];
            }

            state.selectedOptions.push(newItem);
          } else {
            state.selectedOptions.map((s) => {
              if (s["customid"] == item["customid"]) {
                s[key] = value;
              }
            });
          }
        } else {
          state.selectedOptions.map((s) => {
            if (s["customid"] == item["customid"]) {
              s[key] = value;
            }
          });
        }
      } else {
        if (key == "call_buy") {
          newItem["call_buy_id"] = item["call_buy_id"];
          newItem["call_sell_id"] = 0;
          newItem["put_buy_id"] = 0;
          newItem["put_sell_id"] = 0;
        } else if (key == "call_sell") {
          newItem["call_buy_id"] = 0;
          newItem["call_sell_id"] = item["call_sell_id"];
          newItem["put_buy_id"] = 0;
          newItem["put_sell_id"] = 0;
        }
        if (key == "put_buy") {
          newItem["call_buy_id"] = 0;
          newItem["call_sell_id"] = 0;
          newItem["put_buy_id"] = item["put_buy_id"];
          newItem["put_sell_id"] = 0;
        }
        if (key == "put_sell") {
          newItem["call_buy_id"] = 0;
          newItem["call_sell_id"] = 0;
          newItem["put_buy_id"] = 0;
          newItem["put_sell_id"] = item["put_sell_id"];
        }
        state.selectedOptions.push(newItem);
      }
    },

    buyOrSellSelectedRemove: (state, action: PayloadAction<{ item: object; key: string }>) => {
      const { item, key } = action.payload;
      const index = state?.data?.findIndex((dataItem) => dataItem["customid"] === item["customid"]);
      if (index !== -1) {
        state.data[index][key] = false;

        if (key == "call_buy") {
          state.selectedOptions = state.selectedOptions.filter((o) => o["call_buy_id"] != item["call_buy_id"]);
        } else if (key == "call_sell") {
          state.selectedOptions = state.selectedOptions.filter((o) => o["call_sell_id"] != item["call_sell_id"]);
        }
        if (key == "put_buy") {
          state.selectedOptions = state.selectedOptions.filter((o) => o["put_buy_id"] != item["put_buy_id"]);
        }
        if (key == "put_sell") {
          state.selectedOptions = state.selectedOptions.filter((o) => o["put_sell_id"] != item["put_sell_id"]);
        }
      }
    },

    addToBuyToOpenCloseClear: (state, action: PayloadAction<BuyToOpenCloseClearPayload>) => {
      const { data, key, item } = action.payload;

      const index = state.data.findIndex((dataItem) => dataItem["customid"] === item["customid"]);

      if (index !== -1) {
        state.data[index][key] = "";
      }

      if (key == "call_buy") {
        state.selectedOptions = state.selectedOptions.filter((o) => o["call_buy_id"] != item["call_buy_id"]);
      } else if (key == "call_sell") {
        state.selectedOptions = state.selectedOptions.filter((o) => o["call_sell_id"] != item["call_sell_id"]);
      }
      if (key == "put_buy") {
        state.selectedOptions = state.selectedOptions.filter((o) => o["put_buy_id"] != item["put_buy_id"]);
      }
      if (key == "put_sell") {
        state.selectedOptions = state.selectedOptions.filter((o) => o["put_sell_id"] != item["put_sell_id"]);
      }
    },
    clearOptions: (state) => {
      state.selectedOptions = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChainDetails.fulfilled, (state, action) => {
      state.data = action.payload;
      // state.selectedOptions = [];
    });
    builder.addCase(buyOption.fulfilled, (state, action) => {
      // If I need to update the state when buyOption completes successfully,
      // handle it here by calling the relevant reducer or modifying state directly
      // For example:
      // state.someField = action.payload.someValue;
    });
    builder.addCase(buyMultiOption.fulfilled, (state, action) => {
      // If I need to update the state when buyOption completes successfully,
      // handle it here by calling the relevant reducer or modifying state directly
      // For example:
      // state.someField = action.payload.someValue;
    });
  },
});

export const { saveData, buyOrSellSelectedRemove, addToBuyToOpenCloseClear, buyOrSellSelected, clearOptions } =
  chainsDetailsSlice.actions;

export default chainsDetailsSlice.reducer;
