import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDataLoading: false,
};

const dataLoadingSlice = createSlice({
  name: "dataLoadingSlice",
  initialState,
  reducers: {
    fetchDataLoadingState: (state, action) => {
      state.isDataLoading = action.payload;
    },
  },
});

export const { fetchDataLoadingState } = dataLoadingSlice.actions;
export default dataLoadingSlice.reducer;
