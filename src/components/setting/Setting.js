import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Colors, WIDTH_RATIO } from '../../styles/Styles'
import SettingOverlay from './SettingOverlay'
import TrackPlayer from 'react-native-track-player'
import { useDispatch } from 'react-redux'
import { setCurrentQueue, setCurrentTrack, setOriginalQueue } from '../../store/slices/playerSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Setting = () => {
  const [showSettingOverlay, setShowSettingOverlay] = useState(false)
  const [overlayTitle, setOverlayTitle] = useState('')
  const [overlayDescription, setOverlayDescription] = useState('')
  const dispatch = useDispatch()

  const toggleOverlay = () => {
    setShowSettingOverlay(!showSettingOverlay)
  }

  const resetQueue = async () => {
    await TrackPlayer.reset()
    dispatch(setCurrentQueue([]))
    dispatch(setOriginalQueue([]))
    dispatch(setCurrentTrack(undefined))
    toggleOverlay()
  }

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear()
      setOverlayTitle('清除成功')
      setOverlayDescription('清除本地存储数据成功！重启应用后生效。')
    } catch (e) {
      console.log(e)
    }
  }

  const onPressOverlayConfirm = useCallback(() => {
    if (overlayTitle === '') return
    if (overlayTitle === '重置播放列表') {
      resetQueue()
    } else if (overlayTitle === '清除本地存储数据') {
      clearAsyncStorage()
    } else if (overlayTitle === '清除成功') {
      toggleOverlay()
    }
  }, [overlayTitle, overlayDescription])

  const onPressResetQueue = () => {
    setOverlayTitle('重置播放列表')
    setOverlayDescription('')
    setShowSettingOverlay(true)
  }

  const onPressClearAsyncStorage = () => {
    setOverlayTitle('清除本地存储数据')
    setOverlayDescription(
      '清除本地存储数据将清除当前歌单，和备份的播放列表、搜索历史等。清除后不可恢复，确认要清除？'
    )
    setShowSettingOverlay(true)
  }

  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={onPressResetQueue}
          style={({ pressed }) => [
            styles.pressable,
            {
              opacity: pressed ? 0.6 : 1,
              backgroundColor: pressed ? Colors.lightgrey2 : Colors.white1
            }
          ]}
        >
          <Text style={styles.pressableText}>重置播放列表</Text>
        </Pressable>
        <Pressable
          onPress={onPressClearAsyncStorage}
          style={({ pressed }) => [
            styles.pressable,
            {
              opacity: pressed ? 0.6 : 1,
              backgroundColor: pressed ? Colors.lightgrey2 : Colors.white1
            }
          ]}
        >
          <Text style={styles.pressableText}>清除本地存储数据</Text>
        </Pressable>
      </View>
      <SettingOverlay
        showSettingOverlay={showSettingOverlay}
        toggleOverlay={toggleOverlay}
        overlayTitle={overlayTitle}
        overlayDescription={overlayDescription}
        onPressOverlayConfirm={onPressOverlayConfirm}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white1
  },
  pressable: {
    backgroundColor: Colors.white1,
    paddingHorizontal: 20 * WIDTH_RATIO,
    height: 40 * WIDTH_RATIO,
    justifyContent: 'center',
    width: '100%'
  },
  pressableText: {
    fontSize: 14,
    color: Colors.black1
  }
})

export default Setting
