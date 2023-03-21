import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Overlay } from '@rneui/themed'
import { Colors, WIDTH_RATIO } from '../../styles/Styles'

const SettingOverlay = (props) => {
  const {
    showSettingOverlay,
    toggleOverlay,
    overlayTitle,
    overlayDescription,
    onPressOverlayConfirm
  } = props
  return (
    <Overlay isVisible={showSettingOverlay} overlayStyle={styles.overlay}>
      <Text style={styles.title}>{overlayTitle}</Text>
      {overlayDescription && <Text style={styles.overlayDescription}>{overlayDescription}</Text>}
      <View style={styles.pressablesWrapper}>
        <Pressable
          onPress={toggleOverlay}
          style={({ pressed }) => [
            styles.pressable,
            styles.cancelPressable,
            { opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Text style={[styles.pressableText, styles.cancelText]}>取消</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.6 : 1 }]}
          onPress={onPressOverlayConfirm}
        >
          <Text style={[styles.pressableText, styles.confirmText]}>确认</Text>
        </Pressable>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  overlay: {
    borderRadius: 10,
    padding: 0,
    width: 280 * WIDTH_RATIO
  },
  title: {
    textAlign: 'center',
    marginVertical: 20 * WIDTH_RATIO,
    fontSize: 16,
    fontWeight: '500'
  },
  pressablesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.grey1
  },
  pressable: {
    flex: 1
  },
  cancelPressable: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: Colors.grey1
  },
  pressableText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10 * WIDTH_RATIO
  },
  cancelText: {
    fontWeight: '400',
    color: Colors.black1
  },
  confirmText: {
    fontWeight: '400',
    color: Colors.pink1
  },
  overlayDescription: {
    paddingHorizontal: 20 * WIDTH_RATIO,
    paddingBottom: 20 * WIDTH_RATIO
  }
})

export default SettingOverlay
