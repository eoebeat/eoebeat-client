import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Overlay } from '@rneui/themed'
import { Colors, WIDTH_RATIO } from '../../styles/Styles'

const DeleteOverlay = (props) => {
  const { showDeleteOverlay, toggleOverlay, clearSearchHistory } = props
  return (
    <Overlay isVisible={showDeleteOverlay} overlayStyle={styles.overlay}>
      <Text style={styles.title}>确认删除全部历史记录？</Text>
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
          onPress={clearSearchHistory}
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
    paddingVertical: 10,
    color: Colors.blue1
  },
  cancelText: {
    fontWeight: '500'
  },
  confirmText: {
    fontWeight: '300'
  }
})

export default DeleteOverlay
