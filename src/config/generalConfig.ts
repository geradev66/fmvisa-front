interface GeneralConfig {
    apiBaseUrl: string
    isDemo: boolean
}

export const generalConfig: GeneralConfig = {
    apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    isDemo: import.meta.env.VITE_DEMO === 'true'
}