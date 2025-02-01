import { Suspense, useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MainContainer from './components/MainContainer'
import CreateLabel from './pages/CreateLabel'
import BlurContainer from './components/BlurContainer'
import Profile from './components/Profile'
import UpdateNote from './components/UpdateNote'
import SearchComponent from './components/SearchComponent'
import { Outlet } from 'react-router-dom'
import { useProfile } from './contexts/Profile.context'
import { useLabel } from './contexts/EditLabel.context'
import { useAuthStore } from './store/auth.store.js'

function App() {
  const [isProfile] = useProfile()
  const [isLabel, setIsLabel] = useLabel()


  const { fetchAuth } = useAuthStore()
  useEffect(() => {
    fetchAuth()
  }, [])

  return (
    <>
      <div className='w-full min-h-screen'>
        <Navbar />
        <Sidebar />
        <Suspense>
          <Outlet />
        </Suspense>

        {isProfile && <Profile />}

        {/* <BlurContainer>
          <UpdateNote />
        </BlurContainer> */}

        {isLabel && <BlurContainer>
          <CreateLabel />
        </BlurContainer>}

      </div>
    </>
  )
}

export default App
