import Request from './_request'
import { EOEBEAT_HOST } from '../utils/config'

const MusicService = {
  /**
   * get all music
   * @param {object} pageable { page: number, size: number }
   * @param {order} SEARCH_ORDER
   */
  async searchAllMusic(pageable, order) {
    const url = `${EOEBEAT_HOST}/music/search`
    const params = { condition: [{ name: 'order', value: order }], pageable }
    const res = await Request.post(url, params)
    return res.data
  },
  /**
   * users search music
   * @param {string} value
   * @param {object} pageable { page: number, size: number }
   * @param {order} SEARCH_ORDER
   */
  async searchMusic(value, pageable, order) {
    const url = `${EOEBEAT_HOST}/music/search`
    const params = {
      condition: [
        {
          name: 'userInput',
          value
        },
        {
          name: 'order',
          value: order
        }
      ],
      pageable
    }
    const res = await Request.post(url, params)
    return res.data
  },
  /**
   * Fetch music in a certain month
   * @param {string} value
   * @param {object} pageable { page: number, size: number }
   * @param {order} SEARCH_ORDER
   * @returns
   */
  async fetchMusicInMonth(value, pageable, order) {
    const url = `${EOEBEAT_HOST}/music/search`
    const params = {
      condition: [
        {
          name: 'monthlySelection',
          value
        },
        {
          name: 'order',
          value: order
        }
      ],
      pageable
    }
    const res = await Request.post(url, params)
    return res.data
  },
  /**
   * 获取配置图片
   * @param {string[]} names asset资源在数据库中的name组成的string[]
   * @returns image url
   */
  async fetchConfigImage(names) {
    const url = `${EOEBEAT_HOST}/music/asset`
    const res = await Request.post(url, names)
    return res.data
  },
  /**
   * Get all songs from a playlist
   * @param {string} playlistId
   * @param {object} pageable { page: number, size: number }
   * @param {order} SEARCH_ORDER
   */
  async searchMusicInPlaylist(playlistId, pageable, order) {},
  /**
   * Send hit info of a certain track
   * No need to wait for its result
   * @param {string} id track id
   */
  sendHitInfo(id) {
    const url = `${EOEBEAT_HOST}/music/hit/${id}`
    Request.get(url)
  },
  /**
   * Get all monthly collections
   * @returns collectionInfo[]
   * collectionInfo: {
   *   name: string,
   *   coverUrl: string,
   *   description: string,
   *   searchLabel: string
   * }
   */
  async fetchMonthlyCollection() {
    const url = `${EOEBEAT_HOST}/music/monthlyCollection`
    const res = await Request.get(url)
    return res.data
  }
}

export default MusicService
