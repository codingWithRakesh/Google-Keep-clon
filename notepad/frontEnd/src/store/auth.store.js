import { create } from 'zustand';
import { API_URL } from '../constant/constants.js'
import { handleSuccess } from '../components/ErrorMessage.jsx';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    message: null,
    isCheakingAuth: true,
    isAuthenticated: false,
    fetchAuth: async () => {
        try {
            const response = await fetch(`${API_URL}/currentuser`, {
                method: 'GET',
                credentials: 'include', // Ensures cookies are sent
            });
            const data = await response.json();

            if (response.ok) {
                set({ user: data.data.user, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false });
        }
    },
    signUp: async (userName, email, fullName, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userName, email, fullName, password }),
            });
            const data = await response.json();
            console.log("data ", data);
            set({ isLoading: false, user: data.data.user, isAuthenticated: true });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error(error.message);
            throw error;
        }
    },
    login: async (userName, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userName, password }),
            });
            const data = await response.json();
            console.log("data ", data);
            set({ isLoading: false, user: data.data.user, isAuthenticated: true });
            handleSuccess(data.message);
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error(error.message);
            throw error;
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            console.log("data ", data);
            set({ isLoading: false, user: null, isAuthenticated: false });
        } catch (error) {
            set({ isLoading: false, error: error.message });
            console.error(error.message);
            throw error;
        }
    },
}));