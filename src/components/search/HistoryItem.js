import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Colors, WIDTH_RATIO } from '../../styles/Styles'

const HistoryItem = (props) => {
  const { searchText, onPress } = props
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.itemWrapper, { opacity: pressed ? 0.6 : 1 }]}
    >
      <Text style={styles.searchText}>{searchText}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: Colors.lightgrey2,
    height: 26 * WIDTH_RATIO,
    justifyContent: 'center',
    borderRadius: 6,
    marginRight: 10 * WIDTH_RATIO,
    marginBottom: 10 * WIDTH_RATIO
  },
  searchText: {
    paddingHorizontal: 12 * WIDTH_RATIO,
    fontWeight: '300'
  }
})
export default HistoryItem
