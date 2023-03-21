import { View } from 'react-native'
import React from 'react'
import { HEIGHT_RATIO, Colors } from '../../styles/Styles'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

const ExtendedFooter = () => {
  const tabBarHeight = useBottomTabBarHeight()
  return (
    <View
      style={{ height: 300 * HEIGHT_RATIO + tabBarHeight, backgroundColor: Colors.white1 }}
    ></View>
  )
}

export default ExtendedFooter
