import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useMemo } from 'react'
import { WIDTH_RATIO, DEVICE_LOGIC_WIDTH, Colors } from '../../styles/Styles'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentTrack, setLoadChangeTrack } from '../../store/slices/playerSlice'
import TrackPlayer from 'react-native-track-player'
import { Icon } from '@rneui/themed'
import { getDisplayTitleText } from '../../utils/shared'

export const QUEUEITEM_HEIGHT = 60 * WIDTH_RATIO

const QueueItem = (props) => {
  const { track, index, onDeleteItem, itemPlaying } = props
  const dispatch = useDispatch()

  const onPressItem = async () => {
    try {
      const currentTrackIdx = await TrackPlayer.getCurrentTrack()
      if (index === currentTrackIdx) {
        await TrackPlayer.seekTo(0)
        await TrackPlayer.play()
      } else {
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)
        await TrackPlayer.skip(index)
        dispatch(setLoadChangeTrack(true))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const titleColor = itemPlaying ? Colors.pink1 : Colors.black1
  const artistColor = itemPlaying ? Colors.pink1 : Colors.grey2

  const titleText = getDisplayTitleText(track)

  return (
    <Pressable
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.6 : 1 }]}
      onPress={onPressItem}
    >
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {titleText}
        </Text>
        <Text style={[styles.artist, { color: artistColor }]}>
          {`${track.artist} - ${track.date}`}
        </Text>
      </View>
      <View>
        <Pressable onPress={() => onDeleteItem(track, index)}>
          <Icon type="ionicon" name="close-outline" size={18} color={Colors.grey2} />
        </Pressable>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: QUEUEITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEVICE_LOGIC_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 18 * WIDTH_RATIO
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: QUEUEITEM_HEIGHT,
    flex: 1
  },
  title: {
    color: Colors.black1,
    fontSize: 16,
    fontWeight: '400',
    flexShrink: 1,
    flexWrap: 'wrap'
  },
  artist: {
    color: Colors.grey2,
    fontSize: 13,
    fontWeight: '300'
  }
})

export default QueueItem
