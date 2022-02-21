import { useEffect, useState, useContext } from 'react'

import apiInstance from '../api/base'
// import StoreContext from '../context/StoresContext'

export default () => {
	const [stores, setStores] = useState([])

	// const value = useContext(StoreContext)

	useEffect(() => {
		apiInstance
			.get('/api/stores')
			.then(res => {
				setStores(res.data)
			})
			.catch(err => {
				alert(err)
			})
	}, [])

	return [stores]
}
