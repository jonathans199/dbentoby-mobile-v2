import React, { useState, useEffect, useRef } from 'react'
import { View, FlatList, TouchableHighlight, AsyncStorage, ScrollView, StyleSheet, Image } from 'react-native'
import { Card, ListItem, Button, Icon, Avatar, Input, Divider, Text, Overlay } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

import SignatureScreen from 'react-native-signature-canvas'
import * as FileSystem from 'expo-file-system'
import { RNS3 } from 'react-native-aws3'

import api from '../api/base'

const OrderConfirmScreen = ({ navigation }) => {
  const [order, setOrder] = useState({})
  const [products, setProducts] = useState([])
  const [showOverlay, setShowOverlay] = useState(false)
  const [confirmedBy, setConfirmedBy] = useState('')

  useEffect(() => {
    const getOrderFromAsync = async () => {
      try {
        const rawOrder = await AsyncStorage.getItem('order')
        const orderSaved = JSON.parse(rawOrder)
        setOrder(orderSaved)
        console.log('Order from cart', orderSaved)

        const rawProducts = await AsyncStorage.getItem('products')
        const productsSaved = JSON.parse(rawProducts)

        setProducts(productsSaved)

        rawOrder ? '' : navigation.navigate('New Order')
      } catch (err) {
        alert(err)
      }
    }
    getOrderFromAsync()
  }, [])

  const Sign = ({ text, onOK }) => {
    const ref = useRef()

    const options = {
      bucket: 'dbentoby-signatures',
      region: 'us-east-1',
      accessKey: 'AKIATQ6GGP7CMILW4A4K',
      secretKey: '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',
      successActionStatus: 201,
    }

    const handleSignature = signature => {
      const path = FileSystem.cacheDirectory + 'sign.png'
      FileSystem.writeAsStringAsync(path, signature.replace('data:image/png;base64,', ''), { encoding: FileSystem.EncodingType.Base64 })
        .then(res => {
          console.log(res)
          FileSystem.getInfoAsync(path, { size: true, md5: true }).then(file => {
            const image = {
              uri: file.uri,
              name: `${order.orderNumber}.png`,
              type: 'image/png',
            }

            RNS3.put(image, options).then(response => {
              if (response.status !== 201) throw new Error('Failed to upload image to S3')
              console.log('here is S3 response', response.body)
              setOrder({ ...order, signature: response.body.postResponse.location })
            })
            console.log('file was added to signature', file.uri)
          })
        })
        .catch(err => {
          console.log('err', err)
        })
      setShowOverlay(false)
    }

    return <SignatureScreen ref={ref} onOK={handleSignature} />
  }

  let finalOrder = {}

  const clearCart = async () => {
    try {
      setOrder({})
      setProducts([])
    } catch (err) {
      alert(err)
    }
  }

  const sendOrder = () => {
    finalOrder = { ...order, ...[products] }
    finalOrder['products'] = finalOrder[0]

    api
      .post('/api/orders/add-order', finalOrder)
      .then(res => {
        alert('order sent')
        console.log('final order in post', finalOrder)
        navigation.navigate('Stores')

        clearCart()
      })
      .catch(err => {
        alert(err)
      })
  }

  console.log('order here', order)

  return (
    <>
      <Overlay isVisible={showOverlay} animationType='slide' transparent statusBarTranslucent>
        <SafeAreaView style={{ width: 600, height: '100%' }}>
          <Sign />
        </SafeAreaView>
      </Overlay>
      <ScrollView style={{ flex: 1 }}>
        <SafeAreaView>
          <View>
            <Card>
              <Card.Title>Order Number ssss: {order.orderNumber}</Card.Title>
              <Card.Divider />
              <Text h4>Store: {order.store} </Text>
              <Text h4>Total: ${order.totalInvoice}</Text>
              <Text h4>Terms: {order.terms}</Text>
              <Text>Units Delivered: {order.unitsDelivered}</Text>
              <Text>CasesDelivered: {order.cases}</Text>
              <Text>Notes: {order.notes}</Text>
              <Card.Divider />
              <View>
                {products.map((product, i) => (
                  <ListItem key={i} bottomDivider>
                    <Avatar
                      source={{
                        uri: product.image ? product.image : 'http://app.dbentoby.com/static/media/imagena.9ae40db8.png',
                      }}
                    />
                    <ListItem.Content>
                      <ListItem.Title>{product.itemNumber}</ListItem.Title>
                      <ListItem.Subtitle>{product.description}</ListItem.Subtitle>

                      <Text>Units: {product.units}</Text>
                      <Text>Cases: {product.cases}</Text>
                      <Text>Sub-total ${product.price * product.units}</Text>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </View>

              <Text>Signature here </Text>
              <Image style={{ width: 335, height: 114 }} source={{ uri: order.signature }} resizeMode={'contain'} />
              <Button onPress={() => setShowOverlay(true)} title='Get Signature' />
              <Input
                placeholder='Confirmed by'
                style={{ marginTop: 10 }}
                onChangeText={text => (setConfirmedBy(text), setOrder({ ...order, receivedBy: confirmedBy }))}
              />
              <Button title='Confirm Order' onPress={() => sendOrder()} />
            </Card>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  preview: {
    // width: 335,
    // height: 114,
    // backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  previewText: {
    color: '#FFF',
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#69B2FF',
    width: 120,
    textAlign: 'center',
    marginTop: 10,
  },
})

export default OrderConfirmScreen
