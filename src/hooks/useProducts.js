import { useEffect, useState } from 'react'

import getProducts from '../api/base'

export default () => {
	const [products, setProducts] = useState([])

	useEffect(() => {
		getProducts
			.get('/api/products')
			.then(res => {
				setProducts(res.data)
			})
			.catch(err => {
				alert(err)
				console.log(err)
			})
	},[])

	return [products]
}
