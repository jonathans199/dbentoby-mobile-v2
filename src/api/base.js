import axios from 'axios'
import { AsyncStorage } from 'react-native'

import { API_URL } from '@env'

axios.defaults.baseURL = API_URL

const apiInstance = axios.create()

apiInstance.interceptors.request.use(
  async config => {
    const userInfo = await AsyncStorage.getItem('userInfo')
    const filteredData = JSON.parse(userInfo)
    const token = filteredData.data.token

    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default apiInstance
