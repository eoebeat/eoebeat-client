import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  headerImageUrls: [],
  defaultCoverUrls: []
}

export const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setHeaderImageUrls: (state, action) => {
      state.headerImageUrls = action.payload
    },
    setDefaultCoverUrls: (state, action) => {
      state.defaultCoverUrls = action.payload
    }
  }
})

export const { setHeaderImageUrls, setDefaultCoverUrls } = assetSlice.actions

export const selectHeaderImageUrls = (state) => state.asset.headerImageUrls
export const selectDefaultCoverUrls = (state) => state.asset.defaultCoverUrls

export default assetSlice.reducer
