import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useMemo } from 'react'
import { WIDTH_RATIO, DEVICE_LOGIC_WIDTH, Colors } from '../../styles/Styles'
import { useSelector } from 'react-redux'
import { selectCurrentTrack } from '../../store/slices/playerSlice'
import TrackPlayer from 'react-native-track-player'

export const QUEUEITEM_HEIGHT = 60 * WIDTH_RATIO

const QueueItem = (props) => {
  const { track, index } = props
  const currentTrack = useSelector(selectCurrentTrack)
  const itemPlaying = useMemo(() => {
    if (currentTrack) return currentTrack.id === track.id
    return false
  }, [currentTrack])

  const onPressItem = async () => {
    try {
      await TrackPlayer.skip(index)
      await TrackPlayer.play()
    } catch (e) {
      console.log(e)
    }
  }

  const titleColor = itemPlaying ? Colors.pink1 : Colors.black1
  const artistColor = itemPlaying ? Colors.pink1 : Colors.grey2

  return (
    <Pressable
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.6 : 1 }]}
      onPress={onPressItem}
    >
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: titleColor }]}>{track.title}</Text>
        <Text style={[styles.artist, { color: artistColor }]}>
          {`${track.artist} - ${track.date}`}
        </Text>
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
    alignItems: 'center'
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 18 * WIDTH_RATIO,
    justifyContent: 'space-evenly',
    height: QUEUEITEM_HEIGHT
  },
  title: {
    color: Colors.black1,
    fontSize: 16,
    fontWeight: '400'
  },
  artist: {
    color: Colors.grey2,
    fontSize: 13,
    fontWeight: '300'
  }
})

export default QueueItem
