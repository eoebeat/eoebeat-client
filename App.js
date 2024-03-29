import React from 'react'
import { StatusBar, useColorScheme, Platform, Text } from 'react-native'
import { Provider } from 'react-redux'
import Main from './src/components/Main'
import { store, persistor } from './src/store/store'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { registerCustomIconType } from '@rneui/base'
import MyIcon from './src/components/common/CustomIcon'
import { PersistGate } from 'redux-persist/integration/react'
import { Colors } from './src/styles/Styles'

// 全局设置安卓字体来解决文字显示不全
const defaultFontFamily = {
  ...Platform.select({
    android: { fontFamily: '' }
  })
}
const oldTextRender = Text.render
Text.render = function (...args) {
  const origin = oldTextRender.call(this, ...args)
  return React.cloneElement(origin, {
    style: [defaultFontFamily, origin.props.style]
  })
}

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.white1,
    primary: Colors.white1
  }
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'
  registerCustomIconType('player', MyIcon)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer theme={customTheme}>
          <StatusBar
            hidden={false}
            translucent={true}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
          />
          <SafeAreaProvider>
            <Main />
          </SafeAreaProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App
