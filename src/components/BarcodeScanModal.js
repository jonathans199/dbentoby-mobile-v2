import React, { useState, useEffect } from 'react'
import { Alert, Modal, StyleSheet, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Button, Text } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner'

const BarcodeScanModel = props => {
	const [modalVisible, setModalVisible] = useState(false)
	const [hasPermission, setHasPermission] = useState(null)
	const [scanned, setScanned] = useState(false)

	useEffect(() => {
		;(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync()
			setHasPermission(status === 'granted')
		})()
	}, [])

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true)
		setModalVisible(false)
		alert(`Barcode ${data} has been scanned!`)
		props.sendData(data)
		// props.sendData(data.replace(/^0+/, ''))
	}

	if (hasPermission === null) {
		return <Text>Requesting for camera permission to scan barcode</Text>
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>
	}

	return (
		<View>
			<Modal
				animationType='slide'
				visible={modalVisible}
				presentationStyle='fullScreen'
				onRequestClose={() => {
					Alert.alert('Modal has been closed.')
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<BarCodeScanner
							onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
							style={[StyleSheet.absoluteFill, styles.barcodeContainer]}
						>
							<View style={styles.layerTop} />
							<View style={styles.layerCenter}>
								<View style={styles.layerLeft} />
								<View style={styles.focused} />
								<View style={styles.layerRight} />
							</View>
							<View style={styles.layerBottom} />
						</BarCodeScanner>

						{/* {scanned && (
							<Button
								title={'Tap to Scan Again'}
								style={{ width: 200, marginTop: 30 }}
								onPress={() => setScanned(false)}
							/>
						)} */}

						<TouchableHighlight
							style={styles.hideModalButton}
							onPress={() => {
								setModalVisible(!modalVisible)
							}}
						>
							<Text style={{ color: 'white', marginTop: 40, marginLeft: 40, fontSize: 40 }}>X</Text>
						</TouchableHighlight>
					</View>
				</View>
			</Modal>
			<Button
				buttonStyle={{
					backgroundColor: '#2d2d2d',
					paddingTop: 20,
					paddingBottom: 20,
					borderRadius: 0,
					width: 60,
				}}
				icon={<Icon name='camera' size={25} color='#666' />}
				onPress={() => {
					setModalVisible(true), setScanned(false)
				}}
			/>
		</View>
	)
}

const opacity = 'rgba(0, 0, 0, .6)'
const styles = StyleSheet.create({
	// // not used
	// container: {
	// 	flex: 1,
	// 	alignItems: 'center',
	// 	height: '100%',
	// 	width: '100%',
	// 	flexDirection: 'column',
	// },

	centeredView: {
		backgroundColor: 'red',
		// justifyContent: 'flex-start',
		alignItems: 'center',
		// width: '100%'
		height: '60%',
		marginTop: '20%',
		// marginBottom: '20%',
	},
	modalView: {
		flex: 1,
		width: '100%',
		// margin: 20,
		// backgroundColor: '#000000a8',
		backgroundColor: 'blue',
		// borderRadius: 3,
		// padding: 100,
		// alignItems: 'center',
		// shadowColor: '#000000a8',
		// shadowOffset: {
		// 	width: 0,
		// 	height: 2,
		// },
		// shadowOpacity: 0.25,
		// shadowRadius: 3.84,
		// elevation: 5,
	},
	hideModalButton: {
		// flex: 1,
		// justifyContent: 'center',
		// backgroundColor: 'blue',
		// width: 100,
	},
	modalText: {
		// marginBottom: 15,
		// textAlign: 'center',
		// color: 'white',
	},
	barcodeContainer: {
		// flex: 1,
		// flexDirection: 'column',
		// width: '100%'
	},
	// layerTop: {
	// 	flex: 0.5,
	// 	backgroundColor: opacity,
	// },
	// layerCenter: {
	// 	flex: 3,
	// 	flexDirection: 'row',
	// },
	// layerLeft: {
	// 	flex: 1,
	// 	backgroundColor: opacity,
	// },
	// focused: {
	// 	// flex: 9,
	// 	width: 300,
	// 	height: '90%',
	// 	// borderWidth: 0.5,
	// 	// borderColor: 'white',
	// },
	// layerRight: {
	// 	flex: 1,
	// 	backgroundColor: opacity,
	// },
	// layerBottom: {
	// 	flex: 1,
	// 	backgroundColor: opacity,
	// },

	layerTop: {
		flex: 2,
		backgroundColor: opacity,
	},
	layerCenter: {
		flex: 1,
		flexDirection: 'row',
	},
	layerLeft: {
		flex: 1,
		backgroundColor: opacity,
	},
	focused: {
		flex: 10,
	},
	layerRight: {
		flex: 1,
		backgroundColor: opacity,
	},
	layerBottom: {
		flex: 2,
		backgroundColor: opacity,
	},
})

export default BarcodeScanModel
