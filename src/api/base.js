import axios from 'axios'
import { AsyncStorage } from 'react-native'


// axios.defaults.baseURL = 'https://quick-parrot-90.loca.lt'
axios.defaults.baseURL = 'https://hosting.dbentoby.com:3001'

const apiInstance = axios.create()

apiInstance.interceptors.request.use(
	async config => {
		const userInfo = await AsyncStorage.getItem('userInfo')
		const filteredData = JSON.parse(userInfo)
		const token = filteredData.data.token

		if (token) {
			config.headers.Authorization = 'Bearer ' + token
			// console.log(config.headers.Authorization)
		}	
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

export default apiInstance
