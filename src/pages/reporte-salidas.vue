<template>
    <div class="reporte-page">

        <!-- ── Toolbar (no imprimible) ── -->
        <div class="toolbar no-print">
            <div class="toolbar-brand">
                <div class="brand-icon">
                    <i class="pi pi-sign-out"></i>
                </div>
                <div class="brand-text">
                    <span class="brand-title">Reporte de Salidas</span>
                    <span class="brand-sub">Salida de equipos</span>
                </div>
            </div>
            <div class="toolbar-controls">
                <div class="date-control">
                    <label><i class="pi pi-calendar"></i> Inicio</label>
                    <DatePicker
                        v-model="fechaInicioValue"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :maxDate="new Date()"
                        inputClass="date-input"
                    />
                </div>
                <div class="date-control">
                    <label><i class="pi pi-calendar"></i> Fin</label>
                    <DatePicker
                        v-model="fechaFinValue"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :minDate="fechaInicioValue ?? undefined"
                        :maxDate="new Date()"
                        placeholder="Opcional"
                        inputClass="date-input"
                    />
                </div>
                <Button label="Actualizar" icon="pi pi-refresh" size="small" @click="actualizarFechas" class="btn-actualizar" />
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
                    <h1 class="doc-title">Reporte de Salidas de Equipos</h1>
                    <p class="doc-fecha">{{ rangoFormateado }}</p>
                </div>
                <div class="doc-header-right">
                    <div class="doc-badge">
                        <span class="badge-num">{{ ordenes.length }}</span>
                        <span class="badge-label">{{ ordenes.length === 1 ? 'Salida' : 'Salidas' }}</span>
                    </div>
                </div>
            </div>

            <!-- Tabla -->
            <table class="reporte-tabla">
                <thead>
                    <tr>
                        <th class="th-orden">No. Orden</th>
                        <th class="th-cliente">Cliente</th>
                        <th class="th-equipo">Equipo</th>
                        <th class="th-fecha">Ingreso</th>
                        <th class="th-fecha">Salida</th>
                        <th class="th-pago">Forma de Pago</th>
                        <th class="th-monto">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(orden, idx) in ordenes" :key="orden._id ?? idx" :class="{ 'row-even': idx % 2 === 1 }">
                        <td class="cell-numero">
                            <span class="chip-orden">{{ orden.numeroOrden }}</span>
                        </td>
                        <td class="cell-cliente">{{ orden.cliente?.nombre ?? '—' }}</td>
                        <td class="cell-equipo">
                            <span class="equipo-marca">{{ orden.equipo?.marca }} {{ orden.equipo?.modelo }}</span>
                            <span class="equipo-tipo" v-if="orden.equipo?.tipo"> · {{ orden.equipo.tipo }}</span>
                        </td>
                        <td class="cell-fecha">{{ formatDateTime(orden.fechas?.ingreso) }}</td>
                        <td class="cell-fecha cell-salida">{{ formatDateTime(orden.fechas?.salida) }}</td>
                        <td class="cell-pago">{{ orden.formaPago ?? '—' }}</td>
                        <td class="cell-monto">$ {{ formatMonto(calcularTotal(orden)) }}</td>
                    </tr>
                    <tr v-if="ordenes.length === 0">
                        <td colspan="7" class="empty-row">
                            <i class="pi pi-inbox"></i>
                            <span>No hay salidas registradas en este rango de fechas.</span>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="tfoot-total">
                        <td colspan="6" class="total-label-cell">Total del período</td>
                        <td class="cell-monto total-monto">$ {{ formatMonto(totalGeneral) }}</td>
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
import ProgressSpinner from 'primevue/progressspinner'
import { useOrdenServicioService } from '../composables/useOrdenServicioService'
import type { OrdenServicio } from '../models/orden-servicio'

const route  = useRoute()
const router = useRouter()
const ordenService = useOrdenServicioService()

const loading  = ref(false)
const errorMsg = ref('')
const ordenes  = ref<OrdenServicio[]>([])

// Fechas activas (desde URL o hoy)
const fechaInicioActiva = ref<string>(getTodayStr())
const fechaFinActiva    = ref<string | null>(null)

// DatePicker bindings
const fechaInicioValue = ref<Date | null>(null)
const fechaFinValue    = ref<Date | null>(null)

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
    const fin = formatIsoLabel(fechaFinActiva.value)
    return `Del ${inicio} al ${fin}`
})

const totalGeneral = computed(() =>
    ordenes.value.reduce((acc, o) => acc + calcularTotal(o), 0)
)

const fechaGeneracion = computed(() =>
    new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
)

function calcularTotal(orden: OrdenServicio): number {
    const fin = orden.financiero
    if (!fin) return 0
    return (fin.presupuesto ?? 0) + (fin.revision ?? 0)
}

function formatDateTime(val: any): string {
    if (!val) return '—'
    const d = val instanceof Date ? val : new Date(val)
    if (isNaN(d.getTime())) return '—'
    return `${d.toLocaleDateString('es-MX')} ${d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
}

function formatMonto(val: number | null | undefined): string {
    if (val == null) return '0.00'
    return val.toFixed(2)
}

async function cargarReporte() {
    loading.value  = true
    errorMsg.value = ''
    try {
        // Build ISO date-time boundaries
        const inicio = `${fechaInicioActiva.value}T00:00:00.000Z`
        const fin    = fechaFinActiva.value ? `${fechaFinActiva.value}T23:59:59.000Z` : undefined
        ordenes.value = await ordenService.obtenerReporteSalidas(inicio, fin)
    } catch (e: any) {
        errorMsg.value = e?.response?.data?.message ?? 'Error al cargar el reporte.'
    } finally {
        loading.value = false
    }
}

function actualizarFechas() {
    if (!fechaInicioValue.value) return
    fechaInicioActiva.value = toIsoDateStr(fechaInicioValue.value)
    fechaFinActiva.value    = fechaFinValue.value ? toIsoDateStr(fechaFinValue.value) : null

    const query: Record<string, string> = { fechaInicio: fechaInicioActiva.value }
    if (fechaFinActiva.value) query.fechaFin = fechaFinActiva.value
    router.replace({ path: '/reporte-salidas', query })
    cargarReporte()
}

// Expose window for template inline call
const window = globalThis.window

onMounted(() => {
    const inicioParam = route.query.fechaInicio as string | undefined
    const finParam    = route.query.fechaFin    as string | undefined

    if (inicioParam && /^\d{4}-\d{2}-\d{2}$/.test(inicioParam)) {
        fechaInicioActiva.value = inicioParam
    }
    if (finParam && /^\d{4}-\d{2}-\d{2}$/.test(finParam)) {
        fechaFinActiva.value = finParam
    }

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
    --color-primary:        #0e7490;
    --color-primary-light:  #e0f2fe;
    --color-surface:        #ffffff;
    --color-bg:             #f0f9ff;
    --color-border:         #bae6fd;
    --color-text:           #0c2840;
    --color-muted:          #6b7280;
    --color-success:        #0e9f6e;
    --color-row-even:       #f0f9ff;
    --radius:               10px;
    --shadow:               0 2px 12px rgba(0,0,0,0.08);

    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    background: var(--color-bg);
    min-height: 100vh;
    padding: 1.5rem 1rem;
    color: var(--color-text);
}

/* ════════════════════════════════════════
   Toolbar
   ════════════════════════════════════════ */
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 0.85rem 1.25rem;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
}

.toolbar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.brand-icon {
    width: 40px;
    height: 40px;
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}
.brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}
.brand-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text);
}
.brand-sub {
    font-size: 0.75rem;
    color: var(--color-muted);
}

.toolbar-controls {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
}
.date-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.date-control label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-muted);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
.btn-actualizar { min-width: 110px; }
.btn-imprimir   { min-width: 105px; }

/* ════════════════════════════════════════
   Contenido imprimible
   ════════════════════════════════════════ */
.reporte-contenido {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 2rem 2.25rem;
    max-width: 980px;
    margin: 0 auto;
}

/* ── Encabezado del documento ── */
.doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 1.25rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-primary);
}
.doc-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--color-text);
    margin: 0 0 0.25rem;
    letter-spacing: -0.01em;
    text-transform: uppercase;
}
.doc-fecha {
    font-size: 0.88rem;
    color: var(--color-muted);
    margin: 0;
    text-transform: capitalize;
}
.doc-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--color-primary-light);
    border: 1.5px solid var(--color-primary);
    border-radius: 8px;
    padding: 0.4rem 0.85rem;
    min-width: 64px;
}
.badge-num {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
}
.badge-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* ── Tabla ── */
.reporte-tabla {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}
.reporte-tabla thead tr {
    background: var(--color-primary);
}
.reporte-tabla th {
    color: #fff;
    font-weight: 600;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 9px 12px;
    border: none;
    text-align: left;
    white-space: nowrap;
}
.th-orden  { width: 90px;  text-align: center; }
.th-fecha  { width: 130px; }
.th-pago   { width: 110px; }
.th-monto  { width: 100px; text-align: right; }

.reporte-tabla tbody tr {
    border-bottom: 1px solid var(--color-border);
    transition: background 0.15s;
}
.reporte-tabla tbody tr:hover { background: var(--color-primary-light); }
.row-even td { background: var(--color-row-even); }
.reporte-tabla tbody tr:hover td { background: var(--color-primary-light) !important; }

.reporte-tabla td {
    padding: 8px 12px;
    color: var(--color-text);
    vertical-align: middle;
}

.cell-numero { text-align: center; }
.chip-orden {
    display: inline-block;
    background: var(--color-primary-light);
    color: var(--color-primary);
    font-weight: 700;
    font-size: 0.82rem;
    padding: 2px 10px;
    border-radius: 20px;
    border: 1px solid #7dd3fc;
}
.cell-cliente  { font-weight: 500; }
.cell-equipo   { font-size: 0.85rem; }
.equipo-marca  { font-weight: 600; }
.equipo-tipo   { color: var(--color-muted); font-size: 0.8rem; }
.cell-fecha    { color: var(--color-muted); font-size: 0.82rem; white-space: nowrap; }
.cell-salida   { font-weight: 600; color: var(--color-primary); }
.cell-pago     { font-size: 0.82rem; }
.cell-monto    { text-align: right; font-variant-numeric: tabular-nums; font-weight: 500; font-size: 0.875rem; }

/* Fila vacía */
.empty-row {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-muted);
}
.empty-row i    { font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.4; }
.empty-row span { font-size: 0.9rem; }

/* ── Pie de tabla: totales ── */
.reporte-tabla tfoot tr {
    background: #0c2840;
}
.total-label-cell {
    color: #fff;
    font-weight: 700;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 9px 12px;
    text-align: right;
}
.total-monto {
    color: #6ee7b7;
    font-weight: 800;
    font-size: 0.95rem;
    padding: 9px 12px;
    text-align: right;
}

/* ── Footer del documento ── */
.doc-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.75rem;
    color: var(--color-muted);
}

/* ════════════════════════════════════════
   Estados (carga / error)
   ════════════════════════════════════════ */
.estado-carga {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: var(--color-muted);
    font-size: 0.9rem;
}
.estado-error {
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
}
.error-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    background: #fff5f5;
    border: 1px solid #fca5a5;
    border-radius: var(--radius);
    padding: 2rem 2.5rem;
    text-align: center;
    color: #b91c1c;
}
.error-card i  { font-size: 2rem; }
.error-card p  { margin: 0; font-size: 0.9rem; }

/* ════════════════════════════════════════
   Print
   ════════════════════════════════════════ */
@media print {
    .no-print { display: none !important; }
    .reporte-page {
        background: #fff;
        padding: 0;
    }
    .reporte-contenido {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
    }
}
</style>
