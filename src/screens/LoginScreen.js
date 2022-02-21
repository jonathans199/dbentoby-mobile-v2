import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Text, Button, Input } from 'react-native-elements'
import { StyleSheet, View, KeyboardAvoidingView, AsyncStorage, Alert } from 'react-native'

import axios from 'axios'

const LoginScreen = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loginError, setLoginError] = useState(false)
  const [newAccount, setNewAccount] = useState(false)

  const signIn = () => {
    setLoginError(false)
    axios
      .post('http://hosting.dbentoby.com:3001' + '/signin', { email, password })
      .then(async res => {
        try {
          await AsyncStorage.setItem('userInfo', JSON.stringify(res))
        } catch (e) {
          console.log(e)
        }
        setIsLoading(false)
        props.navigation.navigate('Stores')
      })

      .catch(err => {
        console.log(err)
        setLoginError(true)
      })
  }

  useEffect(() => {
    const load = async () => {
      try {
        let getUserInfo = await AsyncStorage.getItem('userInfo')
        let rawInfo = JSON.parse(getUserInfo)
        const { token } = rawInfo.data

        if (token !== null) {
          console.log('User was found')
          props.navigation.navigate('Stores')
        }
      } catch (err) {
        console.log(err)
      }
    }

    load()
  }, [loginError])

  const handleSignUp = () => {
    alert('We will review your request and depending on your domain name we will send you an invitation')
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>D.BEN TOBY</Text>

        {newAccount ? (
          <>
            <Input
              placeholder='yourEmail@email.com'
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={<Icon name='envelope' size={18} color='#666' />}
              leftIconContainerStyle={{ marginRight: 6 }}
              keyboardType={'email-address'}
              onChangeText={setEmail}
            />
            <Input
              placeholder='Password'
              secureTextEntry
              leftIcon={<Icon name='lock' size={24} color='#666' />}
              leftIconContainerStyle={{ marginRight: 6 }}
              errorStyle={{ color: 'red' }}
              errorMessage={loginError ? 'Username or Password invalid' : ''}
              onChangeText={setPassword}
            />
            <Button
              title='SIGN UP'
              type='solid'
              icon={<Icon name='arrow-right' size={15} color='white' />}
              iconRight
              disabled={email.includes('@') && password.length !== 0 ? false : true}
              iconContainerStyle={{ color: 'red' }}
              containerStyle={{}}
              loading={isLoading ? false : null}
              titleStyle={{ color: '#fff', fontSize: 20, fontWeight: '400', marginRight: 10 }}
              buttonStyle={{ borderColor: '#666', backgroundColor: '#666', width: 150, marginTop: 20 }}
              onPress={handleSignUp}
            />
            <Text style={{marginTop: 20}}>New accounts are reviewed and accepted </Text>
            <Text>once email has been verified and approved.</Text>
            <Text style={{ marginTop: 40 }} onPress={() => setNewAccount(false)}>
              Already have an Account? - Login
            </Text>
          </>
        ) : (
          <>
            <Input
              placeholder='yourEmail@email.com'
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={<Icon name='envelope' size={18} color='#666' />}
              leftIconContainerStyle={{ marginRight: 6 }}
              keyboardType={'email-address'}
              onChangeText={setEmail}
            />
            <Input
              placeholder='Password'
              secureTextEntry
              leftIcon={<Icon name='lock' size={24} color='#666' />}
              leftIconContainerStyle={{ marginRight: 6 }}
              errorStyle={{ color: 'red' }}
              errorMessage={loginError ? 'Username or Password invalid' : ''}
              onChangeText={setPassword}
            />
            <Button
              title='LOGIN'
              type='solid'
              icon={<Icon name='arrow-right' size={15} color='white' />}
              iconRight
              disabled={email.includes('@') && password.length !== 0 ? false : true}
              iconContainerStyle={{ color: 'red' }}
              containerStyle={{}}
              loading={isLoading ? false : null}
              titleStyle={{ color: '#fff', fontSize: 20, fontWeight: '400', marginRight: 10 }}
              buttonStyle={{ borderColor: '#666', backgroundColor: '#666', width: 150, marginTop: 20 }}
              onPress={signIn}
            />
            <Text style={{ marginTop: 40 }} onPress={() => setNewAccount(true)}>
              Don't have an account? - Sign Up
            </Text>
          </>
        )}
      </View>
      <View>
        <Text style={{ color: '#666', textAlign: 'center', marginBottom: 40 }}>D.BenToby, Inc</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

LoginScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 100,
    width: '100%',
    padding: 40,
  },
  heading: {
    fontSize: 30,
    marginBottom: 40,
    color: '#848484',
  },
})

export default LoginScreen
