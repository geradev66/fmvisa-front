<template>
    <div class="home-page">
        <header class="hero">
            <h1>Welcome to FM Visa App</h1>
            <p>Your gateway to visa application management</p>
        </header>

        <section class="features">
            <div class="feature-card">
                <h3>Easy Application</h3>
                <p>Submit your visa application quickly and securely</p>
            </div>
            
            <div class="feature-card">
                <h3>Track Status</h3>
                <p>Monitor your application progress in real-time</p>
            </div>
            
            <div class="feature-card">
                <h3>Document Management</h3>
                <p>Upload and manage your documents easily</p>
            </div>
        </section>

        <section class="cta">
            <button @click="getStarted" class="btn-primary">Get Started</button>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const getStarted = () => {
    router.push('/orden-servicio')
}
</script>

<style scoped>
.home-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    padding: 4rem 0;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.hero p {
    font-size: 1.25rem;
    color: #7f8c8d;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.feature-card {
    padding: 2rem;
    border-radius: 8px;
    background: #f8f9fa;
    text-align: center;
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
}

.cta {
    text-align: center;
    margin: 3rem 0;
}

.btn-primary {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-primary:hover {
    background: #2980b9;
}
</style>