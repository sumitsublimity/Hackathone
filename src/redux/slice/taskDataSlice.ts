import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEditTaskModalOpen: false,
  isDeleteTaskModalOpen: false,
  taskData: {},
};

const taskDataSlice = createSlice({
  name: "taskDataSlice",
  initialState,
  reducers: {
    fetchTaskData: (state, action) => {
      state.taskData = action.payload;
    },
    setIsEditTaskModalOpen: (state, action) => {
      state.isEditTaskModalOpen = action.payload;
    },
    setIsDeleteTaskModalOpen: (state, action) => {
      state.isDeleteTaskModalOpen = action.payload;
    },
  },
});

export const {
  fetchTaskData,
  setIsEditTaskModalOpen,
  setIsDeleteTaskModalOpen,
} = taskDataSlice.actions;
export default taskDataSlice.reducer;
