/**
 * Singer: 歌手合集
 * Month: 月度合集
 */
export const COLLECTION_TYPE = {
  Singer: 0,
  Month: 1
}

/**
 * Hitcount: 按照hitcount从大到小，songdate从新到早，入库时间从新到早
 * DateNewToOld: 按照songdate从新到早，入库时间从新到早
 * DateOldToNew: 按照songdate从早到新，入库时间从新到早
 * DatabaseNewToOld: 按照入库时间从新到早
 */
export const SEARCH_ORDER = {
  Hitcount: '0',
  DateNewToOld: '1',
  DateOldToNew: '2',
  DatabaseNewToOld: '3'
}

export const HOME_PAGE_SIZE = 10
export const COLLECTION_PAGE_SIZE = 20

export const HOME_PAGE_HEADER_ASSETS = [
  '收藏',
  '莞儿头图',
  '露早头图',
  '米诺头图',
  '虞莫头图',
  '柚恩头图'
]

export const DEFAULT_COVER_NAME = [
  'EOE封面',
  '莞儿封面',
  '露早封面',
  '米诺封面',
  '虞莫封面',
  '柚恩封面'
]
