<template>
    <div class="login-page">
        <div class="login-container">
            <Card class="login-card">
                <template #header>
                    <div class="login-header">
                        <img src="../../public/1.jpg" alt="FM Visa App Logo">
                        <h1>FM Visa App</h1>
                        <p>Iniciar Sesión</p>
                    </div>
                </template>
                <template #content>
                    <form @submit.prevent="handleLogin" class="login-form">
                        <div class="form-field">
                            <label for="username">Usuario</label>
                            <InputText 
                                id="username" 
                                v-model="credentials.username" 
                                placeholder="Ingresa tu usuario"
                                :class="{ 'p-invalid': errors.username }"
                            />
                            <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
                        </div>

                        <div class="form-field">
                            <label for="password">Contraseña</label>
                            <Password 
                                id="password" 
                                v-model="credentials.password" 
                                placeholder="Ingresa tu contraseña"
                                :feedback="false"
                                toggleMask
                                :class="{ 'p-invalid': errors.password }"
                            />
                            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
                        </div>

                        <div class="form-field checkbox-field">
                            <Checkbox v-model="rememberMe" inputId="remember" :binary="true" />
                            <label for="remember">Recordarme</label>
                        </div>

                        <Button 
                            type="submit" 
                            label="Iniciar Sesión" 
                            icon="pi pi-sign-in" 
                            class="login-button"
                            :loading="loading"
                        />

                        <div class="login-footer">
                            <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div>
                            Version {{ appVersion }}
                        </div>
                    </form>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import { useAuthStore } from '../stores/AuthStore'
import { useAuthService } from '../composables/useAuthService'
import { useToast } from '../composables/useToast'

const router = useRouter()
const authService = useAuthService()
const authStore = useAuthStore()
const toast = useToast()

const credentials = ref({
    username: '',
    password: ''
})

const errors = ref({
    username: '',
    password: ''
})

const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'

const rememberMe = ref(false)
const loading = ref(false)

const validateForm = () => {
    errors.value = {
        username: '',
        password: ''
    }
    
    let isValid = true
    
    if (!credentials.value.username) {
        errors.value.username = 'El usuario es requerido'
        isValid = false
    }
    
    if (!credentials.value.password) {
        errors.value.password = 'La contraseña es requerida'
        isValid = false
    } else if (credentials.value.password.length < 6) {
        errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
        isValid = false
    }
    
    return isValid
}

const handleLogin = async () => {
    if (!validateForm()) {
        toast.showWarning('Por favor completa todos los campos correctamente')
        return
    }
    
    loading.value = true
    
    try {
        console.log(credentials.value)
        const response = await authService.login(credentials.value.username, credentials.value.password)
        authStore.setUser(response.user)
        authStore.setToken(response.token)
        toast.showSuccess(`¡Bienvenido ${response.user.firstName}!`, 'Inicio de sesión exitoso')
        router.push('/orden-servicio')
    } catch (error: any) {   
        
        const errorMessage = error.response?.data?.message || 'Usuario o contraseña incorrectos'
        toast.showError(errorMessage, 'Error al iniciar sesión')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
    .login-header img{
        width: 15rem;
        height: 15rem;
    }
.login-page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
    width: 100%;
    max-width: 450px;
}

.login-card {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
    text-align: center;
    padding: 2rem 2rem 1rem;
    background: white;
}

.login-header h1 {
    font-size: 1.75rem;
    color: #1e293b;
    margin: 1rem 0 0.5rem;
}

.login-header p {
    color: #64748b;
    font-size: 1rem;
    margin: 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-field label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
}

.form-field :deep(.p-inputtext),
.form-field :deep(.p-password) {
    width: 100%;
}

.form-field :deep(.p-password-input) {
    width: 100%;
}

.checkbox-field {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.checkbox-field label {
    margin: 0;
    cursor: pointer;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
}

.login-footer {
    text-align: center;
    margin-top: 0.5rem;
}

.forgot-password {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s;
}

.forgot-password:hover {
    color: #2563eb;
    text-decoration: underline;
}

.p-error {
    color: #ef4444;
    font-size: 0.75rem;
}

:deep(.p-invalid) {
    border-color: #ef4444;
}

@media (max-width: 640px) {
    .login-header {
        padding: 1.5rem 1rem 0.5rem;
    }
    
    .login-header h1 {
        font-size: 1.5rem;
    }
    .login-header img{
        width:9rem;
        height:9rem;
    }
}</style>