import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { memo } from 'react'
import { Colors, DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import { getDisplayTitleText } from '../../utils/shared'

export const PLAIN_MUSICITEM_HEIGHT = 60 * WIDTH_RATIO

const PlainMusicItem = (props) => {
  const { track, itemPlaying, onPressItem } = props
  const titleColor = itemPlaying ? Colors.pink1 : Colors.black1
  const artistColor = itemPlaying ? Colors.pink1 : Colors.grey2

  const titleText = getDisplayTitleText(track)

  return (
    <Pressable
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.6 : 1 }]}
      onPress={() => onPressItem(track)}
    >
      <View style={styles.InfoWrapper}>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {titleText}
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
    height: PLAIN_MUSICITEM_HEIGHT,
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
    height: PLAIN_MUSICITEM_HEIGHT,
    paddingVertical: 3 * WIDTH_RATIO,
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

export default memo(PlainMusicItem)
