import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React, { memo, useMemo } from 'react'
import { Colors, DEVICE_LOGIC_WIDTH, WIDTH_RATIO } from '../../styles/Styles'
import { getDisplayTitleText } from '../../utils/shared'
import { Icon } from '@rneui/themed'
import { useDispatch, useSelector } from 'react-redux'
import {
  listTrackAdded,
  listTrackRemoved,
  selectAllListTrackIds,
  selectListTracksByPlaylist
} from '../../store/slices/listTracksSlice'

export const MUSICITEM_HEIGHT = 60 * WIDTH_RATIO

const MusicItem = (props) => {
  const { track, itemPlaying, onPressItem, defaultCoverUrls } = props

  const titleColor = itemPlaying ? Colors.pink1 : Colors.black1
  const artistColor = itemPlaying ? Colors.pink1 : Colors.grey2

  const dispatch = useDispatch()
  const listTrackIds = useSelector(selectAllListTrackIds)
  const tracksInLikePlaylist = useSelector((state) => selectListTracksByPlaylist(state, 0))
  const isLiked = useMemo(() => {
    if (tracksInLikePlaylist.find((value) => value.track.id === track.id)) {
      return true
    } else {
      return false
    }
  }, [tracksInLikePlaylist])

  const onPressLike = () => {
    dispatch(
      listTrackAdded({
        track,
        playlistId: 0,
        id: listTrackIds.length ? listTrackIds[listTrackIds.length - 1] + 1 : 0
      })
    )
  }

  const onPressNotLike = () => {
    dispatch(listTrackRemoved({ trackId: track.id, playlistId: 0 }))
  }

  // 先等等看后端是否能区分歌曲有无封面，否则将默认图片上传至sharepoint，也作为url来获取 (source: [{uri}])
  const getDefaultCoverImageUri = () => {
    let res = [{ uri: track.artwork, width: 50 * WIDTH_RATIO, height: 50 * WIDTH_RATIO }]
    // 有封面时
    // if (track.artwork) return { uri: track.artwork }

    // 当前track没有封面
    // 多成员显示EOE
    // if (track.artist.length > 2 || track.artist === 'EOE')
    // return require('../../../assets/cover/EOE.jpg')
    // 各成员默认封面
    if (track.artist && track.artist.length > 2)
      res.push({
        uri: defaultCoverUrls.length ? defaultCoverUrls[0] : '',
        width: 50 * WIDTH_RATIO,
        height: 50 * WIDTH_RATIO
      })
    // 各成员默认封面
    if (track.artist === '莞儿')
      res.push({
        uri: defaultCoverUrls.length ? defaultCoverUrls[1] : '',
        width: 50 * WIDTH_RATIO,
        height: 50 * WIDTH_RATIO
      })
    if (track.artist === '露早')
      res.push({
        uri: defaultCoverUrls.length ? defaultCoverUrls[2] : '',
        width: 50 * WIDTH_RATIO,
        height: 50 * WIDTH_RATIO
      })
    if (track.artist === '米诺')
      res.push({
        uri: defaultCoverUrls.length ? defaultCoverUrls[3] : '',
        width: 50 * WIDTH_RATIO,
        height: 50 * WIDTH_RATIO
      })
    if (track.artist === '虞莫')
      res.push({
        uri: defaultCoverUrls.length ? defaultCoverUrls[4] : '',
        width: 50 * WIDTH_RATIO,
        height: 50 * WIDTH_RATIO
      })
    if (track.artist === '柚恩')
      res.push({
        uri: defaultCoverUrls.length ? defaultCoverUrls[5] : '',
        width: 50 * WIDTH_RATIO,
        height: 50 * WIDTH_RATIO
      })
    return res
  }

  const titleText = getDisplayTitleText(track)

  return (
    <Pressable
      onPress={() => onPressItem(track)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.6 : 1 }]}
    >
      <View style={styles.InfoWrapper}>
        <Image
          source={getDefaultCoverImageUri()}
          // defaultSource={altCoverImageUri()}
          style={styles.coverImage}
        />
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {titleText}
          </Text>
          <Text style={[styles.artist, { color: artistColor }]}>
            {`${track.artist} - ${track.date}`}
          </Text>
        </View>
      </View>
      <View style={styles.btnsWrapper}>
        {!isLiked && (
          <Pressable onPress={onPressLike}>
            <Icon type="ionicon" name="heart-outline" size={20} color={Colors.grey1} />
          </Pressable>
        )}
        {isLiked && (
          <Pressable onPress={onPressNotLike}>
            <Icon type="ionicon" name="heart" size={20} color={Colors.pink1} />
          </Pressable>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: MUSICITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEVICE_LOGIC_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 20 * WIDTH_RATIO,
    backgroundColor: Colors.white1
  },
  InfoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  coverImage: {
    width: 50 * WIDTH_RATIO,
    height: 50 * WIDTH_RATIO,
    marginRight: 5 * WIDTH_RATIO,
    borderRadius: 6
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: MUSICITEM_HEIGHT,
    paddingVertical: 3 * WIDTH_RATIO,
    width: 240 * WIDTH_RATIO
  },
  title: {
    color: Colors.black1,
    fontSize: 16,
    fontWeight: '400',
    flexShrink: 1,
    flexWrap: 'wrap'
  },
  artist: {
    color: Colors.grey2,
    fontSize: 13,
    fontWeight: '300'
  },
  btnsWrapper: {
    display: 'flex',
    flexDirection: 'row'
  }
})

export default memo(MusicItem)
