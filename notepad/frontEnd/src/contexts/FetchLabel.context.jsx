import React, { createContext, useContext, useState } from 'react'

export const FetchLabelContext = createContext()

const FetchLabelContextProvider = ({ children }) => {
    const [valueLabel, setValueLabel] = useState("")
    return (
        <FetchLabelContext.Provider value={[valueLabel, setValueLabel]}>
            {children}
        </FetchLabelContext.Provider>
    )
}
export default FetchLabelContextProvider

export function useFetchLabel() {
    return useContext(FetchLabelContext)
} 