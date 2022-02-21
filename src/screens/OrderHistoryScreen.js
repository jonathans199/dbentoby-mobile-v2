import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, AsyncStorage } from 'react-native'
import api from '../api/base'

import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

const OrderHistoryScreen = () => {
	const [orders, setOrders] = useState({})
	const [user, setUser] = useState({})
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		getLocalStorage()
		getOrders()
	}, [])

	const getLocalStorage = async () => {
		try {
			const rawUserInfo = await AsyncStorage.getItem('userInfo')
			const { data } = JSON.parse(rawUserInfo)

			setUser(data.user)
			console.log('user email local from storage', user.email)
		} catch (error) {
			console.log(error)
		}
	}

	const getOrders = () => {
		api.get('/api/orders').then(res => {
			// console.log('user from server' , res.data)
			// console.log(user)
			// setOrders(res.data.includes(u => u.user === user.email))
			setOrders(res.data)
			// console.log('orders' , orders)

			setLoaded(true)
		})
	}

	// console.log(orders)

	return (
		<SafeAreaView>
			<ScrollView>
				<View>
					{loaded &&
						orders
							.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
							.map((order, i) => {
								return (
									<ListItem key={i} bottomDivider>
										<ListItem.Content>
											<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
												<ListItem.Title> Order # {order.orderNumber}</ListItem.Title>
												<ListItem.Subtitle>Total - ${order.totalInvoice}</ListItem.Subtitle>
											</View>
											<Text>Date: {order.createdAt}</Text>
											<Text>Units delivered: {order.unitsDelivered}</Text>
											<Text>Cases delivered: {order.casesDelivered}</Text>
										</ListItem.Content>
									</ListItem>
								)
							})}
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default OrderHistoryScreen
