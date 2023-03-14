export function adjustBrightness(col, amt) {
  var usePound = false

  if (col[0] == '#') {
    col = col.slice(1)
    usePound = true
  }

  var R = parseInt(col.substring(0, 2), 16)
  var G = parseInt(col.substring(2, 4), 16)
  var B = parseInt(col.substring(4, 6), 16)

  // to make the colour less bright than the input
  // change the following three "+" symbols to "-"
  R = R + amt
  G = G + amt
  B = B + amt

  if (R > 255) R = 255
  else if (R < 0) R = 0

  if (G > 255) G = 255
  else if (G < 0) G = 0

  if (B > 255) B = 255
  else if (B < 0) B = 0

  var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16)
  var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16)
  var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16)

  return (usePound ? '#' : '') + RR + GG + BB
}

/**
 * @param Number A duration (number) in second
 * @returns The actual time in "00:00" format
 */
export const durationToTime = (duration) => {
  if (duration < 0) return '-:--'
  const minute = Math.floor(duration / 60)
  const rawSecond = Math.ceil(duration % 60)
  const second = rawSecond < 10 ? `0${rawSecond}` : `${rawSecond}`
  return `${minute}:${second}`
}

export const getGreeting = () => {
  const data = [
    [0, 4, '晚上好'],
    [5, 11, '早上好'],
    [12, 17, '下午好'],
    [18, 24, '晚上好']
  ]
  const hour = new Date().getHours()
  for (let i = 0; i < data.length; i++) {
    if (hour >= data[i][0] && hour <= data[i][1]) {
      return data[i][2]
    }
  }
}

/**
 * Shuffle an array using Durstenfeld Shuffle
 * @param {*} array
 * @returns
 */
export const shuffleArray = (array) => {
  if (!array || !array.length) return
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

const ENV = process.env.NODE_ENV
export const isDev = ENV === 'development'
export const isProd = ENV === 'production'

export const searchMusicResultConvert = (searchResult) => {
  const convertedMusic = searchResult.map((value) => ({
    id: value.id,
    url: value.audioUrl,
    duration: value.duration,
    title: value.songName,
    artist: value.singer,
    artwork: value.coverUrl ? value.coverUrl : '',
    date: value.songDate,
    titleAlias: value.songNameAlias ? value.songNameAlias : '',
    versionRemark: value.versionRemark ? value.versionRemark : '',
    songLanguage: value.songLanguage
  }))

  return convertedMusic
}

export const findCurrentTrackIndex = (track, queue) => {
  if (!track || !queue || queue.length === 0) return -1
  const compareTrack = (element) => element.id === track.id
  return queue.findIndex(compareTrack)
}

export const getDisplayTitleText = (track) => {
  if (!track) return '未在播放'

  let res = track.title
  if (track.titleAlias) {
    res += ` (${track.titleAlias})`
  }
  if (track.versionRemark) {
    res += `【${track.versionRemark}】`
  }
  return res
}
