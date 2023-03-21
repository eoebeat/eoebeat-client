import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Colors, DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import FastImage from 'react-native-fast-image'

const PLAYLIST_ITEM_HEIGHT = 70 * WIDTH_RATIO

const PlaylistItem = (props) => {
  const { imageUri, name, onPress } = props
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.6 : 1 }]}
    >
      <FastImage source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: PLAYLIST_ITEM_HEIGHT,
    flexDirection: 'row',
    width: DEVICE_LOGIC_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 20 * WIDTH_RATIO,
    backgroundColor: Colors.white1
  },
  image: {
    width: PLAYLIST_ITEM_HEIGHT,
    height: PLAYLIST_ITEM_HEIGHT,
    borderRadius: 6
  },
  name: {
    fontSize: 16,
    color: Colors.black1,
    marginLeft: 10 * WIDTH_RATIO
  }
})

export default PlaylistItem
