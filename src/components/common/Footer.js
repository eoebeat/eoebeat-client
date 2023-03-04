import { View } from 'react-native'
import React from 'react'
import { HEIGHT_RATIO, Colors } from '../../styles/Styles'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

const Footer = () => {
  const tabBarHeight = useBottomTabBarHeight()
  return (
    <View
      style={{ height: 58 * HEIGHT_RATIO + tabBarHeight, backgroundColor: Colors.white1 }}
    ></View>
  )
}

export default Footer
