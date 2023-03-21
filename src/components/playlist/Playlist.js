import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { shuffleArray } from '../../utils/shared'
import { Colors } from '../../styles/Styles'
import ImageHeaderScrollView, { TriggeringView } from 'react-native-image-header-scroll-view'
import { DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import PlainMusicItem from '../common/PlainMusicItem'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentTrack,
  setCurrentQueue,
  setOriginalQueue,
  selectOriginalQueue,
  setLoadChangeTrack,
  setTrackRepeatMode
} from '../../store/slices/playerSlice'
import Separator from '../common/Separator'
import Footer from '../common/Footer'
import { useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context'
import { Icon } from '@rneui/themed'
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { usePlaybackState, State, RepeatMode } from 'react-native-track-player'
import { TrackRepeatMode } from '../../constants/Player'
import {
  selectListTracksByPlaylist,
  selectListTracksByPlaylistTotal
} from '../../store/slices/listTracksSlice'
import ExtendedFooter from '../common/ExtendedFooter'

const MIN_HEIGHT = Platform.OS === 'ios' ? 100 : 65
const MAX_HEIGHT = 330

const Playlist = ({ route, navigation }) => {
  const { playlistId, headerImageUri, name } = route.params

  const currentTrack = useSelector(selectCurrentTrack)
  const isItemPlaying = (track) => {
    if (currentTrack) return currentTrack.id === track.id
  }
  const insets = useSafeAreaInsets()
  const navTitleView = useRef(null)
  const backBtnView = useRef(null)
  const originalQueue = useSelector(selectOriginalQueue)
  const playerState = usePlaybackState()
  const dispatch = useDispatch()
  const listTracks = useSelector((state) => selectListTracksByPlaylist(state, playlistId)).reverse()
  const listTrackTotal = useSelector((state) => selectListTracksByPlaylistTotal(state, playlistId))

  const onPressItem = async (track) => {
    try {
      let playerQueue = await TrackPlayer.getQueue()
      const idx = playerQueue.findIndex((element) => element.id === track.id)
      const currentTrackIdx = await TrackPlayer.getCurrentTrack()

      // 当前队列中没有歌曲
      if (playerQueue.length === 0) {
        await TrackPlayer.add(track)
        dispatch(setLoadChangeTrack(true))
        playerQueue = await TrackPlayer.getQueue()
        dispatch(setCurrentQueue([...playerQueue]))
        dispatch(setOriginalQueue([track, ...originalQueue]))
        return
      }

      if (idx === -1) {
        // 当前播放列表中没有此歌曲
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)

        await TrackPlayer.add(track, 0)
        await TrackPlayer.skip(0)
        dispatch(setLoadChangeTrack(true))

        playerQueue = await TrackPlayer.getQueue()
        dispatch(setCurrentQueue([...playerQueue]))
        dispatch(setOriginalQueue([track, ...originalQueue]))
      } else if (idx === currentTrackIdx) {
        await TrackPlayer.seekTo(0)
        if (playerState !== State.Playing) {
          await TrackPlayer.play()
        }
      } else {
        // 当前播放列表中已有此歌曲，且此歌曲未在播放
        const length = playerQueue.length
        while (playerQueue.length !== length - 1) {
          playerQueue.forEach(async (value, index) => {
            if (value.id === track.id) {
              await TrackPlayer.remove(index)
            }
          })
          playerQueue = await TrackPlayer.getQueue()
        }

        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)

        await TrackPlayer.add(track, 0)
        await TrackPlayer.skip(0)
        dispatch(setLoadChangeTrack(true))

        playerQueue = await TrackPlayer.getQueue()
        dispatch(setCurrentQueue([...playerQueue]))
        dispatch(setOriginalQueue([track, ...originalQueue.filter((item) => item.id !== track.id)]))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onPressPlay = async () => {
    try {
      const extractedTracks = listTracks.map((element) => element.track)
      await TrackPlayer.pause()
      await TrackPlayer.reset()
      await TrackPlayer.add(extractedTracks)
      dispatch(setLoadChangeTrack(true))
      dispatch(setCurrentQueue([...extractedTracks]))
      dispatch(setOriginalQueue([...extractedTracks]))
    } catch (e) {
      console.log('添加歌曲至播放列表错误', e)
    }
  }

  const onPressShuffle = async () => {
    try {
      const extractedTracks = listTracks.map((element) => element.track)
      await TrackPlayer.pause()
      await TrackPlayer.reset()
      await TrackPlayer.setRepeatMode(RepeatMode.Queue)
      dispatch(setTrackRepeatMode(TrackRepeatMode.Shuffle))
      dispatch(setOriginalQueue([...extractedTracks]))
      shuffleArray(extractedTracks)
      await TrackPlayer.add(extractedTracks)
      dispatch(setLoadChangeTrack(true))
      dispatch(setCurrentQueue([...extractedTracks]))
    } catch (e) {
      console.log('添加歌曲至随机播放错误', e)
    }
  }

  const renderItem = ({ item }) => (
    <PlainMusicItem
      track={item.track}
      itemPlaying={isItemPlaying(item.track)}
      onPressItem={onPressItem}
    />
  )

  const listHeader = () => (
    <View style={styles.listHeaderWrapper}>
      <View style={styles.controllerWrapper}>
        <View style={styles.searchOrderWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.listHeaderSearchOrderBtn,
              { opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <Text style={styles.listHeaderSearchOrderText}>{`${listTrackTotal}首歌曲`}</Text>
          </Pressable>
        </View>
        <View style={styles.listHeaderBtnWrapper}>
          <Pressable
            style={({ pressed }) => ({
              marginRight: 10 * WIDTH_RATIO,
              opacity: pressed ? 0.6 : 1
            })}
            onPress={onPressShuffle}
          >
            <Icon type="player" name="shuffle" size={28 * WIDTH_RATIO} color={Colors.grey2} />
          </Pressable>
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1
            })}
            onPress={onPressPlay}
          >
            <Icon type="ionicon" name="play-circle" size={40 * WIDTH_RATIO} color={Colors.pink1} />
          </Pressable>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} translucent={true} />
      <ImageHeaderScrollView
        maxHeight={MAX_HEIGHT * WIDTH_RATIO}
        minHeight={MIN_HEIGHT * WIDTH_RATIO}
        renderHeader={() => (
          <FastImage
            source={{ uri: headerImageUri }}
            style={styles.headerImage}
            resizeMode={'cover'}
          >
            <LinearGradient
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.7 }}
              end={{ x: 0, y: 1 }}
              colors={['#00000000', Colors.black1Transparent]}
            ></LinearGradient>
          </FastImage>
        )}
        renderForeground={() => (
          <View style={[styles.foregroundWrapper, { marginTop: insets.top }]}>
            <TriggeringView
              onHide={() => {
                navTitleView.current.fadeInUp(200)
                backBtnView.current.fadeOut(200)
              }}
              onDisplay={() => {
                navTitleView.current.fadeOut(400)
                backBtnView.current.fadeIn(400)
              }}
            >
              <Text style={styles.foregroundTitle}>{name}</Text>
            </TriggeringView>
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View
            ref={navTitleView}
            style={[styles.navTitleView, { top: initialWindowMetrics.insets.top + 4 }]}
          >
            <Pressable
              style={[
                {
                  position: 'absolute',
                  left: 20 * WIDTH_RATIO
                },
                Platform.OS === 'android' && { top: 1 }
              ]}
              onPress={() => {
                navigation.popToTop()
              }}
            >
              <Icon type="feather" name="chevron-left" color={Colors.white1} size={26} />
            </Pressable>
            <Text style={styles.navTitle}>{name}</Text>
          </Animatable.View>
        )}
        ScrollViewComponent={FlatList}
        data={listTracks}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={listTracks.length < 5 ? <ExtendedFooter /> : <Footer />}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
      ></ImageHeaderScrollView>
      <Animatable.View
        ref={backBtnView}
        style={[
          styles.foregroundReturnWrapper,
          { top: initialWindowMetrics.insets.top + 4, left: 20 * WIDTH_RATIO }
        ]}
      >
        <Pressable
          onPress={() => {
            navigation.popToTop()
          }}
        >
          <Icon type="feather" name="chevron-left" color={Colors.white1} size={26} />
        </Pressable>
      </Animatable.View>
      <View>
        <Text>hello</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white1
  },
  headerImage: {
    width: DEVICE_LOGIC_WIDTH,
    height: MAX_HEIGHT * WIDTH_RATIO
  },
  foregroundWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 20 * WIDTH_RATIO
  },
  foregroundReturnWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center'
  },
  foregroundTitle: {
    fontSize: 50 * WIDTH_RATIO,
    color: Colors.white1,
    fontWeight: '700'
  },
  navTitleView: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    width: DEVICE_LOGIC_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0
  },
  navTitle: {
    color: Colors.white1,
    backgroundColor: 'transparent',
    fontSize: 18 * WIDTH_RATIO,
    fontWeight: '600'
  },
  listHeaderWrapper: {
    flex: 1,
    display: 'flex',
    paddingHorizontal: 20 * WIDTH_RATIO,
    backgroundColor: Colors.white1,
    paddingTop: 6 * WIDTH_RATIO
  },
  controllerWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listHeaderBtnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchOrderWrapper: {
    justifyContent: 'center'
  },
  listHeaderText: {
    fontWeight: '300',
    color: '#24ade4'
  },
  listHeaderSearchOrderBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  listHeaderSearchOrderText: {
    color: Colors.grey2,
    fontWeight: '300',
    fontSize: 14
  }
})

export default Playlist
