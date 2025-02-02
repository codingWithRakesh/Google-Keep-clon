import { create } from 'zustand';
import { API_URL } from '../constant/constants.js'
import { handleError, handleSuccess } from '../components/ErrorMessage.jsx';

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
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                set({ user: data.data, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false });
            throw error
        } finally {
            set({ isCheakingAuth: false });
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
            set({ isLoading: false, user: data.data.user, isAuthenticated: true });
            handleSuccess(data.message);
        } catch (error) {
            set({ isLoading: false, error: error.message });
            handleError(error.message)
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
            set({ isLoading: false, user: data.data.user, isAuthenticated: true });
            handleSuccess(data.message);
        } catch (error) {
            set({ isLoading: false, error: error.message });
            handleError(error.message)
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
            set({ isLoading: false, user: null, isAuthenticated: false });
            handleSuccess(data.message);
        } catch (error) {
            set({ isLoading: false, error: error.message });
            handleError(error.message)
            throw error;
        }
    },
}));