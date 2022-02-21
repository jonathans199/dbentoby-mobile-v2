import React from 'react'

const StoreContext = React.createContext()

export const StoreProvider = ({ children }) => {
	return <StoreContext.Provider value={5}>{children}</StoreContext.Provider>
}

export default StoreContext

