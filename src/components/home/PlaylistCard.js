import { Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Colors, WIDTH_RATIO } from '../../styles/Styles'
import FastImage from 'react-native-fast-image'

const PlaylistCard = (props) => {
  const { title, cardImage, onPress } = props
  return (
    <Pressable style={styles.pressable} onPress={onPress}>
      <FastImage source={{ uri: cardImage }} style={styles.cardImage} />
      <Text style={styles.cardText}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: Colors.lightgrey1,
    width: 172 * WIDTH_RATIO,
    height: 52 * WIDTH_RATIO,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.lightgrey2
  },
  cardImage: {
    width: 50 * WIDTH_RATIO,
    height: 50 * WIDTH_RATIO,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6
  },
  cardText: {
    marginLeft: 5 * WIDTH_RATIO,
    fontWeight: '500',
    color: Colors.black1
  }
})

export default PlaylistCard
