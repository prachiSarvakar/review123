import { createSlice } from "@reduxjs/toolkit";

const summeriesSlice = createSlice({
  name: "summeries",
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {
    setSummeries: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSummeries } = summeriesSlice.actions;
export default summeriesSlice.reducer;
