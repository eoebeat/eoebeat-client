import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { WIDTH_RATIO } from '../../styles/Styles'

const MonthlyCard = (props) => {
  const { name, coverSource, onPress } = props

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Image source={{ uri: coverSource }} style={styles.imageCover} />
      </Pressable>
      <Text style={styles.name}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageCover: {
    width: 120 * WIDTH_RATIO,
    height: 120 * WIDTH_RATIO,
    borderRadius: 6
  },
  name: {
    marginTop: 6 * WIDTH_RATIO,
    fontSize: 15,
    fontWeight: '300'
  }
})

export default MonthlyCard
