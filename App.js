import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
// import { createBottomTabNavigator } from 'react-navigation-tabs'

import LoginScreen from './src/screens/LoginScreen'
import MyAccount from './src/screens/MyAccount'
import StoreListScreen from './src/screens/StoreListScreen'
import OrderCreateScreen from './src/screens/OrderCreateScreen'
import OrderConfirmScreen from './src/screens/OrderConfirmScreen'
import OrderHistoryScreen from './src/screens/OrderHistoryScreen'
import SignatureScreen from './src/components/SignatureConfirm'

export default createAppContainer(
	createStackNavigator(
		{
			LoginScreen,
			'Stores': StoreListScreen,
			'Order': OrderCreateScreen,
			'Confirm Order': OrderConfirmScreen,
			'Sign' : SignatureScreen
		},
		{ initialRouteName: 'LoginScreen' }
	)
)

// const switchNavigator = createSwitchNavigator({
// 	loginFlow: createStackNavigator({
// 		Login: LoginScreen,
// 	}),
// 	mainFlow: createBottomTabNavigator({
// 		// 'New Order': StoreListScreen,
// 		'New Order': createStackNavigator({
// 			StoreList: StoreListScreen,
// 			OrderCreate: OrderCreateScreen,
// 			OrderConfirm: OrderConfirmScreen,
// 		}),
// 		// 'Order History': OrderHistoryScreen,
// 		// 'My Account': MyAccount,
// 	}),
// })

// export default App = createAppContainer(switchNavigator)
