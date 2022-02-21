import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Button } from 'react-native'
import Signature from 'react-native-signature-canvas'

const SignatureScreen = ({ getSignature }) => {
	const [signature, setSign] = useState(null)
  console.log('signature screen started')
  

	const handleSignature = signature => {
    setSign(signature)
    getSignature(signature)
	}

	const handleEmpty = () => {
		console.log('Empty')
  }
  

	const style = `.m-signature-pad--footer
    .button {
      // background-color: red;
      color: #FFF;
    }`

    const webStyle = `.m-signature-pad--footer
    .save {
        display: none;
    }
    .clear {
        display: none;
    }
`

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.preview}>
				{signature ? (
					<Image resizeMode={'contain'} style={{ width: 335, height: 114 }} source={{ uri: signature }} />
				) : null}
			</View>
			<Signature
				onOK={handleSignature}
				onEmpty={handleEmpty}
				descriptionText='Sign Above'
				clearText='Clear'
				confirmText='Save'
				// webStyle={style}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	preview: {
		// width: 335,
		// height: 114,
		// backgroundColor: '#F8F8F8',
		// justifyContent: 'center',
		// alignItems: 'center',
		// marginTop: 15,
	},
	previewText: {
		// color: '#FFF',
		// fontSize: 14,
		// height: 40,
		// lineHeight: 40,
		// paddingLeft: 10,
		// paddingRight: 10,
		// backgroundColor: '#69B2FF',
		// width: 120,
		// textAlign: 'center',
		// marginTop: 10,
	},
})

export default SignatureScreen



