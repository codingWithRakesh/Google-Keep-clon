import React, { createContext, useContext, useState } from 'react'

export const ProfileContext = createContext()

const ProfileContextProvider = ({ children }) => {
    const [isProfile, setIsProfile] = useState(false)
    return (
        <ProfileContext.Provider value={[isProfile, setIsProfile]}>
            {children}
        </ProfileContext.Provider>
    )
}
export default ProfileContextProvider

export function useProfile() {
    return useContext(ProfileContext)
} 