// service.js
import TrackPlayer, { Event, RepeatMode } from 'react-native-track-player'
import { setCurrentTrack } from './src/store/slices/playerSlice'
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
        const nextTrackObject = await TrackPlayer.getTrack(param.nextTrack)
        store.dispatch(setCurrentTrack(nextTrackObject))
      } catch (e) {
        console.log(e)
      }
    })

    /**
     * @param {track<number>, position<number>}
     *
     */
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (param) => {
      try {
        const repeatMode = await TrackPlayer.getRepeatMode()
        if (repeatMode === RepeatMode.Off) {
          const queue = await TrackPlayer.getQueue()
          if (queue.length) await TrackPlayer.skip(0)
        }
      } catch (e) {
        console.log(e)
      }
    })
  } catch (error) {}
}
