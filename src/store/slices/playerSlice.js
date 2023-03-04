import { createSlice } from '@reduxjs/toolkit'
import { TrackRepeatMode } from '../../constants/Player'

/**
 * currentTrack: {
 *  id: string,
 *  url: string,
 *  duration: number,
 *  title: string,
 *  artist: string,
 *  artwork?: string,
 *  date: string
 * }
 */

const initialState = {
  finishedSetup: false,
  bottomPosition: 0,
  currentTrack: undefined,
  trackRepeatMode: TrackRepeatMode.Queue,
  currentQueue: [],
  originalQueue: []
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setFinishedSetup: (state, action) => {
      state.finishedSetup = action.payload
    },
    setBottomPosition: (state, action) => {
      state.bottomPosition = action.payload
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload
    },
    setTrackRepeatMode: (state, action) => {
      state.trackRepeatMode = action.payload
    },
    setCurrentQueue: (state, action) => {
      state.currentQueue = [...action.payload]
    },
    addTrackToQueue: (state, action) => {
      state.currentQueue = [...state.currentQueue, action.payload]
    },
    setOriginalQueue: (state, action) => {
      state.originalQueue = [...action.payload]
    }
  }
})

export const {
  setFinishedSetup,
  setBottomPosition,
  setCurrentTrack,
  setTrackRepeatMode,
  setCurrentQueue,
  addTrackToQueue,
  setOriginalQueue
} = playerSlice.actions

export const selectFinishedSetup = (state) => state.player.finishedSetup
export const selectBottomPosition = (state) => state.player.bottomPosition
export const selectCurrentTrack = (state) => state.player.currentTrack
export const selectTrackRepeatMode = (state) => state.player.trackRepeatMode
export const selectCurrentQueue = (state) => state.player.currentQueue
export const selectOriginalQueue = (state) => state.player.originalQueue

export default playerSlice.reducer
