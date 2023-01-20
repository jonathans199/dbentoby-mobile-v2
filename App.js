import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import LoginScreen from './src/screens/LoginScreen'
import StoreListScreen from './src/screens/StoreListScreen'
import OrderCreateScreen from './src/screens/OrderCreateScreen'
import OrderConfirmScreen from './src/screens/OrderConfirmScreen'
import SignatureScreen from './src/components/SignatureConfirm'

export default createAppContainer(
  createStackNavigator(
    {
      LoginScreen,
      Stores: StoreListScreen,
      Order: OrderCreateScreen,
      'Confirm Order': OrderConfirmScreen,
      Sign: SignatureScreen,
    },
    { initialRouteName: 'LoginScreen' }
  )
)
