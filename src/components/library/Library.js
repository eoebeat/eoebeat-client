import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Colors, WIDTH_RATIO } from '../../styles/Styles'
import { useSelector } from 'react-redux'
import { selectAllPlaylists } from '../../store/slices/playlistSlice'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'
import PlaylistItem from './PlaylistItem'
import Footer from '../common/Footer'
import { Dialog, Icon } from '@rneui/themed'

const Library = ({ navigation }) => {
  const playlists = useSelector(selectAllPlaylists)

  const insets = useSafeAreaInsets()
  const [dialogVisible, setDialogVisible] = useState(false)

  const toggleDialogVisible = () => {
    setDialogVisible(!dialogVisible)
  }

  const onPressPlaylistItem = (playlistInfo) => {
    navigation.navigate('Playlist', {
      playlistId: playlistInfo.id,
      headerImageUri: playlistInfo.imageUri,
      name: playlistInfo.name
    })
  }

  const renderPlaylistItem = ({ item }) => (
    <PlaylistItem
      imageUri={item.imageUri}
      name={item.name}
      onPress={() => onPressPlaylistItem(item)}
    />
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 * WIDTH_RATIO }]}>
      <View style={styles.headerWrapper}>
        <View style={styles.leftHeaderWrapper}>
          <Pressable onPress={toggleDialogVisible}>
            <FastImage
              source={require('../../../assets/images/defaultAvatar.png')}
              style={styles.avatar}
            />
          </Pressable>
          <Text style={styles.title}>音乐库</Text>
        </View>
        <View>
          <Pressable
            onPress={() => {
              navigation.navigate('Setting')
            }}
          >
            <Icon type="ionicon" name="settings-outline" color={Colors.black1} />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        ListFooterComponent={<Footer />}
        showsVerticalScrollIndicator={false}
      />
      <Dialog isVisible={dialogVisible} onBackdropPress={toggleDialogVisible}>
        <Text>登录功能暂未开放，敬请期待</Text>
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white1,
    flex: 1
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * WIDTH_RATIO,
    paddingBottom: 20 * WIDTH_RATIO,
    alignItems: 'center'
  },
  leftHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  avatar: {
    width: 40 * WIDTH_RATIO,
    height: 40 * WIDTH_RATIO,
    borderRadius: 50
  },
  title: {
    color: Colors.black1,
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 10 * WIDTH_RATIO
  }
})

export default Library
