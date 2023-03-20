import { Pressable } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Styles'

const BackPressable = () => {
  const navigation = useNavigation()
  return (
    <Pressable
      onPress={() => {
        navigation.goBack()
      }}
    >
      <Icon type="feather" name="chevron-left" color={Colors.black1} size={26} />
    </Pressable>
  )
}

export default BackPressable
