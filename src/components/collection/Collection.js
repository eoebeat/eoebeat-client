import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
  ImageBackground,
  Platform
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { COLLECTION_TYPE, COLLECTION_PAGE_SIZE, SEARCH_ORDER } from '../../constants/Shared'
import MusicService from '../../services/music.service'
import { searchMusicResultConvert } from '../../utils/shared'
import { Colors } from '../../styles/Styles'
import ImageHeaderScrollView, { TriggeringView } from 'react-native-image-header-scroll-view'
import { DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import PlainMusicItem from '../common/PlainMusicItem'
import { useSelector } from 'react-redux'
import { selectCurrentTrack } from '../../store/slices/playerSlice'
import Separator from '../common/Separator'
import Footer from '../common/Footer'
import { useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context'
import { Icon } from '@rneui/themed'
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable'

const MIN_HEIGHT = Platform.OS === 'ios' ? 100 : 65
const MAX_HEIGHT = 330

const Collection = ({ route, navigation }) => {
  const { type, label } = route.params
  const [musicList, setMusicList] = useState([])
  const [page, setPage] = useState(0)
  const [totalNumMusic, setTotalNumMusic] = useState(0)
  const isItemPlaying = (track) => {
    if (currentTrack) return currentTrack.id === track.id
  }
  const currentTrack = useSelector(selectCurrentTrack)
  const insets = useSafeAreaInsets()
  const navTitleView = useRef(null)
  const backBtnView = useRef(null)
  const [searchOrder, setSearchOrder] = useState(SEARCH_ORDER.DateNewToOld)

  useEffect(() => {
    getFirstPageMusic()
  }, [])

  useEffect(() => {
    getFirstPageMusic()
  }, [searchOrder])

  const getFirstPageMusic = async () => {
    try {
      let res
      if (type === COLLECTION_TYPE.Singer) {
        res = await MusicService.searchMusic(
          label,
          { page: 0, size: COLLECTION_PAGE_SIZE },
          searchOrder
        )
      } else {
        res = await MusicService.fetchMusicInMonth(
          label,
          { page: 0, size: COLLECTION_PAGE_SIZE },
          searchOrder
        )
      }
      const convertedMusic = searchMusicResultConvert(res.items)
      setPage(res.pageable.page)
      setTotalNumMusic(res.pageable.total)
      setMusicList(convertedMusic)
    } catch (e) {
      console.log(e)
    }
  }

  // FlatList触底时触发
  // First check是否为最后一页，如是则return
  // fetch下一页的music并更新state
  const getNextPageMusic = async () => {
    try {
      if ((page + 1) * COLLECTION_PAGE_SIZE >= totalNumMusic) return
      let res
      if (type === COLLECTION_TYPE.Singer) {
        res = await MusicService.searchMusic(
          label,
          { page: page + 1, size: COLLECTION_PAGE_SIZE },
          searchOrder
        )
      } else {
        res = await MusicService.fetchMusicInMonth(
          label,
          { page: page + 1, size: COLLECTION_PAGE_SIZE },
          searchOrder
        )
      }
      const convertedMusic = searchMusicResultConvert(res.items)
      setPage(res.pageable.page)
      setTotalNumMusic(res.pageable.total)
      setMusicList([...musicList, ...convertedMusic])
    } catch (e) {
      console.log(e)
    }
  }

  const toggleSearchOrder = () => {
    if (searchOrder === SEARCH_ORDER.DateNewToOld) {
      setSearchOrder(SEARCH_ORDER.Hitcount)
    } else {
      setSearchOrder(SEARCH_ORDER.DateNewToOld)
    }
  }

  const renderItem = ({ item }) => <PlainMusicItem track={item} itemPlaying={isItemPlaying(item)} />
  const listHeader = () => (
    <View style={styles.listHeaderWrapper}>
      <View style={styles.listHeaderTextWrapper}>
        <Pressable
          style={({ pressed }) => [styles.listHeaderSearchOrderBtn, { opacity: pressed ? 0.6 : 1 }]}
          onPress={toggleSearchOrder}
        >
          <Text style={styles.listHeaderSearchOrderText}>
            {searchOrder === SEARCH_ORDER.DateNewToOld ? '最新' : '热门'}
          </Text>
          <Icon type="ionicon" name="caret-down" size={16} color={Colors.grey2} />
        </Pressable>
      </View>
      <View style={styles.listHeaderBtnWrapper}>
        <Pressable
          style={({ pressed }) => ({
            marginRight: 10 * WIDTH_RATIO,
            opacity: pressed ? 0.6 : 1
          })}
        >
          <Icon type="player" name="shuffle" size={28 * WIDTH_RATIO} color={Colors.grey2} />
        </Pressable>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1
          })}
        >
          <Icon type="ionicon" name="play-circle" size={40 * WIDTH_RATIO} color={Colors.pink1} />
        </Pressable>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} translucent={true} />
      <ImageHeaderScrollView
        maxHeight={MAX_HEIGHT * WIDTH_RATIO}
        minHeight={MIN_HEIGHT * WIDTH_RATIO}
        renderHeader={() => (
          <ImageBackground
            source={require('../../../assets/cover/莞儿角色卡.png')}
            style={styles.headerImage}
            resizeMode={'cover'}
          >
            <LinearGradient
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.7 }}
              end={{ x: 0, y: 1 }}
              colors={['#00000000', Colors.black1Transparent]}
            ></LinearGradient>
          </ImageBackground>
        )}
        renderForeground={() => (
          <View style={[styles.foregroundWrapper, { marginTop: insets.top }]}>
            <TriggeringView
              onHide={() => {
                navTitleView.current.fadeInUp(200)
                backBtnView.current.fadeOut(200)
              }}
              onDisplay={() => {
                navTitleView.current.fadeOut(400)
                backBtnView.current.fadeIn(400)
              }}
            >
              <Text style={styles.foregroundTitle}>{label}</Text>
            </TriggeringView>
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View
            ref={navTitleView}
            style={[styles.navTitleView, { top: initialWindowMetrics.insets.top + 4 }]}
          >
            <Pressable
              style={[
                {
                  position: 'absolute',
                  left: 20 * WIDTH_RATIO
                },
                Platform.OS === 'android' && { top: 1 }
              ]}
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Icon type="feather" name="chevron-left" color={Colors.white1} size={26} />
            </Pressable>
            <Text style={styles.navTitle}>{label}</Text>
          </Animatable.View>
        )}
        ScrollViewComponent={FlatList}
        data={musicList}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={<Footer />}
        ListHeaderComponent={listHeader}
        onEndReached={getNextPageMusic}
      ></ImageHeaderScrollView>
      <Animatable.View
        ref={backBtnView}
        style={[
          styles.foregroundReturnWrapper,
          { top: initialWindowMetrics.insets.top + 4, left: 20 * WIDTH_RATIO }
        ]}
      >
        <Pressable
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Icon type="feather" name="chevron-left" color={Colors.white1} size={26} />
        </Pressable>
      </Animatable.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white1
  },
  headerImage: {
    width: DEVICE_LOGIC_WIDTH,
    height: MAX_HEIGHT * WIDTH_RATIO
  },
  foregroundWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 20 * WIDTH_RATIO
  },
  foregroundReturnWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center'
  },
  foregroundTitle: {
    fontSize: 50,
    color: Colors.white1,
    fontWeight: '700'
  },
  navTitleView: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    width: DEVICE_LOGIC_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0
  },
  navTitle: {
    color: Colors.white1,
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: '600'
  },
  listHeaderWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * WIDTH_RATIO,
    backgroundColor: Colors.white1,
    paddingTop: 6 * WIDTH_RATIO
  },
  listHeaderBtnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listHeaderTextWrapper: {
    justifyContent: 'center'
  },
  listHeaderText: {
    fontWeight: '300',
    color: '#24ade4'
  },
  listHeaderSearchOrderBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  listHeaderSearchOrderText: {
    color: Colors.grey2,
    fontWeight: '300'
  }
})

export default Collection
