import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { handleError, handleSuccess } from '../components/ErrorMessage.jsx';
import { ToastContainer } from 'react-toastify';

const Login = () => {
    const [value, setValue] = useState({
        userName: '',
        password: ''
    })
    const { login, isLoading } = useAuthStore()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setValue((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(value.userName, value.password)
        setTimeout(() => {
            navigate('/')
        }, 1000)
    }
    return (
        <>
            <Link to="/singup" className='h-10 min-w-4 rounded-lg centerItem absolute top-4 right-4 px-3 bg-[#0891B2] text-white'>Singup</Link>
            <form onSubmit={handleSubmit} className='bg-gray-800 w-[20rem] p-6 border border-gray-700 h-[20rem] flex flex-col items-center justify-center rounded-lg'>
                <h1 className='text-white text-2xl'>Login</h1>
                <input type="text" className='bg-[#374151] outline-none text-white px-2 w-full border border-gray-700 h-10 mt-4 rounded-md' placeholder='Username' name='userName' value={value.userName} onChange={handleChange} />
                <input type="password" className='bg-[#374151] outline-none text-white px-2 border border-gray-700 w-full h-10 mt-4 rounded-md' placeholder='Password' name='password' value={value.password} onChange={handleChange} />
                <button type='submit' className='bg-[#0891B2] w-full h-10 mt-4 rounded-md text-white'>
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </>
    )
}

export default Login