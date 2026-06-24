<template>
    <div class="reporte-page">

        <!-- ── Toolbar (no imprimible) ── -->
        <div class="toolbar no-print">
            <div class="toolbar-brand">
                <div class="brand-icon">
                    <i class="pi pi-dollar"></i>
                </div>
                <div class="brand-text">
                    <span class="brand-title">Reporte de Pagos</span>
                    <span class="brand-sub">Pagos y anticipos registrados</span>
                </div>
            </div>
            <div class="toolbar-controls">
                <div class="date-control">
                    <label><i class="pi pi-calendar"></i> Inicio</label>
                    <DatePicker v-model="fechaInicioValue" dateFormat="dd/mm/yy" showIcon
                        :maxDate="new Date()" inputClass="date-input" />
                </div>
                <div class="date-control">
                    <label><i class="pi pi-calendar"></i> Fin</label>
                    <DatePicker v-model="fechaFinValue" dateFormat="dd/mm/yy" showIcon
                        :minDate="fechaInicioValue ?? undefined" :maxDate="new Date()"
                        placeholder="Opcional" inputClass="date-input" />
                </div>
                <div class="date-control">
                    <label>Tipo</label>
                    <Select v-model="tipoActivo" :options="tiposPago" optionLabel="label" optionValue="value"
                        placeholder="Todos" showClear class="filter-select" />
                </div>
                <div class="date-control">
                    <label>Forma de pago</label>
                    <Select v-model="formaPagoActiva" :options="formasPago"
                        placeholder="Todas" showClear class="filter-select" />
                </div>
                <Button label="Actualizar" icon="pi pi-refresh" size="small" @click="actualizarFiltros" class="btn-actualizar" />
                <Button label="Imprimir" icon="pi pi-print" size="small" severity="secondary" outlined @click="window.print()" class="btn-imprimir" />
            </div>
        </div>

        <!-- ── Estado de carga ── -->
        <div class="estado-carga no-print" v-if="loading">
            <ProgressSpinner strokeWidth="3" />
            <span>Cargando reporte...</span>
        </div>

        <!-- ── Error ── -->
        <div class="estado-error no-print" v-if="errorMsg && !loading">
            <div class="error-card">
                <i class="pi pi-exclamation-circle"></i>
                <p>{{ errorMsg }}</p>
                <Button label="Reintentar" icon="pi pi-refresh" size="small" @click="cargarReporte" />
            </div>
        </div>

        <!-- ── Contenido imprimible ── -->
        <div class="reporte-contenido" v-if="!loading && !errorMsg">

            <!-- Encabezado del documento -->
            <div class="doc-header">
                <div class="doc-header-left">
                    <h1 class="doc-title">Reporte de Pagos</h1>
                    <p class="doc-fecha">{{ rangoFormateado }}</p>
                    <p v-if="tipoActivo || formaPagoActiva" class="doc-filtros">
                        <span v-if="tipoActivo">Tipo: <strong>{{ tipoActivo }}</strong></span>
                        <span v-if="tipoActivo && formaPagoActiva"> · </span>
                        <span v-if="formaPagoActiva">Forma: <strong>{{ formaPagoActiva }}</strong></span>
                    </p>
                </div>
                <div class="doc-header-right">
                    <div class="doc-badge">
                        <span class="badge-num">{{ resumen.totalPagos }}</span>
                        <span class="badge-label">{{ resumen.totalPagos === 1 ? 'Pago' : 'Pagos' }}</span>
                    </div>
                </div>
            </div>

            <!-- Resumen por forma de pago -->
            <div class="resumen-chips" v-if="Object.keys(resumen.totalesPorFormaPago).length">
                <div v-for="(monto, forma) in resumen.totalesPorFormaPago" :key="forma" class="resumen-chip">
                    <span class="chip-forma">{{ forma }}</span>
                    <span class="chip-monto">{{ formatCurrency(monto) }}</span>
                </div>
                <div class="resumen-chip resumen-chip--total">
                    <span class="chip-forma">Total</span>
                    <span class="chip-monto">{{ formatCurrency(resumen.totalGeneral) }}</span>
                </div>
            </div>

            <!-- Tabla de pagos -->
            <table class="reporte-tabla">
                <thead>
                    <tr>
                        <th class="th-fecha">Fecha</th>
                        <th class="th-orden">Orden</th>
                        <th class="th-tipo">Tipo</th>
                        <th class="th-forma">Forma de Pago</th>
                        <th class="th-referencia">Referencia / Notas</th>
                        <th class="th-usuario">Registrado por</th>
                        <th class="th-monto">Monto</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(pago, idx) in pagos" :key="pago._id ?? idx" :class="{ 'row-even': idx % 2 === 1 }">
                        <td class="cell-fecha">{{ formatFecha(pago.fecha) }}</td>
                        <td class="cell-orden">
                            <span v-if="pago.ordenServicioId" class="chip-orden">
                                {{ (pago.ordenServicioId as any).numeroOrden ?? '—' }}
                            </span>
                            <span v-else class="muted">—</span>
                        </td>
                        <td class="cell-tipo">
                            <span :class="['tipo-badge', 'tipo-' + pago.tipo]">{{ pago.tipo ?? 'pago' }}</span>
                        </td>
                        <td class="cell-forma">{{ pago.formaPago }}</td>
                        <td class="cell-ref">
                            <span v-if="pago.referencia">{{ pago.referencia }}</span>
                            <span v-else-if="pago.notas" class="muted-italic">{{ pago.notas }}</span>
                            <span v-else class="muted">—</span>
                        </td>
                        <td class="cell-usuario">{{ (pago as any).createdByName ?? '—' }}</td>
                        <td class="cell-monto">{{ formatCurrency(pago.monto) }}</td>
                    </tr>
                    <tr v-if="pagos.length === 0">
                        <td colspan="7" class="empty-row">
                            <i class="pi pi-inbox"></i>
                            <span>No hay pagos registrados en este rango de fechas.</span>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="tfoot-total">
                        <td colspan="6" class="total-label-cell">Total del período</td>
                        <td class="cell-monto total-monto">{{ formatCurrency(resumen.totalGeneral) }}</td>
                    </tr>
                </tfoot>
            </table>

            <!-- Footer del documento -->
            <div class="doc-footer">
                <span class="footer-generated">Generado el {{ fechaGeneracion }}</span>
                <span class="footer-page">Página 1 de 1</span>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import ProgressSpinner from 'primevue/progressspinner'
import axios from 'axios'
import type { Pago } from '../models/pago'

const route  = useRoute()
const router = useRouter()

const loading  = ref(false)
const errorMsg = ref('')

interface Resumen {
    totalPagos: number
    totalGeneral: number
    totalesPorFormaPago: Record<string, number>
    totalesPorTipo: Record<string, number>
}

const pagos   = ref<Pago[]>([])
const resumen = ref<Resumen>({ totalPagos: 0, totalGeneral: 0, totalesPorFormaPago: {}, totalesPorTipo: {} })

// Filtros activos
const fechaInicioActiva  = ref<string>(getTodayStr())
const fechaFinActiva     = ref<string | null>(null)
const tipoActivo         = ref<string | null>(null)
const formaPagoActiva    = ref<string | null>(null)

// DatePicker bindings
const fechaInicioValue = ref<Date | null>(null)
const fechaFinValue    = ref<Date | null>(null)

const tiposPago  = [
    { label: 'Pago',     value: 'pago'     },
    { label: 'Anticipo', value: 'anticipo' }
]
const formasPago = ['Efectivo', 'Tarjeta', 'Cheque', 'Transferencia', 'Otro']

function getTodayStr(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseIsoToDate(iso: string): Date | null {
    const [y, m, d] = iso.split('-').map(Number)
    if (!y || !m || !d) return null
    return new Date(y, m - 1, d)
}

function toIsoDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatIsoLabel(iso: string | null): string {
    if (!iso) return ''
    const d = parseIsoToDate(iso)
    if (!d) return iso
    return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const rangoFormateado = computed(() => {
    const inicio = formatIsoLabel(fechaInicioActiva.value)
    if (!fechaFinActiva.value) return `A partir del ${inicio}`
    return `Del ${inicio} al ${formatIsoLabel(fechaFinActiva.value)}`
})

const fechaGeneracion = computed(() =>
    new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
)

function formatFecha(val: string | Date | undefined): string {
    if (!val) return '—'
    const d = val instanceof Date ? val : new Date(val)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatCurrency(val: number | null | undefined): string {
    if (val == null) return '$ 0.00'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

async function cargarReporte() {
    loading.value  = true
    errorMsg.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const token   = localStorage.getItem('auth_token')

        const body: Record<string, string> = {
            fechaInicio: `${fechaInicioActiva.value}T00:00:00.000Z`
        }
        if (fechaFinActiva.value) body.fechaFin = `${fechaFinActiva.value}T23:59:59.000Z`

        const queryParams = new URLSearchParams()
        if (tipoActivo.value)      queryParams.set('tipo',      tipoActivo.value)
        if (formaPagoActiva.value) queryParams.set('formaPago', formaPagoActiva.value)
        const qs = queryParams.toString() ? `?${queryParams.toString()}` : ''

        const res = await axios.post(`${baseURL}/pagos/reporte${qs}`, body, {
            headers: { Authorization: `Bearer ${token}` }
        })

        pagos.value   = res.data.data   ?? []
        resumen.value = res.data.resumen ?? { totalPagos: 0, totalGeneral: 0, totalesPorFormaPago: {}, totalesPorTipo: {} }
    } catch (e: any) {
        errorMsg.value = e?.response?.data?.message ?? 'Error al cargar el reporte.'
    } finally {
        loading.value = false
    }
}

function actualizarFiltros() {
    if (!fechaInicioValue.value) return
    fechaInicioActiva.value = toIsoDateStr(fechaInicioValue.value)
    fechaFinActiva.value    = fechaFinValue.value ? toIsoDateStr(fechaFinValue.value) : null

    const query: Record<string, string> = { fechaInicio: fechaInicioActiva.value }
    if (fechaFinActiva.value)   query.fechaFin    = fechaFinActiva.value
    if (tipoActivo.value)       query.tipo         = tipoActivo.value
    if (formaPagoActiva.value)  query.formaPago    = formaPagoActiva.value
    router.replace({ path: '/reporte-pagos', query })
    cargarReporte()
}

const window = globalThis.window

onMounted(() => {
    const q = route.query
    if (q.fechaInicio && /^\d{4}-\d{2}-\d{2}$/.test(q.fechaInicio as string)) {
        fechaInicioActiva.value = q.fechaInicio as string
    }
    if (q.fechaFin && /^\d{4}-\d{2}-\d{2}$/.test(q.fechaFin as string)) {
        fechaFinActiva.value = q.fechaFin as string
    }
    if (q.tipo)       tipoActivo.value      = q.tipo as string
    if (q.formaPago)  formaPagoActiva.value = q.formaPago as string

    fechaInicioValue.value = parseIsoToDate(fechaInicioActiva.value)
    fechaFinValue.value    = fechaFinActiva.value ? parseIsoToDate(fechaFinActiva.value) : null

    cargarReporte()
})
</script>

<style scoped>
/* ════════════════════════════════════════
   Variables
   ════════════════════════════════════════ */
.reporte-page {
    --color-primary:       #7c3aed;
    --color-primary-light: #ede9fe;
    --color-surface:       #ffffff;
    --color-bg:            #f5f3ff;
    --color-border:        #ddd6fe;
    --color-text:          #1e1b4b;
    --color-muted:         #6b7280;
    --color-row-even:      #f5f3ff;
    --radius:              10px;
    --shadow:              0 2px 12px rgba(0,0,0,0.08);

    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    background: var(--color-bg);
    min-height: 100vh;
    color: var(--color-text);
}

/* ── Toolbar ── */
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-wrap: wrap;
}

.toolbar-brand { display: flex; align-items: center; gap: 0.75rem; }

.brand-icon {
    width: 40px; height: 40px;
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
}

.brand-title { font-size: 1rem; font-weight: 800; color: var(--color-text); display: block; }
.brand-sub   { font-size: 0.75rem; color: var(--color-muted); display: block; }

.toolbar-controls {
    display: flex;
    align-items: flex-end;
    gap: 0.6rem;
    flex-wrap: wrap;
}

.date-control {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.date-control label {
    font-size: 11px;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
:deep(.date-input) {
    font-size: 13px !important;
    padding: 0.3rem 0.5rem !important;
    height: 32px !important;
}
.filter-select { min-width: 130px; font-size: 13px; }

.btn-actualizar { height: 32px; }
.btn-imprimir   { height: 32px; }

/* ── Estados ── */
.estado-carga, .estado-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: 200px;
    color: var(--color-muted);
}
.error-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem;
    background: #fff;
    border-radius: var(--radius);
    border: 1px solid #fecaca;
}
.error-card i { font-size: 2rem; color: #ef4444; }

/* ── Contenido imprimible ── */
.reporte-contenido {
    max-width: 1100px;
    margin: 1.5rem auto;
    padding: 0 1rem;
}

.doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
    gap: 1rem;
}
.doc-title {
    margin: 0 0 0.2rem;
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--color-text);
}
.doc-fecha  { margin: 0; font-size: 0.82rem; color: var(--color-muted); }
.doc-filtros { margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--color-muted); }

.doc-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: var(--radius);
    padding: 0.5rem 1rem;
    min-width: 70px;
}
.badge-num   { font-size: 1.6rem; font-weight: 800; line-height: 1; }
.badge-label { font-size: 0.65rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }

/* ── Resumen chips ── */
.resumen-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.resumen-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.75rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    font-size: 0.8rem;
}
.resumen-chip--total {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
}
.chip-forma  { font-weight: 600; }
.chip-monto  { font-variant-numeric: tabular-nums; }

/* ── Tabla ── */
.reporte-tabla {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-surface);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    font-size: 0.82rem;
}
.reporte-tabla thead tr {
    background: var(--color-primary);
    color: #fff;
}
.reporte-tabla th {
    padding: 0.55rem 0.75rem;
    text-align: left;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
}
.reporte-tabla th.th-monto { text-align: right; }

.reporte-tabla td {
    padding: 0.4rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
    vertical-align: middle;
}
.row-even td { background: var(--color-row-even); }

.cell-monto     { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; white-space: nowrap; }
.cell-fecha     { white-space: nowrap; color: var(--color-muted); font-size: 0.78rem; }
.cell-usuario   { font-size: 0.78rem; color: var(--color-muted); }
.muted          { color: var(--color-muted); }
.muted-italic   { color: var(--color-muted); font-style: italic; }

.chip-orden {
    display: inline-block;
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: 4px;
    padding: 1px 7px;
    font-weight: 700;
    font-size: 0.75rem;
}

.tipo-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    text-transform: capitalize;
}
.tipo-pago     { background: #dcfce7; color: #15803d; }
.tipo-anticipo { background: #fef9c3; color: #854d0e; }

/* ── Tfoot ── */
.tfoot-total { background: var(--color-primary-light); }
.total-label-cell {
    font-weight: 700;
    color: var(--color-primary);
    text-align: right;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
}
.total-monto {
    font-size: 1rem;
    font-weight: 800;
    color: var(--color-primary);
}

/* ── Empty ── */
.empty-row {
    text-align: center;
    padding: 3rem !important;
    color: var(--color-muted);
}
.empty-row i { font-size: 2rem; opacity: 0.4; display: block; margin-bottom: 0.5rem; }

/* ── Footer doc ── */
.doc-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    font-size: 0.75rem;
    color: var(--color-muted);
}

/* ── Print ── */
@media print {
    .no-print { display: none !important; }
    .reporte-page { background: #fff; }
    .reporte-contenido { margin: 0; padding: 0; max-width: 100%; }
    .reporte-tabla { box-shadow: none; border: 1px solid #ccc; }
}
</style>
