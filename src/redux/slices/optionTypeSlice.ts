import { createSlice } from "@reduxjs/toolkit";

enum FilterType {
  ProfitLossDollar = 0,
  ProfitLossPercentage = 1,
}

const strategiesSlice = createSlice({
  name: "strategies",
  initialState: {
    data: null,
    loading: true,
    percentageDollar: null,
    filterType: FilterType.ProfitLossDollar,
    options: null,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPercentageDollar(state, action) {
      state.percentageDollar = action.payload;
    },
    setFilterType(state, action) {
      state.filterType = action.payload;
    },
  },
});

export const { setData, setLoading, setPercentageDollar, setFilterType } = strategiesSlice.actions;
export default strategiesSlice.reducer;
