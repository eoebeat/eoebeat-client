import { Dimensions } from 'react-native'

export const Colors = {
  white1: '#F7F7F7',
  white1Transparent: 'rgba(247, 247, 247, 0.9)',
  black1: '#030303',
  black1Transparent: 'rgba(3,3,3,0.5)',
  pink1: '#d36baa',
  grey1: '#afb0b3',
  grey2: '#7b7b7b',
  lightgrey1: '#f4f4f4',
  lightgrey2: '#e7e7e7',
  grey1Trans: 'rgba(92, 91, 91, 0.36)',
  blue1: '#017afe'
}

// 设备逻辑宽高
export const DEVICE_LOGIC_WIDTH = Dimensions.get('window').width
export const DEVICE_LOGIC_HEIGHT = Dimensions.get('window').height

// UI图宽高
const UI_SKETCH_WIDTH = 390
const UI_SKETCH_HEIGHT = 844

// 宽高缩放比例
export const WIDTH_RATIO = DEVICE_LOGIC_WIDTH / UI_SKETCH_WIDTH
export const HEIGHT_RATIO = DEVICE_LOGIC_HEIGHT / UI_SKETCH_HEIGHT
