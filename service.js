// service.js
import TrackPlayer, { Event, RepeatMode } from 'react-native-track-player'
import MusicService from './src/services/music.service'
import {
  setCurrentProgress,
  setCurrentTrack,
  setLoadChangeTrack
} from './src/store/slices/playerSlice'
import { store } from './src/store/store'

module.exports = async function () {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  try {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      TrackPlayer.play()
    })

    TrackPlayer.addEventListener(Event.RemotePause, () => {
      TrackPlayer.pause()
    })

    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
      const queue = await TrackPlayer.getQueue()
      if (!queue.length) return

      const currentTrackIndex = await TrackPlayer.getCurrentTrack()
      if (currentTrackIndex === queue.length - 1) {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skip(0)
        store.dispatch(setLoadChangeTrack(true))
        // await TrackPlayer.play()
      } else {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skipToNext()
        store.dispatch(setLoadChangeTrack(true))
        // await TrackPlayer.play()
      }
    })

    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
      const queue = await TrackPlayer.getQueue()
      if (!queue.length) return

      const currentTrackIndex = await TrackPlayer.getCurrentTrack()

      if (currentTrackIndex === 0) {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skip(queue.length - 1)
        store.dispatch(setLoadChangeTrack(true))
        // await TrackPlayer.play()
      } else {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skipToPrevious()
        store.dispatch(setLoadChangeTrack(true))
        // await TrackPlayer.play()
      }
    })

    TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
      console.log('remote seek', position)
      TrackPlayer.seekTo(position)
    })

    /**
     * @param {track<number>, position, nextTrack<number>}
     */
    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (param) => {
      try {
        if (param.nextTrack !== undefined) {
          const nextTrackObject = await TrackPlayer.getTrack(param.nextTrack)

          const currentTrack = store.getState().player.currentTrack
          store.dispatch(setCurrentTrack(nextTrackObject))

          if (currentTrack && nextTrackObject && currentTrack.id !== nextTrackObject.id) {
            MusicService.sendHitInfo(nextTrackObject.id)
          }
        }
      } catch (e) {
        console.log(e)
      }
    })

    /**
     * @param {track<number>, position<number>}
     *
     */
    /** 
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (param) => {
      try {
      } catch (e) {
        console.log(e)
      }
    })
    */

    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (params) => {
      try {
        store.dispatch(setCurrentProgress(params.position))
      } catch (e) {}
    })
  } catch (error) {}
}
