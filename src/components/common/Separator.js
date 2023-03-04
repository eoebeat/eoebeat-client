import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '../../styles/Styles'

const Separator = () => {
  return (
    <View
      style={{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey1Trans
      }}
    ></View>
  )
}

export default Separator
