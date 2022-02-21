import React, { useEffect, useState } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

const Account = props => {
	const [userInfo, setUserInfo] = useState()

	const LogOut = async () => {
		try {
			await AsyncStorage.clear()
			alert('You are Logged out')
		} catch (e) {
			alert(e)
		} finally {
			props.navigation.navigate('Login')
		}
	}

	useEffect(() => {
		const getLocalStorage = async () => {
			try {
				const rawUserInfo = await AsyncStorage.getItem('userInfo')
				const { data } = JSON.parse(rawUserInfo)

				rawUserInfo != null ? setUserInfo(data.user) : null

				// console.log('this is userInfo', userInfo)
			} catch (err) {
				alert(err)
			}
		}

		getLocalStorage()
	}, [])

	return (
		<>
			<SafeAreaView>
				<View>
					<Text h2>My Account</Text>
					{/* <Text>{userInfo.firstName}</Text>
					<Text>{userInfo.lastName}</Text>
					<Text>{userInfo.notes}</Text>
					<Text>{userInfo.userType}</Text>
					<Text>{userInfo.email}</Text> */}
					<Button title='Log Out' onPress={() => LogOut()} />
				</View>
			</SafeAreaView>
		</>
	)
}

export default Account
