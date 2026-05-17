import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeaderButtonConfig, HeaderState } from './dashboardInterfaces';


const initialState: HeaderState = {
  title: '',
  buttonConfig: null,
};

const dashboardHeaderSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeader: (
      state,
      action: PayloadAction<{
        title: string;
        button?: HeaderButtonConfig | null;
      }>,
    ) => {
      state.title = action.payload.title;
      state.buttonConfig = action.payload.button || null;
    },
    clearHeader: (state) => {
      state.title = '';
      state.buttonConfig = null;
    },
  },
});

export const { setHeader, clearHeader } = dashboardHeaderSlice.actions;
export default dashboardHeaderSlice.reducer;
