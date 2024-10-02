import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: 0, // The active board index
  boards: [
    {
      id: 1,
      name: 'Board 1',
      bgcolor: '#333',
      list: [
        { id: '1', title: 'List 1', items: [{ id: '1', title: 'Card 1' }] },
        { id: '2', title: 'List 2', items: [{ id: '2', title: 'Card 2' }] },
      ],
    },
    {
      id: 2,
      name: 'Board 2',
      bgcolor: '#555',
      list: [
        { id: '3', title: 'List 3', items: [{ id: '3', title: 'Card 3' }] },
      ],
    },
  ],
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setAllBoard: (state, action) => {
      return { ...action.payload };
    },
    addCard: (state, action) => {
      const { listIndex, card } = action.payload;
      state.boards[state.active].list[listIndex].items.push(card);
    },
    addList: (state, action) => {
      state.boards[state.active].list.push(action.payload);
    },
    removeCard: (state, action) => {
      const { listIndex, cardIndex } = action.payload;
      state.boards[state.active].list[listIndex].items.splice(cardIndex, 1);
    },
    removeList: (state, action) => {
      state.boards[state.active].list.splice(action.payload, 1);
    },
    editCard: (state, action) => {
      const { listIndex, cardIndex, title } = action.payload;
      state.boards[state.active].list[listIndex].items[cardIndex].title = title;
    },
    editList: (state, action) => {
      const { listIndex, title } = action.payload;
      state.boards[state.active].list[listIndex].title = title;
    },
  },
});

export const { setAllBoard, addCard, addList, removeCard, removeList, editCard, editList } = boardSlice.actions;

export default boardSlice.reducer;
