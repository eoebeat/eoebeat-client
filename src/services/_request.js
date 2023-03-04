import axios from 'axios'
import DeviceCountry from 'react-native-device-country'

let regionCode
DeviceCountry.getCountryCode()
  .then((result) => {
    regionCode = result.code === 'CN' ? 'cn' : 'global'
  })
  .catch((e) => {
    regionCode = 'cn'
  })

const instance = axios.create({})

instance.interceptors.request.use((config) => {
  config.headers.region = regionCode
  return config
})

export default instance
