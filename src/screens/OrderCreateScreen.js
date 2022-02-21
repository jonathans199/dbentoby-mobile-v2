import React, { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet, AsyncStorage, Dimensions } from 'react-native'
import { ListItem, Button, Text, SearchBar, Badge, Overlay, Input, Divider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import BarcodeScanModel from '../components/BarcodeScanModal'

const { width, height } = Dimensions.get('window')

const OrderCreateScreen = ({ navigation }) => {
  const [products] = useProducts()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState({})
  const [orderProducts, setOrderProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [total, setTotal] = useState(null)

  const store = navigation.getParam('store')
  let totalCases

  const getLocalStorage = async () => {
    try {
      const rawUserInfo = await AsyncStorage.getItem('userInfo')
      const { data } = JSON.parse(rawUserInfo)

      const date = new Date()
      const month = date.getMonth() + 1
      const year = date.getFullYear().toString().substr(2, 2)
      const fullOrderNumber = year + month + date.getMinutes() + date.getSeconds()

      setOrder({
        store: store.storeId,
        user: data.user.email,
        orderNumber: fullOrderNumber,
        unitsDelivered: productsInOrder,
        casesDelivered: totalCases,
        totalInvoice: total,
      })
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    getLocalStorage()
    products ? setIsLoading(false) : null

    const totalLineItem = orderProducts.map(product => product.price * product.units)
    const subTotal = totalLineItem.reduce((sum, current) => sum + current, 0)

    setTotal(subTotal.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
  }, [orderProducts, total, search, handleSearch])

  const handleSearch = searchText => {
    setSearch(searchText.toUpperCase().replace(/^0+/, ''))
  }

  const filteredProducts = !isLoading
    ? products.filter(product => {
        return (
          product.upc.toString().includes(search) ||
          // parseInt(product.upc, 10).toString().includes(search) || // replace any leading 0s
          product.cvsNumber.toString().includes(search) ||
          product.itemNumber.toString().includes(search) ||
          (product.brand && product.brand.toString().includes(search))
        )
      })
    : []

  const productsSpecials = !isLoading
    ? products.filter(product => {
        return product.special
      })
    : []

  const handleProductInput = item => {
    setOrderProducts(products => [...products, item])
    alert(`Item ${item.itemNumber} has been added to order`)
  }

  const handleOrderSend = async () => {
    try {
      await AsyncStorage.setItem('order', JSON.stringify(order))
      await AsyncStorage.setItem('products', JSON.stringify(orderProducts))

      navigation.navigate('Confirm Order')
    } catch (err) {
      alert(err)
    }
  }

  let productsInOrder = orderProducts !== [] ? orderProducts.length : 0
  let casesArray = []
  orderProducts.map(item => casesArray.push(item.cases))
  totalCases = casesArray.reduce((a, b) => a + b, 0)

  const removeCartItem = itemNumber => {
    setOrderProducts(cart => cart.filter(item => item.itemNumber !== itemNumber))
  }

  return (
    <>
      <Overlay isVisible={showCart} animationType='slide' transparent statusBarTranslucent>
        <SafeAreaView>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title='Hide Cart' onPress={() => setShowCart(false)} />
              <Button
                title='Clear Cart'
                onPress={() => {
                  setOrderProducts([]), setShowCart(false)
                }}
              />
              <Button
                title='Save'
                disabled={productsInOrder < 1 ? true : false}
                onPress={() => {
                  handleOrderSend(), setShowCart(false), console.log('order here', order)
                }}
              />
            </View>
            {/* <Input
							style={{ marginTop: 20 }}
							placeholder='Order Po Number:'
							onChangeText={po => setOrder({ ...order, orderPoNumber: po })}
						/> */}
            <Input style={{ marginTop: 20 }} placeholder='Notes' onChangeText={notes => setOrder({ ...order, notes: notes })} />
            {orderProducts.map((product, i) => (
              <ListItem key={i} containerStyle={{}} onPress={product.onPress}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text h4 style={{ marginRight: 10 }}>
                    {i + 1} -
                  </Text>
                  <ListItem.Content>
                    <ListItem.Title style={product.titleStyle}>
                      {product.itemNumber} - ${product.price}
                    </ListItem.Title>
                    <ListItem.Subtitle>{product.description}</ListItem.Subtitle>
                  </ListItem.Content>
                  <Text style={{ marginRight: 20 }}>Qty {product.units}</Text>
                  <Button title='X' onPress={() => removeCartItem(product.itemNumber)} />
                </View>
              </ListItem>
            ))}
            <Text h4 style={{ marginTop: 20 }}>
              Total Invoice: ${order.totalInvoice} total cases: {order.cases}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Overlay>

      <View style={width > 400 ? { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' } : { justifyContent: 'space-evenly' }}>
        <SearchBar
          containerStyle={width > 400 ? { flex: 1 } : ''}
          placeholder='Search Here ...'
          onChangeText={handleSearch}
          value={search}
          // keyboardType={'numeric'}
        />
        <View style={{ flexDirection: 'row' }}>
          <BarcodeScanModel sendData={data => handleSearch(data)} />
          <TouchableOpacity
            onPress={() => {
              setShowCart(true)
            }}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2d2d2d' }}
            disabled={productsInOrder > 0 ? false : true}>
            <Button
              containerStyle={{
                backgroundColor: '#2d2d2d',
                paddingVertical: 14.5,
                paddingLeft: 10,
                borderRadius: 0,
              }}
              buttonStyle={{ backgroundColor: '#2d2d2d' }}
              icon={<Icon name='shopping-cart' size={20} color='white' />}
              iconRight
              iconContainerStyle={{ marginLeft: 1 }}
            />
            <Badge value={productsInOrder} containerStyle={{ marginRight: 10 }} badgeStyle={{ borderColor: '#666', backgroundColor: '#666' }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Show search result  */}
      {search !== '' && (
        <View>
          <Text h4 style={{ textAlign: 'center', marginTop: 10 }}>
            {filteredProducts.length == 0 ? 'Not found' : 'All Products'}
          </Text>
          <FlatList
            data={filteredProducts}
            keyExtractor={product => product.itemNumber}
            renderItem={({ item }) => {
              return (
                <ProductCard
                  itemNumber={item.itemNumber}
                  description={item.description}
                  cvsNumber={item.cvsNumber}
                  upc={item.upc}
                  price={item.price}
                  pack={item.pack}
                  image={item.image}
                  brand={item.brand}
                  sendProduct={item => handleProductInput(item)}
                />
              )
            }}
          />
        </View>
      )}

      {/* show specials  */}
      {search.trim() === '' && (
        <View>
          <Text h4 style={{ textAlign: 'center', marginTop: 10 }}>
            Specials
          </Text>
          <FlatList
            data={productsSpecials}
            keyExtractor={product => product.itemNumber}
            renderItem={({ item }) => {
              return (
                <ProductCard
                  itemNumber={item.itemNumber}
                  description={item.description}
                  cvsNumber={item.cvsNumber}
                  upc={item.upc}
                  price={item.price}
                  pack={item.pack}
                  image={item.image}
                  sendProduct={item => handleProductInput(item)}
                />
              )
            }}
          />
        </View>
      )}
    </>
  )
}

const opacity = 'rgba(0, 0, 0, .6)'
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // height: '100%',
    // width: '100%',
    // flexDirection: 'column',
    // fontSize: 30,
  },
  // barcodeContainer: {
  // 	flex: 1,
  // 	flexDirection: 'column',
  // },
  // layerTop: {
  // 	flex: 2,
  // 	backgroundColor: opacity,
  // },
  // layerCenter: {
  // 	flex: 1,
  // 	flexDirection: 'row',
  // },
  // layerLeft: {
  // 	flex: 1,
  // 	backgroundColor: opacity,
  // },
  // focused: {
  // 	flex: 10,
  // 	borderWidth: 5,
  // 	borderColor: 'white',
  // },
  // layerRight: {
  // 	flex: 1,
  // 	backgroundColor: opacity,
  // },
  // layerBottom: {
  // 	flex: 2,
  // 	backgroundColor: opacity,
  // },
})

OrderCreateScreen.navigationOptions = () => {
  return {
    headerShown: true,
    gestureEnabled: false,
  }
}

export default OrderCreateScreen
