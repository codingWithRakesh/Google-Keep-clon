import React, { createContext, useContext, useState } from 'react'

export const FetchMainContext = createContext()

const FetchMainContextProvider = ({ children }) => {
    const [valueMain, setValueMain] = useState(null)
    return (
        <FetchMainContext.Provider value={[valueMain, setValueMain]}>
            {children}
        </FetchMainContext.Provider>
    )
}
export default FetchMainContextProvider

export function useMainContainer() {
    return useContext(FetchMainContext)
} 