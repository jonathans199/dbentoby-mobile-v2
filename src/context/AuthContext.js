import AsyncStorage from '@react-native-community/async-storage'
import createDataContext from './createDataContext'

import api from '../api/base'

// const authReducer = (state, action) => {
// 	switch (action.type) {
// 		case 'signin':
// 			return { ...state, token: action.payload }
// 		default:
// 			return state
// 	}
// }

// const signin = dispatch => {
// 	return async ({ email, password }) => {
// 		try {
//       const response = await api.post('/signin', { email, password })
//       console.log(response.data)
      
//       await AsyncStorage.setItem('token', response.data.token)
//       dispatch({ type: 'signin', payload: response.data.token })
      
// 		} catch (err) {
// 			dispatch({ type: 'add_error', payload: 'Something went wrong with signin' })
// 		}
// 	}
// }

// const tryLocalSignin = dispatch => async () =>  {
// 	const token = await AsyncStorage.getItem('token')
// 	if(token) {
// 		dispatch({type: 'signin', payload: token})
// 	}
// }

// const signup  = (dispatch) => {
//   return ({email, password}) => {
//     // sign in
//   }
// }

// const signout = (dispatch) => {
//   return () => {
//     // some how sign out
//   }
// }

export const { Provider, Context } = createDataContext(authReducer, { signin }, { token: null, errorMessage: '' })
