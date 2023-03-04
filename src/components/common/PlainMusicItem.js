import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Colors, DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import { selectCurrentTrack, setCurrentTrack } from '../../store/slices/playerSlice'

export const MUSICITEM_HEIGHT = 60 * WIDTH_RATIO

const PlainMusicItem = (props) => {
  const { track, itemPlaying } = props
  const titleColor = itemPlaying ? Colors.pink1 : Colors.black1
  const artistColor = itemPlaying ? Colors.pink1 : Colors.grey2
  const dispatch = useDispatch()

  return (
    <Pressable style={({ pressed }) => [styles.container, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={styles.InfoWrapper}>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={[styles.artist, { color: artistColor }]}>
            {`${track.artist} - ${track.date}`}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: MUSICITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEVICE_LOGIC_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 20 * WIDTH_RATIO,
    backgroundColor: Colors.white1
  },
  InfoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  coverImage: {
    width: 50 * WIDTH_RATIO,
    height: 50 * WIDTH_RATIO,
    marginRight: 5 * WIDTH_RATIO,
    borderRadius: 6
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: MUSICITEM_HEIGHT
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

export default memo(PlainMusicItem)
