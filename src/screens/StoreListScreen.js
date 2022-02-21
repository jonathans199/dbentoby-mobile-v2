import React, { useState, useEffect } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, AsyncStorage, Button } from 'react-native'
import { ListItem, Text, Avatar, SearchBar } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

import useStores from '../hooks/useStores'

const StoreListScreen = ({ navigation }) => {
  const [stores] = useStores()
  const [userInfo, setUserInfo] = useState('')
  const [search, setSearch] = useState('')

  const getLocalStorage = async () => {
    try {
      const rawUserInfo = await AsyncStorage.getItem('userInfo')
      const { data } = JSON.parse(rawUserInfo)

      rawUserInfo != null ? setUserInfo(data.user) : null
    } catch (err) {
      alert(err)
    }
  }

  const filteredStores = stores.filter(store => {
    return store.storeId.includes(search)
  })

  const LogOut = async () => {
    try {
      await AsyncStorage.clear()
      alert('You are Logged out')
    } catch (e) {
      alert(e)
    } finally {
      navigation.navigate('LoginScreen')
    }
  }

  useEffect(() => {
    getLocalStorage()
  }, [])

  return (
    <>
      <SafeAreaView forceInset={{ top: 'always' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
          }}>
          <Text
            h4
            style={{
              // marginTop: 40,
              // marginBottom: 0,
              textAlign: 'center',
              // fontFamily: 'Avenir-Heavy',
              color: '#848484',
              fontWeight: '100',
            }}>
            Hi {userInfo.firstName}
          </Text>
          <Button title='Log Out?' onPress={() => LogOut()} />
        </View>
      </SafeAreaView>

      <SearchBar
        containerStyle={{ border: 'none' }}
        placeholder='Search Here ...'
        onChangeText={storeSearch => setSearch(storeSearch)}
        value={search}></SearchBar>
      <View style={styles.container}>
        {!stores && <ActivityIndicator size='large' />}
        <FlatList
          data={filteredStores}
          keyExtractor={store => store.storeId}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('Order', { store: item })}>
                <ListItem bottomDivider>
                  <Avatar
                    rounded
                    source={{
                      uri: item.image
                        ? item.image
                        : 'https://www.gannett-cdn.com/-mm-/b2b05a4ab25f4fca0316459e1c7404c537a89702/c=0-0-1365-768/local/-/media/2019/05/01/USATODAY/usatsports/247WallSt.com-247WS-544629-imageforentry19.jpg?width=660&height=372&fit=crop&format=pjpg&auto=webp',
                    }}
                  />
                  <ListItem.Content>
                    <ListItem.Title>{item.storeId}</ListItem.Title>
                    <ListItem.Subtitle>{item.storeAddress} </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    // height: '100%',
    // width: '100%',
  },
})

StoreListScreen.navigationOptions = () => {
  return {
    headerShown: false,
    // gesturesEnabled: true,
  }
}

export default StoreListScreen
