import { combineReducers, configureStore } from '@reduxjs/toolkit'
import playerReducer from './slices/playerSlice'
import searchReducer from './slices/searchSlice'
import { persistReducer, persistStore } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import thunk from 'redux-thunk'

const playerPersistConfig = {
  key: 'player',
  storage: AsyncStorage,
  whitelist: ['currentTrack']
}

// root persist里不存player, player reducer作为一个单独的persist存储
const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['player']
}

const rootReducer = combineReducers({
  player: persistReducer(playerPersistConfig, playerReducer),
  search: searchReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)
