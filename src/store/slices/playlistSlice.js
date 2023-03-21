import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const playlistsAdapter = createEntityAdapter({})

const initialState = playlistsAdapter.getInitialState({
  ids: [0],
  entities: {
    0: { id: 0, name: '已收藏的歌曲', imageUri: '' }
  }
})

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    playlistAdded: playlistsAdapter.addOne,
    setPlaylistImageUri: (state, action) => {
      const { id, newImageUri } = action.payload
      const existingPlaylist = state.entities[id]
      if (existingPlaylist) {
        existingPlaylist.imageUri = newImageUri
      }
    }
  }
})

export const { playlistAdded, setPlaylistImageUri } = playlistsSlice.actions

export default playlistsSlice.reducer

export const { selectAll: selectAllPlaylists, selectById: selectPlaylistById } =
  playlistsAdapter.getSelectors((state) => state.playlists)
