import React, { createContext, useContext, useState } from 'react'

export const LabelContext = createContext()

const LabelContextProvider = ({ children }) => {
    const [isLabel, setIsLabel] = useState(false)
    return (
        <LabelContext.Provider value={[isLabel, setIsLabel]}>
            {children}
        </LabelContext.Provider>
    )
}
export default LabelContextProvider

export function useLabel() {
    return useContext(LabelContext)
} 