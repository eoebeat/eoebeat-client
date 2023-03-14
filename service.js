// service.js
import TrackPlayer, { Event, RepeatMode } from 'react-native-track-player'
import MusicService from './src/services/music.service'
import { setCurrentProgress, setCurrentTrack } from './src/store/slices/playerSlice'
import { store } from './src/store/store'

module.exports = async function () {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  try {
    TrackPlayer.addEventListener(Event.RemotePlay, async () => {
      await TrackPlayer.play()
    })

    TrackPlayer.addEventListener(Event.RemotePause, async () => {
      await TrackPlayer.pause()
    })

    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
      await TrackPlayer.skipToNext()
      await TrackPlayer.play()
    })

    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
      await TrackPlayer.skipToPrevious()
      await TrackPlayer.play()
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
