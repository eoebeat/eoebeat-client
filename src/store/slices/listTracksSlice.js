import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

const listTracksAdapter = createEntityAdapter()

const initialState = listTracksAdapter.getInitialState()

const listTracksSlice = createSlice({
  name: 'listTracks',
  initialState,
  reducers: {
    listTrackAdded: listTracksAdapter.addOne,
    listTrackRemoved: (state, action) => {
      const { trackId, playlistId } = action.payload
      const entity = Object.entries(state.entities).find((pair) => {
        return pair[1].playlistId === playlistId && pair[1].track.id === trackId
      })
      // entity: [key, value]
      listTracksAdapter.removeOne(state, entity[0])
    }
  }
})

export const { listTrackAdded, listTrackRemoved } = listTracksSlice.actions

export default listTracksSlice.reducer

export const {
  selectAll: selectAllListTracks,
  selectIds: selectAllListTrackIds,
  selectEntities: selectAllListTrackEntities
} = listTracksAdapter.getSelectors((state) => state.listTracks)

export const selectListTracksByPlaylist = createSelector(
  [selectAllListTracks, (state, playlistId) => playlistId],
  (listTracks, playlistId) => listTracks.filter((listTrack) => listTrack.playlistId === playlistId)
)

export const selectListTracksByPlaylistTotal = createSelector(
  [selectAllListTracks, (state, playlistId) => playlistId],
  (listTracks, playlistId) => {
    let count = 0
    listTracks.forEach((element) => {
      if (element.playlistId === playlistId) count++
    })
    return count
  }
)
