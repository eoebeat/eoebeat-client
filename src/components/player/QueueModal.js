import { View, Text, Modal, StyleSheet, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context'
import { Colors, DEVICE_LOGIC_HEIGHT, HEIGHT_RATIO, WIDTH_RATIO } from '../../styles/Styles'
import { Icon } from '@rneui/themed'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentQueue,
  selectOriginalQueue,
  setCurrentQueue,
  setOriginalQueue,
  selectCurrentTrack,
  setLoadChangeTrack
} from '../../store/slices/playerSlice'
import QueueItem, { QUEUEITEM_HEIGHT } from '../common/QueueItem'
import Separator from '../common/Separator'
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player'
import ClearOverlay from './ClearOverlay'

const QueueModal = (props) => {
  const { showQueueModal, setShowQueueModal, currentTrackIdx } = props
  const currentQueue = useSelector(selectCurrentQueue)
  const originalQueue = useSelector(selectOriginalQueue)
  const currentTrack = useSelector(selectCurrentTrack)
  const dispatch = useDispatch()
  const playerState = usePlaybackState()
  const isItemPlaying = (track) => {
    if (currentTrack) return currentTrack.id === track.id
  }
  const [showClearOverlay, setShowClearOverlay] = useState(false)

  // FlatList的高度应该是设备逻辑高度 - (顶部SafeArea + 底部SafeArea) - (顶部返回图标高度 + 顶部返回marginTop + FlatList marginTop + 底部返回图标高度)
  const flatListHeight =
    DEVICE_LOGIC_HEIGHT -
    (initialWindowMetrics.insets.top + initialWindowMetrics.insets.bottom) -
    (30 * WIDTH_RATIO + 10 * HEIGHT_RATIO + 10 * HEIGHT_RATIO + 40 * HEIGHT_RATIO)

  const onDeleteItem = async (track, index) => {
    let checkQueue = await TrackPlayer.getQueue()
    const length = checkQueue.length

    if (length === 1) {
      // queue中只有一首歌，可以直接reset
      await TrackPlayer.reset()
    } else if (track.id === currentTrack.id) {
      // queue中多首歌，但删除的歌曲是currentTrack
      await TrackPlayer.pause()
      await TrackPlayer.skipToNext()
      if (playerState === State.Playing) {
        dispatch(setLoadChangeTrack(true))
      }
    }
    while (checkQueue.length !== length - 1) {
      checkQueue.forEach(async (value, index) => {
        if (value.id === track.id) {
          await TrackPlayer.remove(index)
        }
      })
      checkQueue = await TrackPlayer.getQueue()
    }

    // 从currentQueue中删除item
    const tempQueue = await TrackPlayer.getQueue()
    dispatch(setCurrentQueue(tempQueue))

    // 从originalQueue中删除item
    dispatch(setOriginalQueue(originalQueue.filter((item) => item.id !== track.id)))
  }

  const toggleOverlay = () => {
    setShowClearOverlay(!showClearOverlay)
  }

  const clearQueue = async () => {
    await TrackPlayer.pause()
    await TrackPlayer.reset()
    dispatch(setCurrentQueue([]))
    dispatch(setOriginalQueue([]))
    setShowClearOverlay(false)
  }

  const renderItem = ({ item, index }) => (
    <QueueItem
      track={item}
      index={index}
      onDeleteItem={onDeleteItem}
      itemPlaying={isItemPlaying(item)}
    />
  )

  return (
    <Modal animationType="fade" visible={showQueueModal}>
      <SafeAreaView
        style={[styles.container, { paddingBottom: initialWindowMetrics.insets.bottom }]}
      >
        <View>
          <View
            style={[
              styles.returnPressableWrapper,
              { marginTop: initialWindowMetrics.insets.top + 10 * HEIGHT_RATIO }
            ]}
          >
            <Pressable style={styles.returnPressable} onPress={() => setShowQueueModal(false)}>
              <Icon type="ionicon" name="close" size={28 * WIDTH_RATIO} color={Colors.black1} />
            </Pressable>
            <Text style={styles.playlistText}>播放列表</Text>
            <Pressable
              style={({ pressed }) => [styles.clearPressable, { opacity: pressed ? 0.6 : 1 }]}
              onPress={toggleOverlay}
            >
              <Icon name="trash-2" type="feather" color={Colors.grey1} size={22 * WIDTH_RATIO} />
            </Pressable>
          </View>
          <View style={styles.flatListWrapper}>
            <FlatList
              data={currentQueue}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{
                height: flatListHeight
              }}
              ItemSeparatorComponent={Separator}
              getItemLayout={(data, index) => ({
                length: QUEUEITEM_HEIGHT + StyleSheet.hairlineWidth,
                offset: (QUEUEITEM_HEIGHT + StyleSheet.hairlineWidth) * index,
                index
              })}
              initialScrollIndex={currentTrackIdx}
            />
          </View>
        </View>
        <View style={styles.bottomReturnPressableWrapper}>
          <Pressable
            style={({ pressed }) => [styles.bottomReturnPressable, { opacity: pressed ? 0.6 : 1 }]}
            onPress={() => setShowQueueModal(false)}
          >
            <Text style={styles.bottomReturnText}>关闭</Text>
          </Pressable>
        </View>
        <ClearOverlay
          showClearOverlay={showClearOverlay}
          toggleOverlay={toggleOverlay}
          clearQueue={clearQueue}
        />
      </SafeAreaView>
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
  flatListWrapper: {
    marginTop: 10 * HEIGHT_RATIO
  },
  returnPressableWrapper: {
    flexDirection: 'row',
    marginHorizontal: 15 * WIDTH_RATIO,
    justifyContent: 'center',
    alignItems: 'center'
  },
  returnPressable: {
    position: 'absolute',
    left: 0
  },
  clearPressable: {
    position: 'absolute',
    right: 0
  },
  playlistText: {
    fontSize: 16,
    lineHeight: 30 * WIDTH_RATIO,
    textAlign: 'center'
  },
  bottomReturnPressableWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 0.2,
    borderTopColor: Colors.grey1Trans
  },
  bottomReturnPressable: {
    flex: 1
  },
  bottomReturnText: {
    fontSize: 16,
    color: Colors.black1,
    fontWeight: '300',
    lineHeight: 40 * HEIGHT_RATIO,
    textAlignVertical: 'center',
    textAlign: 'center'
  }
})

export default QueueModal
