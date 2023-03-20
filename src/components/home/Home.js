import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, HEIGHT_RATIO, WIDTH_RATIO } from '../../styles/Styles'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useSelector, useDispatch } from 'react-redux'
import {
  setBottomPosition,
  selectCurrentTrack,
  setCurrentQueue,
  setOriginalQueue,
  setLoadChangeTrack,
  selectOriginalQueue
} from '../../store/slices/playerSlice'
import { getGreeting, searchMusicResultConvert } from '../../utils/shared'
import PlaylistCard from './PlaylistCard'
import MusicService from '../../services/music.service'
import MusicItem from '../common/MusicItem'
import Separator from '../common/Separator'
import {
  COLLECTION_TYPE,
  DEFAULT_COVER_NAME,
  HOME_PAGE_HEADER_ASSETS,
  HOME_PAGE_SIZE,
  SEARCH_ORDER
} from '../../constants/Shared'
import Footer from '../common/Footer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  setHeaderImageUrls,
  selectHeaderImageUrls,
  setDefaultCoverUrls,
  selectDefaultCoverUrls
} from '../../store/slices/assetSlice'
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player'
import MonthlyCard from './MonthlyCard'
import { selectPlaylistById, setPlaylistImageUri } from '../../store/slices/playlistSlice'

const Home = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight()
  const dispatch = useDispatch()
  const [greeting, setGreeting] = useState('')
  const [musicList, setMusicList] = useState([])
  const [page, setPage] = useState(0)
  const [totalNumMusic, setTotalNumMusic] = useState(0)
  const [musicListLoading, setMusicListLoading] = useState(false)
  const currentTrack = useSelector(selectCurrentTrack)
  const insets = useSafeAreaInsets()
  const headerImageUrls = useSelector(selectHeaderImageUrls)
  const playerState = usePlaybackState()
  const originalQueue = useSelector(selectOriginalQueue)
  const defaultCoverUrls = useSelector(selectDefaultCoverUrls)
  const [monthlyCollection, setMonthlyCollection] = useState([])
  const likedPlaylist = useSelector((state) => selectPlaylistById(state, 0))

  // 选择在主页面监听正在播放的歌曲，并对每个MusicItem执行函数得到它是否在播放
  // Instead of 在每个MusicItem内做监听
  const isItemPlaying = (track) => {
    if (currentTrack) return currentTrack.id === track.id
  }

  useEffect(() => {
    const greetingText = getGreeting()
    setGreeting(greetingText)
    getAssetsImage()
    getMonthlyCollection()
  }, [])

  useEffect(() => {
    getFirstPageMusic()
  }, [])

  useEffect(() => {
    if (tabBarHeight) {
      dispatch(setBottomPosition(tabBarHeight))
    }
  }, [tabBarHeight])

  const getFirstPageMusic = async () => {
    try {
      setMusicListLoading(true)
      const res = await MusicService.searchAllMusic(
        { page: 0, size: HOME_PAGE_SIZE },
        SEARCH_ORDER.DateNewToOld
      )
      const convertedMusic = searchMusicResultConvert(res.items)
      setPage(res.pageable.page)
      setTotalNumMusic(res.pageable.total)
      setMusicList(convertedMusic)
      setMusicListLoading(false)
    } catch (e) {
      console.log('some error in getting first page music', e)
    }
  }

  // FlatList触底时触发
  // First check是否为最后一页，如是则return
  // fetch下一页的music并更新state
  const getNextPageMusic = async () => {
    try {
      if ((page + 1) * HOME_PAGE_SIZE >= totalNumMusic) return
      setMusicListLoading(true)
      const res = await MusicService.searchAllMusic(
        { page: page + 1, size: HOME_PAGE_SIZE },
        SEARCH_ORDER.DateNewToOld
      )
      const convertedMusic = searchMusicResultConvert(res.items)
      setPage(res.pageable.page)
      setTotalNumMusic(res.pageable.total)
      setMusicList([...musicList, ...convertedMusic])
      setMusicListLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  const getAssetsImage = async () => {
    try {
      const res = await MusicService.fetchConfigImage(
        HOME_PAGE_HEADER_ASSETS.concat(DEFAULT_COVER_NAME)
      )
      const urls = res.map((value) => value.url)
      const headerUrls = urls.slice(0, HOME_PAGE_HEADER_ASSETS.length)
      const coverUrls = urls.slice(HOME_PAGE_HEADER_ASSETS.length)
      dispatch(setHeaderImageUrls([...headerUrls]))
      dispatch(setDefaultCoverUrls([...coverUrls]))
      dispatch(setPlaylistImageUri({ id: 0, newImageUri: headerUrls[0] }))
    } catch (e) {
      console.log('获取主页头图失败', e)
    }
  }

  const getMonthlyCollection = async () => {
    try {
      const res = await MusicService.fetchMonthlyCollection()
      setMonthlyCollection(res)
    } catch (e) {
      console.log('获取月度合集信息失败', e)
    }
  }

  const onPressItem = async (track) => {
    try {
      let playerQueue = await TrackPlayer.getQueue()
      const idx = playerQueue.findIndex((element) => element.id === track.id)
      const currentTrackIdx = await TrackPlayer.getCurrentTrack()

      // 当前队列中没有歌曲
      if (playerQueue.length === 0) {
        await TrackPlayer.add(track)
        dispatch(setLoadChangeTrack(true))
        playerQueue = await TrackPlayer.getQueue()
        dispatch(setCurrentQueue([...playerQueue]))
        dispatch(setOriginalQueue([track, ...originalQueue]))
        return
      }

      if (idx === -1) {
        // 当前播放列表中没有此歌曲
        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)

        await TrackPlayer.add(track, 0)
        await TrackPlayer.skip(0)
        dispatch(setLoadChangeTrack(true))

        playerQueue = await TrackPlayer.getQueue()
        dispatch(setCurrentQueue([...playerQueue]))
        dispatch(setOriginalQueue([track, ...originalQueue]))
      } else if (idx === currentTrackIdx) {
        await TrackPlayer.seekTo(0)
        if (playerState !== State.Playing) {
          await TrackPlayer.play()
        }
      } else {
        // 当前播放列表中已有此歌曲，且此歌曲未在播放
        const length = playerQueue.length
        while (playerQueue.length !== length - 1) {
          playerQueue.forEach(async (value, index) => {
            if (value.id === track.id) {
              await TrackPlayer.remove(index)
            }
          })
          playerQueue = await TrackPlayer.getQueue()
        }

        await TrackPlayer.pause()
        await TrackPlayer.seekTo(0)

        await TrackPlayer.add(track, 0)
        await TrackPlayer.skip(0)
        dispatch(setLoadChangeTrack(true))

        playerQueue = await TrackPlayer.getQueue()
        dispatch(setCurrentQueue([...playerQueue]))
        dispatch(setOriginalQueue([track, ...originalQueue.filter((item) => item.id !== track.id)]))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const renderMusicItem = ({ item }) => (
    <MusicItem
      track={item}
      itemPlaying={isItemPlaying(item)}
      onPressItem={onPressItem}
      defaultCoverUrls={defaultCoverUrls}
    />
  )

  const renderMonthlyCard = ({ item }) => (
    <MonthlyCard
      name={item.name}
      coverSource={item.coverPath}
      onPress={() =>
        navigation.navigate('Collection', {
          type: COLLECTION_TYPE.Month,
          label: item.searchLabel,
          title: item.name,
          description: item.description,
          headerImageUrl: item.coverPath
        })
      }
    />
  )
  const monthlyCardSeperator = () => <View style={{ width: 20 * WIDTH_RATIO }}></View>

  const listHeaderComponent = (
    <View style={[styles.listHeaderContainer, { paddingTop: insets.top + 20 * WIDTH_RATIO }]}>
      <Text style={styles.greetingText}>{greeting}</Text>
      <View style={styles.playlistCardsWrapper}>
        <View style={styles.playlistCardsSubWrapper}>
          <PlaylistCard
            title={'已收藏的歌曲'}
            cardImage={headerImageUrls && headerImageUrls.length ? headerImageUrls[0] : ''}
            onPress={() =>
              navigation.navigate('音乐库', {
                screen: 'Playlist',
                params: {
                  playlistId: likedPlaylist.id,
                  headerImageUri: likedPlaylist.imageUri,
                  name: likedPlaylist.name
                }
              })
            }
          />
          <PlaylistCard
            title={'莞儿'}
            cardImage={headerImageUrls && headerImageUrls.length ? headerImageUrls[1] : ''}
            onPress={() =>
              navigation.navigate('Collection', {
                type: COLLECTION_TYPE.Singer,
                label: '莞儿',
                title: '莞儿',
                headerImageUrl: headerImageUrls && headerImageUrls.length ? headerImageUrls[1] : ''
              })
            }
          />
        </View>
        <View style={[styles.playlistCardsSubWrapper, { marginTop: 6 }]}>
          <PlaylistCard
            title={'露早'}
            cardImage={headerImageUrls && headerImageUrls.length ? headerImageUrls[2] : ''}
            onPress={() =>
              navigation.navigate('Collection', {
                type: COLLECTION_TYPE.Singer,
                label: '露早',
                title: '露早',
                headerImageUrl: headerImageUrls && headerImageUrls.length ? headerImageUrls[2] : ''
              })
            }
          />
          <PlaylistCard
            title={'米诺'}
            cardImage={headerImageUrls && headerImageUrls.length ? headerImageUrls[3] : ''}
            onPress={() =>
              navigation.navigate('Collection', {
                type: COLLECTION_TYPE.Singer,
                label: '米诺',
                title: '米诺',
                headerImageUrl: headerImageUrls && headerImageUrls.length ? headerImageUrls[3] : ''
              })
            }
          />
        </View>
        <View style={[styles.playlistCardsSubWrapper, { marginTop: 6 }]}>
          <PlaylistCard
            title={'虞莫'}
            cardImage={headerImageUrls && headerImageUrls.length ? headerImageUrls[4] : ''}
            onPress={() =>
              navigation.navigate('Collection', {
                type: COLLECTION_TYPE.Singer,
                label: '虞莫',
                title: '虞莫',
                headerImageUrl: headerImageUrls && headerImageUrls.length ? headerImageUrls[4] : ''
              })
            }
          />
          <PlaylistCard
            title={'柚恩'}
            cardImage={headerImageUrls && headerImageUrls.length ? headerImageUrls[5] : ''}
            onPress={() =>
              navigation.navigate('Collection', {
                type: COLLECTION_TYPE.Singer,
                label: '柚恩',
                title: '柚恩',
                headerImageUrl: headerImageUrls && headerImageUrls.length ? headerImageUrls[5] : ''
              })
            }
          />
        </View>
      </View>
      <Text style={styles.musicListTitle}>月度合集</Text>
      <FlatList
        data={monthlyCollection}
        renderItem={renderMonthlyCard}
        horizontal
        ItemSeparatorComponent={monthlyCardSeperator}
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.musicListTitle}>歌曲列表</Text>
    </View>
  )

  return (
    <FlatList
      data={musicList}
      renderItem={renderMusicItem}
      ListHeaderComponent={listHeaderComponent}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={<Footer />}
      onEndReached={getNextPageMusic}
      refreshing={musicListLoading}
      initialNumToRender={7}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white1,
    paddingHorizontal: 20 * HEIGHT_RATIO
  },
  listHeaderContainer: {
    flex: 1,
    backgroundColor: Colors.white1,
    display: 'flex',
    paddingHorizontal: 20 * WIDTH_RATIO
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black1
  },
  playlistCardsWrapper: {
    display: 'flex',
    marginTop: 20 * WIDTH_RATIO
  },
  playlistCardsSubWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  musicListTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: Colors.black1
  }
})

export default Home
