import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Separator from '../common/Separator'
import Footer from '../common/Footer'
import { useSelector } from 'react-redux'
import { selectCurrentTrack } from '../../store/slices/playerSlice'
import PlainMusicItem from '../common/PlainMusicItem'
// import { onScroll } from 'react-native-redash'

const Content = (props) => {
  const { musicList, y, getNextPageMusic } = props
  const currentTrack = useSelector(selectCurrentTrack)

  // 选择在主页面监听正在播放的歌曲，并对每个MusicItem执行函数得到它是否在播放
  // Instead of 在每个MusicItem内做监听
  const isItemPlaying = (track) => {
    if (currentTrack) return currentTrack.id === track.id
  }

  const renderItem = ({ item }) => <PlainMusicItem track={item} itemPlaying={isItemPlaying(item)} />

  return (
    <FlatList
      data={musicList}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={<Footer />}
      onEndReached={getNextPageMusic}
    />
  )
}

export default Content
