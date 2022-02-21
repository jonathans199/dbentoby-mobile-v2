import React, { useState, useEffect } from 'react'
import { ActivityIndicator, View, Image, Dimensions } from 'react-native'
import { Card, Text, Button, Divider, Input } from 'react-native-elements'

const { width, height } = Dimensions.get('window')

const ProductCard = ({ sendProduct, itemNumber, description, upc, price, pack, image, cvsNumber, brand }) => {
  const [cases, setCases] = useState(1)
  const [units, setUnits] = useState(pack)

  useEffect(() => {
    setUnits(cases * pack)
  }, [cases])

  return (
    <Card style={{ width: '100%' }}>
      <Text style={{ color: '#666', fontSize: 20, marginBottom: 10 }}>Item #: {itemNumber}</Text>
      <Divider />

      <View style={width < 400 ? { alignItems: 'center' } : { flexDirection: 'row', alignItems: 'center' }}>
        {/* left */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{
                uri: image
                  ? image
                  : 'http://app.dbentoby.com/static/media/imagena.9ae40db8.png',
              }}
              style={{ width: 100, height: 100, marginEnd: 15 }}
              PlaceholderContent={<ActivityIndicator />}
            />
            <View>
              <Text>Upc: {upc}</Text>
              <Text>Cvs #: {cvsNumber}</Text>
              <Text>Brand: {brand}</Text>

              <Text>Price: ${price}</Text>
              <Text>Pack: {pack}</Text>
            </View>
          </View>
          <Text>{description}</Text>
        </View>
        {/* right */}
        <View style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
          <Text>Cases</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              style={{ width: 50 }}
              title='-'
              onPress={() => setCases(cases - 1)}
              disabled={cases > 1 ? false : true}
            />
            <Text h4 style={{ paddingHorizontal: '5%', paddingVertical: '3%' }}>
              {cases}
            </Text>
            {/* <Input
							keyboardType={'numeric'}
							type='number'
							value={cases ? cases.toString() : initialDisplay}
							onChangeText={value => setCases(value)}
						/> */}
            <Button style={{ width: 50 }} title='+' onPress={() => setCases(cases + 1)} />
          </View>
          <Text>Units per Pack: {pack}</Text>
          <Text>Total Units: {pack * cases}</Text>
        </View>
      </View>
      <Button
        title='Add to Order'
        onPress={() =>
          sendProduct({ itemNumber, description, upc, price, pack, image, cvsNumber, units, cases })
        }
        buttonStyle={{ backgroundColor: '#666', marginTop: 15 }}
      />
    </Card>
  )
}

export default ProductCard
