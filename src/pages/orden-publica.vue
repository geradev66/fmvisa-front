<template>
    <div class="orden-publica-page">
        <!-- Header -->
        <header class="page-header">
            <div class="header-content">
                <i class="pi pi-wrench header-icon"></i>
                <div>
                    <h1 class="header-title">FM Visa</h1>
                    <p class="header-subtitle">Estado de tu orden de servicio</p>
                </div>
            </div>
        </header>

        <!-- Loading -->
        <div v-if="loading" class="state-container">
            <i class="pi pi-spin pi-spinner state-icon"></i>
            <p>Cargando tu orden...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state-container state-error">
            <i class="pi pi-exclamation-circle state-icon"></i>
            <h2>No encontramos tu orden</h2>
            <p>{{ error }}</p>
        </div>

        <!-- Content -->
        <main v-else-if="orden" class="page-content">

            <!-- Order number + status -->
            <section class="card status-card">
                <div class="order-number">
                    <span class="label">Orden #</span>
                    <span class="value">{{ orden.numeroOrden }}</span>
                </div>
                <div class="status-badge" :class="estadoClass">
                    <i :class="estadoIcon"></i>
                    <span>{{ estadoLabel }}</span>
                </div>
                <p class="order-date">
                    <i class="pi pi-calendar"></i>
                    Ingreso: {{ formatDate(orden.fechas?.ingreso) }}
                </p>
                <p v-if="orden.fechas?.salida" class="order-date">
                    <i class="pi pi-calendar-clock"></i>
                    Entrega estimada: {{ formatDate(orden.fechas.salida) }}
                </p>
            </section>

            <!-- Customer -->
            <section class="card" v-if="orden.cliente">
                <h3 class="section-title">
                    <i class="pi pi-user"></i> Cliente
                </h3>
                <p class="info-line">{{ orden.cliente.nombre }}</p>
                <p class="info-line muted" v-if="orden.cliente.celular">
                    <i class="pi pi-phone"></i> {{ orden.cliente.celular }}
                </p>
            </section>

            <!-- Equipment -->
            <section class="card" v-if="orden.equipo">
                <h3 class="section-title">
                    <i class="pi pi-desktop"></i> Equipo
                </h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Marca</span>
                        <span class="info-value">{{ orden.equipo.marca }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Modelo</span>
                        <span class="info-value">{{ orden.equipo.modelo }}</span>
                    </div>
                    <div class="info-item" v-if="orden.equipo.tipo">
                        <span class="info-label">Tipo</span>
                        <span class="info-value">{{ orden.equipo.tipo }}</span>
                    </div>
                    <div class="info-item" v-if="orden.equipo.noSerie">
                        <span class="info-label">No. Serie</span>
                        <span class="info-value">{{ orden.equipo.noSerie }}</span>
                    </div>
                </div>
                <div class="info-block" v-if="orden.equipo.falla">
                    <span class="info-label">Falla reportada</span>
                    <p class="info-text">{{ orden.equipo.falla }}</p>
                </div>
                <div class="info-block" v-if="orden.equipo.diagnostico">
                    <span class="info-label">Diagnóstico</span>
                    <p class="info-text">{{ orden.equipo.diagnostico }}</p>
                </div>
            </section>

            <!-- Financial summary -->
            <section class="card" v-if="orden.financiero">
                <h3 class="section-title">
                    <i class="pi pi-wallet"></i> Resumen financiero
                </h3>
                <div class="financial-rows">
                    <div class="financial-row" v-if="presupuestoTotal > 0">
                        <span>Presupuesto</span>
                        <span>{{ formatMoney(presupuestoTotal) }}</span>
                    </div>
                    <div class="financial-row" v-if="orden.financiero.iva > 0">
                        <span>IVA</span>
                        <span>{{ formatMoney(orden.financiero.iva) }}</span>
                    </div>
                    <div class="financial-row total-row">
                        <span>Total</span>
                        <span>{{ formatMoney(total) }}</span>
                    </div>
                    <div class="financial-row paid-row" v-if="abonado > 0">
                        <span>Abonado</span>
                        <span>{{ formatMoney(abonado) }}</span>
                    </div>
                    <div class="financial-row balance-row" v-if="saldo > 0">
                        <span>Saldo pendiente</span>
                        <span>{{ formatMoney(saldo) }}</span>
                    </div>
                </div>
            </section>

            <!-- Repair notes -->
            <section class="card" v-if="orden.estado?.descripcionReparacion">
                <h3 class="section-title">
                    <i class="pi pi-file-edit"></i> Notas de reparación
                </h3>
                <p class="info-text">{{ orden.estado.descripcionReparacion }}</p>
            </section>

            <!-- History -->
            <section class="card" v-if="orden.historial?.length">
                <h3 class="section-title">
                    <i class="pi pi-history"></i> Historial
                </h3>
                <ul class="historial-list">
                    <li v-for="item in historialReciente" :key="item._id ?? item.fecha" class="historial-item">
                        <div class="historial-dot"></div>
                        <div class="historial-body">
                            <span class="historial-accion">{{ item.accion }}</span>
                            <span class="historial-meta">{{ formatDateTime(item.fecha) }}</span>
                        </div>
                    </li>
                </ul>
                <button v-if="orden.historial.length > 5 && !mostrarTodoHistorial"
                    class="ver-mas-btn" @click="mostrarTodoHistorial = true">
                    Ver todo el historial ({{ orden.historial.length }})
                </button>
            </section>

            <!-- Footer -->
            <footer class="page-footer">
                <p>Para cualquier duda comunícate con nosotros</p>
                <p class="footer-fecha">Consultado el {{ formatDateTime(new Date().toISOString()) }}</p>
            </footer>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { OrdenServicio } from '../models/orden-servicio'

const route = useRoute()

const loading = ref(false)
const error = ref<string | null>(null)
const orden = ref<OrdenServicio | null>(null)
const mostrarTodoHistorial = ref(false)

// ── Fetch (sin token — endpoint público) ──
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' }
})

onMounted(async () => {
    const id = route.params.id as string
    if (!id) {
        error.value = 'No se proporcionó un identificador de orden.'
        return
    }
    try {
        loading.value = true
        const response = await api.get<OrdenServicio>(`/ordenes-servicio/publica/${id}`)
        orden.value = response.data
    } catch (e: any) {
        if (e?.response?.status === 404) {
            error.value = 'La orden no existe o el enlace no es válido.'
        } else {
            error.value = 'No se pudo cargar la información. Intenta más tarde.'
        }
    } finally {
        loading.value = false
    }
})

// ── Estado helpers ──
const estadoConfig: Record<string, { label: string; icon: string; cls: string }> = {
    Pendiente:  { label: 'En revisión',               icon: 'pi pi-clock',          cls: 'estado-pendiente'  },
    Autoriza:   { label: 'Esperando autorización',    icon: 'pi pi-question-circle', cls: 'estado-autoriza'   },
    Informa:    { label: 'Para informar al cliente',  icon: 'pi pi-megaphone',       cls: 'estado-informa'    },
    Refacción:  { label: 'En espera de refacción',    icon: 'pi pi-box',             cls: 'estado-refaccion'  },
    Entregar:   { label: 'Listo para entregar',       icon: 'pi pi-check-circle',    cls: 'estado-entregar'   },
    Ninguno:    { label: 'Sin estado',                icon: 'pi pi-minus-circle',    cls: 'estado-ninguno'    },
}

const estadoInfo = computed(() =>
    orden.value ? (estadoConfig[orden.value.estadoOrden] ?? estadoConfig['Ninguno']) : estadoConfig['Ninguno']
)
const estadoLabel = computed(() => estadoInfo.value?.label)
const estadoIcon  = computed(() => estadoInfo.value?.icon)
const estadoClass = computed(() => estadoInfo.value?.cls)

// ── Financial computed ──
const presupuestoTotal = computed(() =>
    (orden.value?.financiero?.presupuesto ?? 0) + (orden.value?.financiero?.revision ?? 0)
)
const total    = computed(() => presupuestoTotal.value + (orden.value?.financiero?.iva ?? 0))
const abonado  = computed(() => (orden.value?.financiero?.anticipo ?? 0) + (orden.value?.financiero?.pagos ?? 0))
const saldo    = computed(() => Math.max(0, total.value - abonado.value))

// ── Historial ──
const historialReciente = computed(() => {
    if (!orden.value?.historial) return []
    const sorted = [...orden.value.historial].reverse()
    return mostrarTodoHistorial.value ? sorted : sorted.slice(0, 5)
})

// ── Formatters ──
const formatDate = (d: Date | string | null | undefined) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatDateTime = (d: Date | string | null | undefined) => {
    if (!d) return '—'
    return new Date(d).toLocaleString('es-MX', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const formatMoney = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
</script>

<style scoped>
/* ── Base ── */
.orden-publica-page {
    min-height: 100vh;
    background: #f1f5f9;
    font-family: system-ui, -apple-system, sans-serif;
}

/* ── Header ── */
.page-header {
    background: #1e40af;
    color: #fff;
    padding: 1.25rem 1rem;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 560px;
    margin: 0 auto;
}

.header-icon {
    font-size: 1.75rem;
    flex-shrink: 0;
}

.header-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
}

.header-subtitle {
    margin: 0;
    font-size: 0.8rem;
    opacity: 0.8;
}

/* ── States ── */
.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 4rem 1.5rem;
    text-align: center;
    color: #64748b;
}

.state-error {
    color: #dc2626;
}

.state-icon {
    font-size: 2.5rem;
}

/* ── Content ── */
.page-content {
    max-width: 560px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
}

/* ── Card ── */
.card {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.1rem 1.25rem;
    box-shadow: 0 1px 3px rgba(0,0,0,.07);
}

/* ── Status card ── */
.status-card {
    border-top: 4px solid #3b82f6;
}

.order-number {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
}

.order-number .label {
    font-size: 0.8rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: .05em;
}

.order-number .value {
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e293b;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    margin-bottom: 0.75rem;
}

.order-date {
    margin: 0.2rem 0;
    font-size: 0.82rem;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

/* ── Status badge variants ── */
.estado-pendiente  { background: #fef9c3; color: #a16207; }
.estado-autoriza   { background: #ffedd5; color: #9a3412; }
.estado-informa    { background: #dbeafe; color: #1d4ed8; }
.estado-refaccion  { background: #f3e8ff; color: #7e22ce; }
.estado-entregar   { background: #dcfce7; color: #166534; }
.estado-ninguno    { background: #f1f5f9; color: #64748b; }

/* ── Section title ── */
.section-title {
    margin: 0 0 0.75rem;
    font-size: 0.88rem;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: .04em;
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

/* ── Info lines ── */
.info-line {
    margin: 0.2rem 0;
    font-size: 0.95rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.info-line.muted { color: #64748b; font-size: 0.875rem; }

/* ── Info grid ── */
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.info-label {
    font-size: 0.72rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: .04em;
}

.info-value {
    font-size: 0.92rem;
    font-weight: 500;
    color: #1e293b;
}

.info-block {
    margin-top: 0.6rem;
}

.info-text {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: #334155;
    line-height: 1.5;
}

/* ── Financial ── */
.financial-rows {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.financial-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #475569;
    padding: 0.2rem 0;
}

.total-row {
    border-top: 1px solid #e2e8f0;
    padding-top: 0.5rem;
    margin-top: 0.25rem;
    font-weight: 700;
    font-size: 1rem;
    color: #1e293b;
}

.paid-row  { color: #16a34a; }
.balance-row { font-weight: 600; color: #dc2626; }

/* ── Historial ── */
.historial-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.historial-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.historial-item:last-child { border-bottom: none; }

.historial-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #3b82f6;
    flex-shrink: 0;
    margin-top: 0.35rem;
}

.historial-body {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.historial-accion {
    font-size: 0.88rem;
    color: #1e293b;
}

.historial-meta {
    font-size: 0.75rem;
    color: #94a3b8;
}

.ver-mas-btn {
    margin-top: 0.75rem;
    background: none;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    font-size: 0.82rem;
    color: #475569;
    cursor: pointer;
    width: 100%;
}

.ver-mas-btn:hover { background: #f8fafc; }

/* ── Footer ── */
.page-footer {
    text-align: center;
    padding: 1rem 0 1.5rem;
    font-size: 0.8rem;
    color: #94a3b8;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
</style>
