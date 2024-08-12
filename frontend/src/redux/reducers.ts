import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
  data: any[];
  selected: string;
  modalOpen: boolean;
  symbolInput: string;
}

const initialState: DataState = {
  data: [],
  selected: 'GOOG',
  modalOpen: false,
  symbolInput: '',
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    },
    setSelected(state, action: PayloadAction<string>) {
      state.selected = action.payload;
    },
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload;
    },
    setSymbolInput(state, action: PayloadAction<string>) {
      state.symbolInput = action.payload;
    },
  },
});

export const { setData, setSelected, setModalOpen, setSymbolInput } = dataSlice.actions;
export default dataSlice.reducer;
