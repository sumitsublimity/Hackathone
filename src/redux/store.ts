import { configureStore } from "@reduxjs/toolkit";
import dataLoadingReducers from "@/redux/slice/dataLoadingSlice";
import taskDataReducers from "@/redux/slice/taskDataSlice";

export const store = configureStore({
  reducer: {
    dataLoadingReducers: dataLoadingReducers,
    taskDataReducers: taskDataReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
