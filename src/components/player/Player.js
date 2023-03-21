import { View, StyleSheet, Pressable, Text, Platform, Easing } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player'
import { useSelector, useDispatch } from 'react-redux'
import { Colors, DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import { Icon } from '@rneui/themed'
import { BlurView } from '@react-native-community/blur'
import {
  selectCurrentProgress,
  selectCurrentQueue,
  selectCurrentTrack,
  selectLoadChangeTrack,
  setLoadChangeTrack
} from '../../store/slices/playerSlice'
import PlayerModal from './PlayerModal'
import { findCurrentTrackIndex, getDisplayTitleText } from '../../utils/shared'
import FastImage from 'react-native-fast-image'
import TextTicker from 'react-native-text-ticker'
import { selectDefaultCoverUrls } from '../../store/slices/assetSlice'

const Player = () => {
  const dispatch = useDispatch()
  const playerState = usePlaybackState()
  const currentTrack = useSelector(selectCurrentTrack)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const playerOpacityAndroid = useMemo(() => {
    if (showPlayerModal) return 0
    return 1
  }, [showPlayerModal])
  const currentQueue = useSelector(selectCurrentQueue)
  const currentProgress = useSelector(selectCurrentProgress)
  const loadChangeTrack = useSelector(selectLoadChangeTrack)

  useEffect(() => {
    const loadTrack = async () => {
      try {
        await TrackPlayer.reset() // just incase
        await TrackPlayer.add(currentQueue)
        const currentTrackIdx = findCurrentTrackIndex(currentTrack, currentQueue)

        if (currentTrackIdx === -1) return

        // 如果currentTrack不是排currentQueue第一个，需要跳转到queue中的相应idx
        if (currentTrackIdx !== 0) {
          await TrackPlayer.skip(currentTrackIdx)
        }
        await TrackPlayer.seekTo(currentProgress)
      } catch (e) {
        console.log(e)
      }
    }
    loadTrack()
  }, [])

  useEffect(() => {
    const checkReadyAndPlay = async () => {
      console.log('checkReadyAndPlay, load: ', loadChangeTrack, ' state: ', playerState)
      if (!loadChangeTrack) return

      if (playerState === State.Ready) {
        await TrackPlayer.play()
        dispatch(setLoadChangeTrack(false))
      }
    }
    checkReadyAndPlay()
  }, [loadChangeTrack, playerState])

  const coverImageSource = useMemo(() => {
    if (!currentTrack) {
      return require('../../../assets/cover/未在播放.png')
    }
    return { uri: currentTrack.artwork }
  }, [currentTrack])

  const getDefaultCoverImageSource = () => {
    // 未在播放并且没有缓存的播放记录
    if (!currentTrack) return require('../../../assets/cover/未在播放.png')
    // 当前track有封面
    // if (currentTrack.artwork) return { uri: currentTrack.artwork }
    // 当前track没有封面
    if (currentTrack.artist && currentTrack.artist.length > 2)
      // return { uri: defaultCoverUrls && defaultCoverUrls.length ? defaultCoverUrls[0] : '' }
      return require('../../../assets/cover/EOE默认封面1.jpg')
    // 各成员默认封面
    if (currentTrack.artist === '莞儿')
      // return { uri: defaultCoverUrls && defaultCoverUrls.length ? defaultCoverUrls[1] : '' }
      return require('../../../assets/cover/莞儿默认封面1.jpg')
    if (currentTrack.artist === '露早')
      // return { uri: defaultCoverUrls && defaultCoverUrls.length ? defaultCoverUrls[2] : '' }
      return require('../../../assets/cover/露早默认封面1.jpg')
    if (currentTrack.artist === '米诺')
      // return { uri: defaultCoverUrls && defaultCoverUrls.length ? defaultCoverUrls[3] : '' }
      return require('../../../assets/cover/米诺默认封面1.jpg')
    if (currentTrack.artist === '柚恩')
      // return { uri: defaultCoverUrls && defaultCoverUrls.length ? defaultCoverUrls[4] : '' }
      return require('../../../assets/cover/柚恩默认封面1.jpg')
    if (currentTrack.artist === '虞莫')
      // return { uri: defaultCoverUrls && defaultCoverUrls.length ? defaultCoverUrls[5] : '' }
      return require('../../../assets/cover/虞莫默认封面1.jpg')
  }

  const isPlaying = useMemo(() => {
    return playerState === State.Playing || playerState === State.Buffering
  }, [playerState])

  const onPressPlay = async () => {
    if (loadChangeTrack) return
    await TrackPlayer.play()
  }

  const onPressPause = async () => {
    if (loadChangeTrack) return
    await TrackPlayer.pause()
  }

  const onPressSkipForward = async () => {
    try {
      const queue = await TrackPlayer.getQueue()
      if (!queue.length) return

      const currentTrackIndex = await TrackPlayer.getCurrentTrack()

      if (currentTrackIndex === queue.length - 1) {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skip(0)
        dispatch(setLoadChangeTrack(true))
      } else {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skipToNext()
        dispatch(setLoadChangeTrack(true))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onPressSkipBackward = async () => {
    try {
      const queue = await TrackPlayer.getQueue()
      if (!queue.length) return

      const currentTrackIndex = await TrackPlayer.getCurrentTrack()

      if (currentTrackIndex === 0) {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skip(queue.length - 1)
        dispatch(setLoadChangeTrack(true))
      } else {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skipToPrevious()
        dispatch(setLoadChangeTrack(true))
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 打开播放器modal
  const onPressPlayer = () => {
    setShowPlayerModal(true)
  }

  const titleText = getDisplayTitleText(currentTrack)

  return (
    <>
      <View style={styles.container}>
        <Pressable style={styles.playerPressable} onPressOut={onPressPlayer}>
          <FastImage
            style={[styles.backgroundImage, styles.blur]}
            source={coverImageSource}
            opacity={Platform.OS === 'android' ? playerOpacityAndroid : 1}
            defaultSource={getDefaultCoverImageSource()}
          >
            <BlurView
              style={[styles.blurView, Platform.OS === 'android' && styles.androidBlur]}
              blurType="xlight"
              blurAmount={50}
              reducedTransparencyFallbackColor={Colors.white1}
              overlayColor=""
              blurRadius={25}
              downsampleFactor={25}
            />
            <View style={styles.leftPartWrapper}>
              <View style={styles.coverImageWrapper}>
                <FastImage
                  style={[
                    styles.coverImage,
                    { opacity: Platform.OS === 'android' ? playerOpacityAndroid : 1 }
                  ]}
                  source={coverImageSource}
                  defaultSource={getDefaultCoverImageSource()}
                />
              </View>
              <View style={styles.textWrapper}>
                <View style={styles.titleWrapper}>
                  <TextTicker
                    style={styles.songName}
                    numberOfLines={1}
                    bounceSpeed={100}
                    bounceDelay={2000}
                    easing={Easing.linear}
                    marqueeDelay={4000}
                    scrollSpeed={50}
                    bouncePadding={{ left: 0, right: 0 }}
                  >
                    {titleText}
                  </TextTicker>
                </View>
                <Text style={styles.performer}>
                  {currentTrack && currentTrack.artist ? currentTrack.artist : ''}
                </Text>
              </View>
            </View>
            <View style={styles.iconWrapper}>
              {!isPlaying && (
                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  onPressOut={onPressPlay}
                >
                  <Icon
                    name="play"
                    type="ionicon"
                    size={30 * WIDTH_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              {isPlaying && (
                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  onPressOut={onPressPause}
                >
                  <Icon
                    name="pause"
                    type="ionicon"
                    size={30 * WIDTH_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.6 : 1,
                    marginLeft: 12 * WIDTH_RATIO
                  }
                ]}
                onPressOut={onPressSkipForward}
              >
                <Icon
                  name="play-skip-forward"
                  type="ionicon"
                  size={30 * WIDTH_RATIO}
                  color={Colors.grey2}
                  style={styles.controllerIcon}
                />
              </Pressable>
            </View>
          </FastImage>
        </Pressable>
      </View>
      <PlayerModal
        showPlayerModal={showPlayerModal}
        setShowPlayerModal={setShowPlayerModal}
        isPlaying={isPlaying}
        coverImageSource={coverImageSource}
        onPressPlay={onPressPlay}
        onPressPause={onPressPause}
        onPressSkipForward={onPressSkipForward}
        onPressSkipBackward={onPressSkipBackward}
        getDefaultCoverImageSource={getDefaultCoverImageSource}
      />
    </>
  )
}

const PLAYER_HEIGHT = 66

const styles = StyleSheet.create({
  container: {
    width: DEVICE_LOGIC_WIDTH,
    height: PLAYER_HEIGHT * WIDTH_RATIO,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  playerPressable: {
    width: DEVICE_LOGIC_WIDTH,
    height: PLAYER_HEIGHT * WIDTH_RATIO,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white1
  },
  leftPartWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  coverImageWrapper: {
    marginLeft: 20 * WIDTH_RATIO
  },
  coverImage: {
    height: 50 * WIDTH_RATIO,
    width: 50 * WIDTH_RATIO,
    borderRadius: 6
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10 * WIDTH_RATIO
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  songName: {
    fontSize: 16 * WIDTH_RATIO,
    color: Colors.black1,
    marginBottom: 4 * WIDTH_RATIO,
    width: 218 * WIDTH_RATIO
  },
  performer: {
    fontSize: 12 * WIDTH_RATIO,
    fontWeight: '200',
    color: Colors.black1
  },
  iconWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 16 * WIDTH_RATIO
  },
  controllerIcon: {
    opacity: 0.8
  },
  backgroundImage: {
    width: DEVICE_LOGIC_WIDTH,
    height: PLAYER_HEIGHT * WIDTH_RATIO,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  blur: {
    ...StyleSheet.absoluteFillObject
  },
  blurView: {
    width: DEVICE_LOGIC_WIDTH,
    height: PLAYER_HEIGHT * WIDTH_RATIO,
    position: 'absolute'
  },
  androidBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  }
})

export default Player
