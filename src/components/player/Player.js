import { View, StyleSheet, Pressable, Image, Text, ImageBackground, Platform } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player'
import { useSelector, useDispatch } from 'react-redux'
import { Colors, DEVICE_LOGIC_WIDTH, HEIGHT_RATIO, WIDTH_RATIO } from '../../styles/Styles'
import { Icon } from '@rneui/themed'
import { BlurView } from '@react-native-community/blur'
import { allSongs } from '../../Mockdata'
import {
  selectCurrentTrack,
  setCurrentQueue,
  setCurrentTrack,
  setOriginalQueue
} from '../../store/slices/playerSlice'
import PlayerModal from './PlayerModal'

const track1 = {
  url: 'https://storage.vtb.studio/d/AZGLOBAL/NFG/AS/Normalized%20Audio%20Tag/2022.05.10-2022.11.06/2022.05.13%20F%20%E5%8B%87%E6%B0%94%E3%80%905.0%E3%80%91.m4a',
  title: 'track1',
  artist: '米诺'
}

const track2 = {
  url: 'https://storage.vtb.studio/d/AZGLOBAL/NFG/AS/Normalized%20Audio%20Tag/2022.05.10-2022.11.06/2022.05.11%20AB%20%E9%81%87%E5%88%B0%E4%BD%A0%E7%9A%84%E6%97%B6%E5%80%99%E6%89%80%E6%9C%89%E6%98%9F%E6%98%9F%E9%83%BD%E8%90%BD%E5%88%B0%E6%88%91%E5%A4%B4%E4%B8%8A.m4a',
  title: 'track2',
  artist: '露早'
}

const allTracks = allSongs.map((value) => ({
  id: value.id,
  url: value.url,
  duration: value.duration,
  title: value.songName,
  artist: value.performer,
  artwork: value.coverUrl ? value.coverUrl : '',
  date: value.datetime
}))

const Player = () => {
  const dispatch = useDispatch()
  const playerState = usePlaybackState()
  const currentTrack = useSelector(selectCurrentTrack)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const playerOpacityAndroid = useMemo(() => {
    if (showPlayerModal) return 0
    return 1
  }, [showPlayerModal])

  useEffect(() => {
    const loadTrack = async () => {
      try {
        {
          if (!allTracks || !allTracks.length) return
          await TrackPlayer.add(allTracks)
          dispatch(setCurrentQueue(allTracks))
          dispatch(setOriginalQueue(allTracks))
          dispatch(setCurrentTrack(allTracks[0]))
        }
      } catch (e) {
        console.log(e)
      }
    }
    loadTrack()
  }, [])

  const coverImageSource = useMemo(() => {
    // 未在播放并且没有缓存的播放记录
    if (!currentTrack) return require('../../../assets/cover/未在播放.png')
    // 当前track有封面
    if (currentTrack.artwork) return currentTrack.artwork
    // 当前track没有封面
    if (currentTrack.artist.length > 2) return require('../../../assets/cover/EOE.jpg')
    // 各成员默认封面
    if (currentTrack.artist === '莞儿') return require('../../../assets/cover/莞儿.jpg')
    if (currentTrack.artist === '露早') return require('../../../assets/cover/露早.jpg')
    if (currentTrack.artist === '米诺') return require('../../../assets/cover/米诺.jpg')
    if (currentTrack.artist === '柚恩') return require('../../../assets/cover/柚恩.jpg')
    if (currentTrack.artist === '虞莫') return require('../../../assets/cover/虞莫.jpg')
  }, [currentTrack])

  const isPlaying = useMemo(() => {
    return playerState === State.Playing || playerState === State.Buffering
  }, [playerState])

  const onPressPlay = async () => {
    await TrackPlayer.play()
  }

  const onPressPause = async () => {
    await TrackPlayer.pause()
  }

  // 待完成
  const onPressSkipForward = async () => {
    try {
      const queue = await TrackPlayer.getQueue()
      const currentTrackIndex = await TrackPlayer.getCurrentTrack()
      // 非随机播放下，如果是queue中最后一首歌，则跳转到queue中的第一首
      if (currentTrackIndex === queue.length - 1) {
        await TrackPlayer.skip(0)
        await TrackPlayer.play()
      } else {
        await TrackPlayer.skipToNext()
        await TrackPlayer.play()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onPressSkipBackward = async () => {
    try {
      const queue = await TrackPlayer.getQueue()
      const currentTrackIndex = await TrackPlayer.getCurrentTrack()
      // 非随机播放下，如果是queue中的第一首歌，则跳转到queue中的最后一首
      if (currentTrackIndex === 0) {
        await TrackPlayer.skip(queue.length - 1)
        await TrackPlayer.play()
      } else {
        await TrackPlayer.skipToPrevious()
        await TrackPlayer.play()
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 打开播放器modal
  const onPressPlayer = () => {
    setShowPlayerModal(true)
  }

  return (
    <>
      <View style={styles.container}>
        <Pressable style={styles.playerPressable} onPressOut={onPressPlayer}>
          <ImageBackground
            style={[styles.backgroundImage, styles.blur]}
            source={coverImageSource}
            opacity={Platform.OS === 'android' ? playerOpacityAndroid : 1}
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
                <Image
                  style={[
                    styles.coverImage,
                    { opacity: Platform.OS === 'android' ? playerOpacityAndroid : 1 }
                  ]}
                  source={coverImageSource}
                />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.songName}>
                  {currentTrack && currentTrack.title ? currentTrack.title : '未在播放'}
                </Text>
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
                    size={30 * HEIGHT_RATIO}
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
                    size={30 * HEIGHT_RATIO}
                    color={Colors.black1}
                    style={styles.controllerIcon}
                  />
                </Pressable>
              )}
              <Pressable
                style={({ pressed }) => [
                  { opacity: pressed ? 0.6 : 1, marginLeft: 8 * WIDTH_RATIO }
                ]}
                onPressOut={onPressSkipForward}
              >
                <Icon
                  name="play-skip-forward"
                  type="ionicon"
                  size={30 * HEIGHT_RATIO}
                  color={Colors.grey2}
                  style={styles.controllerIcon}
                />
              </Pressable>
            </View>
          </ImageBackground>
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
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: DEVICE_LOGIC_WIDTH,
    height: 58 * HEIGHT_RATIO,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  playerPressable: {
    width: DEVICE_LOGIC_WIDTH,
    height: 58 * HEIGHT_RATIO,
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
    marginLeft: 6 * HEIGHT_RATIO
  },
  coverImage: {
    height: 46 * HEIGHT_RATIO,
    width: 46 * HEIGHT_RATIO,
    borderRadius: 6
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10 * WIDTH_RATIO
  },
  songName: {
    fontSize: 16 * HEIGHT_RATIO,
    color: Colors.black1,
    marginBottom: 4 * HEIGHT_RATIO
  },
  performer: {
    fontSize: 12 * HEIGHT_RATIO,
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
    height: 58 * HEIGHT_RATIO,
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
    height: 58 * HEIGHT_RATIO,
    position: 'absolute'
  },
  androidBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  }
})

export default Player
