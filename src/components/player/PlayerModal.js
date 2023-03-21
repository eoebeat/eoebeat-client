import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  StatusBar,
  Easing
} from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
import { SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context'
import {
  Colors,
  DEVICE_LOGIC_HEIGHT,
  DEVICE_LOGIC_WIDTH,
  HEIGHT_RATIO,
  WIDTH_RATIO
} from '../../styles/Styles'
import {
  selectCurrentTrack,
  selectTrackRepeatMode,
  setCurrentQueue,
  setOriginalQueue,
  setTrackRepeatMode,
  selectOriginalQueue
} from '../../store/slices/playerSlice'
import { useSelector, useDispatch } from 'react-redux'
import { BlurView } from '@react-native-community/blur'
import { Icon, Slider } from '@rneui/themed'
import TrackPlayer, { RepeatMode, useProgress } from 'react-native-track-player'
import { durationToTime, getDisplayTitleText, shuffleArray } from '../../utils/shared'
import { TrackRepeatMode } from '../../constants/Player'
import PlaylistModal from './QueueModal'
import FastImage from 'react-native-fast-image'
import TextTicker from 'react-native-text-ticker'
import {
  selectAllListTrackIds,
  selectListTracksByPlaylist,
  listTrackAdded,
  listTrackRemoved
} from '../../store/slices/listTracksSlice'

const PlayerModal = (props) => {
  const {
    showPlayerModal,
    setShowPlayerModal,
    isPlaying,
    coverImageSource,
    onPressPlay,
    onPressPause,
    onPressSkipForward,
    onPressSkipBackward,
    getDefaultCoverImageSource
  } = props
  const currentTrack = useSelector(selectCurrentTrack)
  const dispatch = useDispatch()
  const progress = useProgress()
  const trackRepeatMode = useSelector(selectTrackRepeatMode)
  const originalQueue = useSelector(selectOriginalQueue)
  const [isSliding, setIsSliding] = useState(false)
  const [slidingPosition, setSlidingPosition] = useState(0)
  const [showQueueModal, setShowQueueModal] = useState(false)
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0)

  const listTrackIds = useSelector(selectAllListTrackIds)
  const tracksInLikePlaylist = useSelector((state) => selectListTracksByPlaylist(state, 0))
  const isLiked = useMemo(() => {
    if (!currentTrack) return false
    if (tracksInLikePlaylist.find((value) => value.track.id === currentTrack.id)) {
      return true
    } else {
      return false
    }
  }, [tracksInLikePlaylist])

  // currentTrack变更时获取新track在queue中的index
  useEffect(() => {
    const getIdx = async () => {
      try {
        const idx = await TrackPlayer.getCurrentTrack()
        setCurrentTrackIdx(idx)
      } catch (e) {
        console.log(e)
      }
    }
    getIdx()
  }, [currentTrack])

  // 进度条拖动
  const onSliderValueChange = async (seconds) => {
    setIsSliding(true)
    setSlidingPosition(seconds)
  }

  // 进度条拖动完成，TrackPlayer跳转并在1s后将时间显示更改为TrackPlayer的progress
  const onSlidingComplete = async (seconds) => {
    try {
      await TrackPlayer.seekTo(seconds)
      setTimeout(() => {
        setIsSliding(false)
      }, 1000)
    } catch (e) {
      setIsSliding(false)
      console.log(e)
    }
  }

  // 随机播放->循环播放
  // 查询currentTrack在originalQueue中的index，分成originalQueue[0, index - 1]和originalQueue[index + 1...]
  // 清除playerQueue中除了当前track，当前track前面加oQ第一部分，当前track后面加oQ第二部分
  // 将originalQueue设置为currentQueue，更新currentIndex
  const onPressShuffle = async () => {
    try {
      await TrackPlayer.setRepeatMode(RepeatMode.Queue)
      dispatch(setTrackRepeatMode(TrackRepeatMode.Queue))

      if (!originalQueue.length) return

      const trackIndexInOriginalQueue = originalQueue.findIndex(
        (track) => track.id === currentTrack.id
      )
      const firstPart = originalQueue.slice(0, trackIndexInOriginalQueue)
      const secondPart = originalQueue.slice(trackIndexInOriginalQueue + 1)

      let checkQueue = await TrackPlayer.getQueue()
      while (checkQueue.length !== 1) {
        checkQueue.forEach(async (value, index) => {
          if (value.id !== currentTrack.id) {
            await TrackPlayer.remove(index)
          }
        })
        checkQueue = await TrackPlayer.getQueue()
      }

      await TrackPlayer.add([...firstPart], 0)
      await TrackPlayer.add([...secondPart])

      dispatch(setCurrentQueue([...originalQueue]))
      setCurrentTrackIdx(trackIndexInOriginalQueue)
    } catch (e) {
      console.log(e)
    }
  }

  // 循环播放->单曲循环
  const onPressRepeatQueue = async () => {
    try {
      await TrackPlayer.setRepeatMode(RepeatMode.Track)
      dispatch(setTrackRepeatMode(TrackRepeatMode.Track))
    } catch (e) {
      console.log(e)
    }
  }

  // 单曲循环->随机播放
  // 首先保存当前Queue到playerSlice，用于恢复循环播放队列
  // 当前单曲取出来放到Queue中第一个；其他tracks取出来做shuffle，塞到Queue中当前曲子的后面。然后更新currentIndex
  const onPressRepeatTrack = async () => {
    try {
      await TrackPlayer.setRepeatMode(RepeatMode.Queue)
      dispatch(setTrackRepeatMode(TrackRepeatMode.Shuffle))
      let playerQueue = await TrackPlayer.getQueue()
      let tempQueue = [...playerQueue]
      // 播放列表中没有歌曲或只有一首歌曲时，不需要重排列表
      if (!tempQueue.length || tempQueue.length === 1) return

      dispatch(setOriginalQueue([...playerQueue]))
      const trackIndex = await TrackPlayer.getCurrentTrack()

      const trackArray = tempQueue.splice(trackIndex, 1)
      shuffleArray(tempQueue)

      // const queueBeforeRemove = await TrackPlayer.getQueue()
      // console.log('queueBeforeRemove: ', queueBeforeRemove)

      let checkQueue = await TrackPlayer.getQueue()
      while (checkQueue.length !== 1) {
        checkQueue.forEach(async (value, index) => {
          if (value.id !== currentTrack.id) {
            await TrackPlayer.remove(index)
          }
        })
        checkQueue = await TrackPlayer.getQueue()
      }

      // const queueAfterRemove = await TrackPlayer.getQueue()
      // console.log('queueAfterRemove: ', queueAfterRemove)

      await TrackPlayer.add([...tempQueue])

      // const newQueue = await TrackPlayer.getQueue()
      // console.log('newQueue length: ', newQueue.length)
      // console.log('newQueue: ', newQueue)

      tempQueue.unshift(trackArray[0])

      // console.log('tempQueue length: ', tempQueue.length)
      // console.log('tempQueue: ', tempQueue)
      dispatch(setCurrentQueue(tempQueue))
      setCurrentTrackIdx(0)
    } catch (e) {
      console.log(e)
    }
  }

  const onPressPlaylist = async () => {
    setShowQueueModal(true)
  }

  const titleText = getDisplayTitleText(currentTrack)

  const onPressLike = () => {
    dispatch(
      listTrackAdded({
        track: currentTrack,
        playlistId: 0,
        id: listTrackIds.length ? listTrackIds[listTrackIds.length - 1] + 1 : 0
      })
    )
  }

  const onPressNotLike = () => {
    dispatch(listTrackRemoved({ trackId: currentTrack.id, playlistId: 0 }))
  }

  return (
    <Modal animationType="slide" visible={showPlayerModal} statusBarTranslucent>
      <StatusBar barStyle={'dark-content'} translucent={true} />
      <SafeAreaView style={styles.container}>
        <FastImage
          style={[
            styles.backgroundImage,
            styles.blur,
            { opacity: Platform.OS === 'android' ? 0.9 : 1 }
          ]}
          blurRadius={20}
          source={coverImageSource}
          defaultSource={getDefaultCoverImageSource()}
        >
          {Platform.OS === 'ios' && (
            <BlurView
              style={styles.blurView}
              blurType="xlight"
              blurAmount={50}
              reducedTransparencyFallbackColor={Colors.white1}
              overlayColor={Colors.white1}
              blurRadius={25}
              downsampleFactor={25}
            />
          )}
          {Platform.OS === 'android' && (
            <BlurView
              style={[styles.blurView, styles.androidBlur]}
              blurType="xlight"
              blurAmount={50}
              overlayColor={Colors.white1}
              blurRadius={25}
              downsampleFactor={25}
            >
              <FastImage
                fallback={true}
                source={coverImageSource}
                defaultSource={getDefaultCoverImageSource()}
                style={[
                  styles.backgroundImage,
                  styles.blur,
                  {
                    position: 'absolute',
                    width: '100%',
                    backgroundColor: 'transparent',
                    opacity: 0.4
                  }
                ]}
                blurRadius={60}
              />
            </BlurView>
          )}
          <View
            style={[
              styles.returnPressableWrapper,
              { marginTop: initialWindowMetrics.insets.top + 10 * HEIGHT_RATIO }
            ]}
          >
            <Pressable onPressOut={() => setShowPlayerModal(false)}>
              <Icon
                type="ionicon"
                name="chevron-down"
                size={28 * WIDTH_RATIO}
                color={Colors.black1}
              />
            </Pressable>
          </View>
          <View style={styles.coverImageWrapper}>
            <FastImage
              source={coverImageSource}
              style={styles.coverImage}
              defaultSource={getDefaultCoverImageSource()}
            />
          </View>
          <View
            style={[
              styles.bottomHalfWrapper,
              { marginBottom: initialWindowMetrics.insets.bottom + 10 * HEIGHT_RATIO }
            ]}
          >
            <View style={styles.infoWrapper}>
              <View>
                <TextTicker
                  style={styles.title}
                  numberOfLines={1}
                  bounceDelay={2000}
                  bouncePadding={{ left: 0, right: 0 }}
                  scrollSpeed={50}
                  easing={Easing.linear}
                  marqueeDelay={4000}
                >
                  {titleText}
                </TextTicker>
                <Text style={styles.artist}>
                  {currentTrack ? `${currentTrack.artist} - ${currentTrack.date}` : ''}
                </Text>
              </View>
              {!isLiked && (
                <Pressable onPress={onPressLike}>
                  <Icon
                    type="ionicon"
                    name="heart-outline"
                    size={30 * WIDTH_RATIO}
                    style={styles.notFavorite}
                    color={Colors.grey2}
                  />
                </Pressable>
              )}
              {isLiked && (
                <Pressable onPress={onPressNotLike}>
                  <Icon type="ionicon" name="heart" size={30 * WIDTH_RATIO} color={Colors.pink1} />
                </Pressable>
              )}
            </View>
            <View style={styles.sliderWrapper}>
              <Slider
                allowTouchTrack
                value={isSliding ? slidingPosition : progress.position}
                minimumValue={0}
                maximumValue={currentTrack ? currentTrack.duration : 0}
                onSlidingComplete={onSlidingComplete}
                onValueChange={onSliderValueChange}
                step={1}
                trackStyle={{ height: 4 }}
                minimumTrackTintColor={Colors.pink1}
                maximumTrackTintColor={Colors.grey1}
                thumbStyle={{
                  width: 20 * WIDTH_RATIO,
                  height: 15 * WIDTH_RATIO,
                  backgroundColor: 'transparent'
                }}
                thumbProps={{
                  children: (
                    <Image
                      source={require('../../../assets/images/EOEicon.png')}
                      style={{ width: 20 * WIDTH_RATIO, height: 15 * WIDTH_RATIO }}
                    />
                  )
                }}
              />
            </View>
            <View style={styles.timeWrapper}>
              <Text style={styles.timePosition}>
                {currentTrack
                  ? isSliding
                    ? durationToTime(slidingPosition)
                    : durationToTime(progress.position)
                  : '--:--'}
              </Text>
              <Text style={styles.timeRemain}>
                {currentTrack
                  ? `-${durationToTime(progress.duration - progress.position)}`
                  : '--:--'}
              </Text>
            </View>
            <View style={styles.controllerWrapper}>
              {trackRepeatMode === TrackRepeatMode.Shuffle && (
                <Pressable
                  onPress={onPressShuffle}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Icon
                    type="player"
                    name="shuffle"
                    size={28 * WIDTH_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              {trackRepeatMode === TrackRepeatMode.Queue && (
                <Pressable
                  onPress={onPressRepeatQueue}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Icon
                    type="player"
                    name="repeat"
                    size={28 * WIDTH_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              {trackRepeatMode === TrackRepeatMode.Track && (
                <Pressable
                  onPress={onPressRepeatTrack}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Icon
                    type="player"
                    name="repeat-once"
                    size={28 * WIDTH_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              <Pressable
                onPress={onPressSkipBackward}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Icon
                  type="ionicon"
                  name="play-skip-back"
                  size={40 * WIDTH_RATIO}
                  color={Colors.black1}
                  style={styles.controllerIcon}
                />
              </Pressable>
              {isPlaying && (
                <Pressable
                  onPress={onPressPause}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Icon
                    type="player"
                    name="pause-outline"
                    size={65 * WIDTH_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              {!isPlaying && (
                <Pressable
                  onPress={onPressPlay}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Icon
                    type="player"
                    name="play-outline"
                    size={65 * WIDTH_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              <Pressable
                onPress={onPressSkipForward}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Icon
                  type="ionicon"
                  name="play-skip-forward"
                  size={40 * WIDTH_RATIO}
                  color={Colors.black1}
                  style={styles.controllerIcon}
                />
              </Pressable>
              <Pressable
                onPress={onPressPlaylist}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Icon
                  type="ionicon"
                  name="list-outline"
                  size={28 * WIDTH_RATIO}
                  color={Colors.black1}
                  style={styles.controllerIcon}
                />
              </Pressable>
            </View>
          </View>
        </FastImage>
      </SafeAreaView>
      <PlaylistModal
        showQueueModal={showQueueModal}
        setShowQueueModal={setShowQueueModal}
        currentTrackIdx={currentTrackIdx}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white1,
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  backgroundImage: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  blur: {
    ...StyleSheet.absoluteFillObject
  },
  blurView: {
    height: DEVICE_LOGIC_HEIGHT,
    width: DEVICE_LOGIC_WIDTH,
    position: 'absolute'
  },
  androidBlur: {
    backgroundColor: 'transparent'
  },
  returnPressableWrapper: {
    flexDirection: 'row',
    marginLeft: 15 * WIDTH_RATIO
  },
  coverImageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: Colors.grey2,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.8
  },
  coverImage: {
    width: 330 * WIDTH_RATIO,
    height: 330 * WIDTH_RATIO,
    borderRadius: 6
  },
  bottomHalfWrapper: {
    marginHorizontal: 20 * WIDTH_RATIO,
    paddingBottom: 10 * HEIGHT_RATIO
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 28 * WIDTH_RATIO,
    fontWeight: '600',
    color: Colors.black1,
    width: 310 * WIDTH_RATIO
  },
  artist: {
    fontSize: 18 * WIDTH_RATIO,
    fontWeight: '300',
    color: Colors.black1
  },
  notFavorite: {
    opacity: 0.5
  },
  sliderWrapper: {
    marginTop: 15 * HEIGHT_RATIO
  },
  timeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10 * HEIGHT_RATIO
  },
  timePosition: {
    color: Colors.black1,
    fontWeight: '300',
    fontSize: 12
  },
  timeRemain: {
    color: Colors.grey2,
    fontWeight: '300',
    fontSize: 12,
    includeFontPadding: false
  },
  controllerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14 * HEIGHT_RATIO
  },
  controllerIcon: {
    opacity: 0.7
  }
})

export default PlayerModal
