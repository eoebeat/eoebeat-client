import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  searchHistory: []
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchHistory: (state, action) => {
      state.searchHistory = action.payload
    }
  }
})

export const { setSearchHistory } = searchSlice.actions

export const selectSearchHistory = (state) => state.search.searchHistory

export default searchSlice.reducer
