import { View, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Colors, WIDTH_RATIO } from '../styles/Styles'

const StartScreen = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/images/logo.png')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 220 * WIDTH_RATIO,
    height: 220 * WIDTH_RATIO
  }
})

export default StartScreen
