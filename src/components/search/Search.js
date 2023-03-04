import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Colors, HEIGHT_RATIO, WIDTH_RATIO } from '../../styles/Styles'
import { Icon } from '@rneui/themed'
import MusicService from '../../services/music.service'
import { searchMusicResultConvert } from '../../utils/shared'
import MusicItem from '../common/MusicItem'
import { selectCurrentTrack } from '../../store/slices/playerSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import Separator from '../common/Separator'
import { setSearchHistory, selectSearchHistory } from '../../store/slices/searchSlice'
import HistoryItem from './HistoryItem'
import DeleteOverlay from './DeleteOverlay'
import Footer from '../common/Footer'
import { SEARCH_ORDER } from '../../constants/Shared'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const NUM_HISTORYITEM = 10

const Search = () => {
  const [musicList, setMusicList] = useState([])
  const [page, setPage] = useState(0)
  const [totalNumMusic, setTotalNumMusic] = useState(0)
  const PAGE_SIZE = 20
  const currentTrack = useSelector(selectCurrentTrack)
  const tabBarHeight = useBottomTabBarHeight()
  const [musicListLoading, setMusicListLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [showNoResultText, setShowNoResultText] = useState(false)
  const dispatch = useDispatch()
  const searchHistory = useSelector(selectSearchHistory)
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false)
  const insets = useSafeAreaInsets()

  const isItemPlaying = (track) => {
    if (currentTrack) return currentTrack.id === track.id
  }

  const showSearchHistoryModule = useMemo(() => {
    return searchHistory.length !== 0
  }, [searchHistory])

  // 搜索页的搜索全部按照 Hitcount 排序
  const handleSubmit = async (value) => {
    if (!value) return
    try {
      const res = await MusicService.searchMusic(
        value,
        { page: 0, size: PAGE_SIZE },
        SEARCH_ORDER.Hitcount
      )

      const valueIdx = searchHistory.findIndex((element) => element === value)
      const tempArray = [...searchHistory]
      if (valueIdx !== -1) {
        // 在当前history中删除搜索值
        tempArray.splice(valueIdx, 1)
      } else if (tempArray.length === NUM_HISTORYITEM) {
        // history达到上限，删除最后一个
        tempArray.splice(tempArray.length - 1, 1)
      }
      // 将当前搜索值放在history第一位
      tempArray.splice(0, 0, value)
      dispatch(setSearchHistory(tempArray))

      if (res.items.length === 0) {
        setShowNoResultText(true)
        setMusicList([])
      } else {
        const convertedMusic = searchMusicResultConvert(res.items)
        setShowNoResultText(false)
        setMusicList(convertedMusic)
      }
      setPage(res.pageable.page)
      setTotalNumMusic(res.pageable.total)
    } catch (e) {
      console.log(e)
    }
  }

  const getNextPageMusic = async () => {
    if ((page + 1) * PAGE_SIZE >= totalNumMusic) return
    try {
      setMusicListLoading(true)
      const res = await MusicService.searchMusic(
        searchValue,
        {
          page: page + 1,
          size: PAGE_SIZE
        },
        SEARCH_ORDER.Hitcount
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

  const handleClearSearchValue = () => {
    setSearchValue('')
    setMusicList([])
  }

  const handleHistoryItemPress = async (value) => {
    setSearchValue(value)
    try {
      const res = await MusicService.searchMusic(
        value,
        { page: 0, size: PAGE_SIZE },
        SEARCH_ORDER.Hitcount
      )

      const valueIdx = searchHistory.findIndex((element) => element === value)
      const tempArray = [...searchHistory]
      tempArray.splice(valueIdx, 1)
      dispatch(setSearchHistory([value, ...tempArray]))

      if (res.items.length === 0) {
        setShowNoResultText(true)
        setMusicList([])
      } else {
        const convertedMusic = searchMusicResultConvert(res.items)
        setShowNoResultText(false)
        setMusicList(convertedMusic)
      }
      setPage(res.pageable.page)
      setTotalNumMusic(res.pageable.total)
    } catch (e) {
      console.log(e)
    }
  }

  const toggleOverlay = () => {
    setShowDeleteOverlay(!showDeleteOverlay)
  }

  const clearSearchHistory = () => {
    dispatch(setSearchHistory([]))
    toggleOverlay()
  }

  const SearchHistoryModule = () => (
    <View style={styles.searchHistoryWrapper}>
      <View style={styles.searchHistoryTitleRowWrapper}>
        <Text style={styles.searchHistoryTitle}>搜索历史</Text>
        <Pressable
          style={({ pressed }) => [styles.clearHistoryPressable, { opacity: pressed ? 0.6 : 1 }]}
          onPress={toggleOverlay}
        >
          <Icon name="trash-2" type="feather" size={17} color={Colors.grey1} />
        </Pressable>
      </View>
      <View style={styles.historyItemsWrapper}>
        {searchHistory.map((value, index) => (
          <HistoryItem
            searchText={value}
            key={index}
            onPress={() => handleHistoryItemPress(value)}
          />
        ))}
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>搜索</Text>
        <View style={styles.searchBarWrapper}>
          <Icon name="search" type="octicon" color={Colors.grey1} size={18} />
          <TextInput
            style={styles.textInput}
            placeholder="想听什么有意思的？"
            placeholderTextColor={Colors.grey1}
            keyboardType="default"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setSearchValue}
            onSubmitEditing={({ nativeEvent }) => {
              handleSubmit(nativeEvent.text)
            }}
            value={searchValue}
          />
          {searchValue && (
            <Pressable onPress={handleClearSearchValue}>
              <Icon name="close" type="antdesign" color={Colors.grey1} size={18} />
            </Pressable>
          )}
        </View>
      </View>
      {showNoResultText && (
        <>
          {SearchHistoryModule()}
          <View style={styles.noResultWrapper}>
            <Text style={styles.noResultText}>无结果</Text>
            <Text style={styles.noResultSubText}>请尝试新搜索词。</Text>
            <Footer />
          </View>
        </>
      )}
      {!showNoResultText && (
        <FlatList
          data={musicList}
          renderItem={({ item, index }) => (
            <MusicItem track={item} itemPlaying={isItemPlaying(item)} />
          )}
          ListHeaderComponent={showSearchHistoryModule ? SearchHistoryModule() : <View />}
          ListFooterComponent={<Footer />}
          ItemSeparatorComponent={Separator}
          refreshing={musicListLoading}
          onEndReached={getNextPageMusic}
        />
      )}
      <DeleteOverlay
        showDeleteOverlay={showDeleteOverlay}
        toggleOverlay={toggleOverlay}
        clearSearchHistory={clearSearchHistory}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white1,
    flex: 1,
    paddingTop: 20 * WIDTH_RATIO
  },
  headerWrapper: {
    paddingHorizontal: 20 * WIDTH_RATIO
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black1
  },
  searchBarWrapper: {
    backgroundColor: Colors.lightgrey2,
    height: 36,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    paddingHorizontal: 6 * WIDTH_RATIO,
    marginVertical: 10 * WIDTH_RATIO
  },
  textInput: {
    flex: 1,
    height: 30,
    marginLeft: 6 * WIDTH_RATIO
  },
  noResultWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  noResultText: {
    fontSize: 18,
    fontWeight: '500'
  },
  noResultSubText: {
    fontSize: 14,
    color: Colors.grey1
  },
  searchHistoryWrapper: {
    paddingHorizontal: 20 * WIDTH_RATIO
  },
  searchHistoryTitleRowWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchHistoryTitle: {
    fontSize: 17,
    fontWeight: '500'
  },
  historyItemsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6 * WIDTH_RATIO
  },
  clearHistoryPressable: {}
})

export default Search
