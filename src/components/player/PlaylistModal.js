import { View, Text, Modal, StyleSheet, Pressable, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context'
import { Colors, DEVICE_LOGIC_HEIGHT, HEIGHT_RATIO, WIDTH_RATIO } from '../../styles/Styles'
import { Icon } from '@rneui/themed'
import { useSelector } from 'react-redux'
import { selectCurrentQueue } from '../../store/slices/playerSlice'
import QueueItem, { QUEUEITEM_HEIGHT } from '../common/QueueItem'
import Separator from '../common/Separator'

const PlaylistModal = (props) => {
  const { showPlaylistModal, setShowPlaylistModal, currentTrackIdx } = props
  const currentQueue = useSelector(selectCurrentQueue)

  // FlatList的高度应该是设备逻辑高度 - (顶部SafeArea + 底部SafeArea) - (顶部返回图标高度 + 顶部返回marginTop + FlatList marginTop + 底部返回图标高度)
  const flatListHeight =
    DEVICE_LOGIC_HEIGHT -
    (initialWindowMetrics.insets.top + initialWindowMetrics.insets.bottom) -
    (30 * WIDTH_RATIO + 10 * HEIGHT_RATIO + 10 * HEIGHT_RATIO + 40 * HEIGHT_RATIO)

  return (
    <Modal animationType="fade" visible={showPlaylistModal}>
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
            <Pressable style={styles.returnPressable} onPress={() => setShowPlaylistModal(false)}>
              <Icon type="ionicon" name="close" size={28 * WIDTH_RATIO} color={Colors.black1} />
            </Pressable>
            <Text style={styles.playlistText}>播放列表</Text>
          </View>
          <View style={styles.flatListWrapper}>
            <FlatList
              data={currentQueue}
              renderItem={({ item, index, separators }) => <QueueItem track={item} index={index} />}
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
            onPress={() => setShowPlaylistModal(false)}
          >
            <Text style={styles.bottomReturnText}>关闭</Text>
          </Pressable>
        </View>
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
    justifyContent: 'center'
  },
  returnPressable: {
    position: 'absolute',
    left: 0
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

export default PlaylistModal
