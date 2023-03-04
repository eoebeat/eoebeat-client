import { View, Image, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view'

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55
const MAX_HEIGHT = 330

const Cover = (props) => {
  const { label } = props

  return (
    <ImageHeaderScrollView
      maxHeight={MAX_HEIGHT * WIDTH_RATIO}
      minHeight={MIN_HEIGHT * WIDTH_RATIO}
      renderHeader={() => (
        <Image
          source={require('../../../assets/cover/莞儿角色卡.png')}
          style={styles.image}
          resizeMode={'cover'}
        />
      )}
    >
      <TriggeringView></TriggeringView>
    </ImageHeaderScrollView>
  )
}

const styles = StyleSheet.create({
  image: {
    width: DEVICE_LOGIC_WIDTH,
    height: MAX_HEIGHT * WIDTH_RATIO
  }
})

export default Cover
