import { Platform } from 'react-native'
import { isDev } from './shared'

// const iosDevHost = 'http://localhost:8080/eoebackend'
const iosDevHost = 'http://192.168.1.140:8080/eoebackend'
const androidDevHost = 'http://10.0.2.2:8080/eoebackend'
const devHost = Platform.OS === 'ios' ? iosDevHost : androidDevHost

export const EOEBEAT_HOST = isDev ? devHost : 'https://api.eoebeat.com/eoebackend'
