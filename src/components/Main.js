import { View, StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import Player from './player/Player'
import StartScreen from './StartScreen'
import {
  selectFinishedSetup,
  setFinishedSetup,
  selectBottomPosition,
  selectTrackRepeatMode
} from '../store/slices/playerSlice'
import { useSelector, useDispatch } from 'react-redux'
import TrackPlayer, { Capability } from 'react-native-track-player'
import { Colors } from '../styles/Styles'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './home/Home'
import Search from './search/Search'
import Library from './library/Library'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from '@rneui/themed'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Collection from './collection/Collection'
import Playlist from './playlist/Playlist'
import Setting from './setting/Setting'
import BackPressable from './common/BackPressable'
import { Platform } from 'react-native'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Collection"
      component={Collection}
      options={{
        headerShown: false
      }}
    />
  </Stack.Navigator>
)

const LibraryStack = () => (
  <Stack.Navigator initialRouteName="Library">
    <Stack.Screen
      name="Library"
      component={Library}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Playlist"
      component={Playlist}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Setting"
      component={Setting}
      options={{
        headerTitle: '设置',
        headerTintColor: Colors.black1,
        headerLeft: () => <BackPressable />
      }}
    />
  </Stack.Navigator>
)

const Main = () => {
  const finishedSetup = useSelector(selectFinishedSetup)
  const dispatch = useDispatch()
  const playerBottomPosition = useSelector(selectBottomPosition)
  const trackRepeatMode = useSelector(selectTrackRepeatMode)

  useEffect(() => {
    const setupTrackplayer = async () => {
      const allKeys = await AsyncStorage.getAllKeys()
      console.log(allKeys)
      try {
        if (!finishedSetup) {
          await TrackPlayer.setupPlayer({})
          await TrackPlayer.updateOptions({
            progressUpdateEventInterval: 1,
            capabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
              Capability.Stop,
              Capability.SeekTo
            ],
            compactCapabilities: [Capability.Play, Capability.Pause]
          })
          await TrackPlayer.setRepeatMode(trackRepeatMode)
        }
        dispatch(setFinishedSetup(true))
      } catch (e) {
        console.log(e)
      }
    }
    setupTrackplayer()
  }, [])

  return (
    <View style={styles.container}>
      {!finishedSetup && <StartScreen />}
      {finishedSetup && (
        <>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                position: 'absolute'
              },
              tabBarBackground: () => (
                <View style={{ flex: 1 }}>
                  <LinearGradient
                    end={{ x: 0.5, y: 0.5 }}
                    colors={[Colors.white1Transparent, Colors.white1]}
                    style={{ flex: 1 }}
                  />
                </View>
              ),
              tabBarIcon: ({ focused, color, size }) => {
                let iconName
                if (route.name === '主页') {
                  iconName = 'home'
                  return <Icon name={iconName} type="octicon" color={color} />
                } else if (route.name === '搜索') {
                  iconName = 'search'
                  return <Icon name={iconName} type="octicon" color={color} />
                } else if (route.name === '音乐库') {
                  iconName = 'library-music'
                  return <Icon name={iconName} type="material" color={color} />
                }
              },
              tabBarActiveTintColor: Colors.pink1,
              tabBarInactiveTintColor: Colors.grey1
            })}
          >
            <Tab.Screen name="主页" component={HomeStack} />
            <Tab.Screen name="搜索" component={Search} />
            <Tab.Screen name="音乐库" component={LibraryStack} />
          </Tab.Navigator>
          <View
            style={{
              position: 'absolute',
              bottom: Platform.OS === 'android' ? playerBottomPosition - 1 : playerBottomPosition
            }}
          >
            <Player />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white1,
    flex: 1
  }
})

export default Main
