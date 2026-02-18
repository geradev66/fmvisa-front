import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

    // Load from localStorage on initialization
    const loadFromStorage = () => {
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedUser) user.value = JSON.parse(storedUser);
        if (storedToken) token.value = storedToken;
    };

    // Save to localStorage
    const saveToStorage = () => {
        if (user.value) localStorage.setItem('auth_user', JSON.stringify(user.value));
        if (token.value) localStorage.setItem('auth_token', token.value);
    };

    // Clear localStorage
    const clearStorage = () => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
    };

    const isAuthenticated = computed(() => !!token.value && !!user.value);

    const login = (userData: User, authToken: string) => {
        user.value = userData;
        token.value = authToken;
        saveToStorage();
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        clearStorage();
    };

    const setUser = (userData: User) => {
        user.value = userData;
        saveToStorage();
    };

    const setToken = (authToken: string) => {
        token.value = authToken;
        saveToStorage();
    }

    // Initialize on creation
    loadFromStorage();

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        setUser,
        setToken,
        loadFromStorage,
    };
});