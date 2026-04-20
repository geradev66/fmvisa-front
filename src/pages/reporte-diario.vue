<template>
    <div class="reporte-page">

        <!-- ── Toolbar (no imprimible) ── -->
        <div class="toolbar no-print">
            <div class="toolbar-brand">
                <div class="brand-icon">
                    <i class="pi pi-chart-bar"></i>
                </div>
                <div class="brand-text">
                    <span class="brand-title">Reporte Diario</span>
                    <span class="brand-sub">Entrada de equipos</span>
                </div>
            </div>
            <div class="toolbar-controls">
                <div class="date-control">
                    <label for="fechaPicker"><i class="pi pi-calendar"></i> Fecha</label>
                    <DatePicker
                        id="fechaPicker"
                        v-model="fechaPickerValue"
                        dateFormat="dd/mm/yy"
                        showIcon
                        :maxDate="new Date()"
                        inputClass="date-input"
                    />
                </div>
                <Button label="Actualizar" icon="pi pi-refresh" size="small" @click="actualizarFecha" class="btn-actualizar" />
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
                    <h1 class="doc-title">Reporte Diario de Entrada de Equipos</h1>
                    <p class="doc-fecha">{{ fechaFormateada }}</p>
                </div>
                <div class="doc-header-right">
                    <div class="doc-badge">
                        <span class="badge-num">{{ ordenes.length }}</span>
                        <span class="badge-label">{{ ordenes.length === 1 ? 'Orden' : 'Órdenes' }}</span>
                    </div>
                </div>
            </div>

            <!-- Tabla -->
            <table class="reporte-tabla">
                <thead>
                    <tr>
                        <th class="th-orden">No. Orden</th>
                        <th class="th-cliente">Cliente</th>
                        <th class="th-ingreso">Fecha de Ingreso</th>
                        <th class="th-monto">Anticipo</th>
                        <th class="th-monto">Pagos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(orden, idx) in ordenes" :key="orden.numeroOrden" :class="{ 'row-even': idx % 2 === 1 }">
                        <td class="cell-numero">
                            <span class="chip-orden">{{ orden.numeroOrden }}</span>
                        </td>
                        <td class="cell-cliente">{{ orden.cliente?.nombre ?? '—' }}</td>
                        <td class="cell-fecha">{{ formatDateTime(orden.fechas?.ingreso) }}</td>
                        <td class="cell-monto">$ {{ formatMonto(orden.financiero?.anticipo) }}</td>
                        <td class="cell-monto">$ {{ formatMonto(orden.financiero?.pagos) }}</td>
                    </tr>
                    <tr v-if="ordenes.length === 0">
                        <td colspan="5" class="empty-row">
                            <i class="pi pi-inbox"></i>
                            <span>No hay órdenes registradas para esta fecha.</span>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="tfoot-total">
                        <td colspan="3" class="total-label-cell">Total del día</td>
                        <td class="cell-monto total-anticipo">$ {{ formatMonto(totalAnticipos) }}</td>
                        <td class="cell-monto total-pagos">$ {{ formatMonto(totalPagos) }}</td>
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

// Fecha activa (desde URL o hoy)
const fechaActiva = ref<string>(getTodayStr())

// DatePicker local bind
const fechaPickerValue = ref<Date | null>(null)

function getTodayStr(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function parseIsoToDate(iso: string): Date | null {
    const [y, m, d] = iso.split('-').map(Number)
    if (!y || !m || !d) return null
    return new Date(y, m - 1, d)
}

const fechaFormateada = computed(() => {
    const d = parseIsoToDate(fechaActiva.value)
    if (!d) return fechaActiva.value
    return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const totalPagos = computed(() =>
    ordenes.value.reduce((acc, o) => acc + (o.financiero?.pagos ?? 0), 0)
)

const totalAnticipos = computed(() =>
    ordenes.value.reduce((acc, o) => acc + (o.financiero?.anticipo ?? 0), 0)
)

const fechaGeneracion = computed(() =>
    new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
)

function formatDateTime(val: any): string {
    if (!val) return '—'
    const d = val instanceof Date ? val : new Date(val)
    if (isNaN(d.getTime())) return '—'
    return `${d.toLocaleDateString('es-MX')} ${d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
}

function formatMonto(val: number | null | undefined): string {
    if (val == null) return '0.00'
    return val.toFixed(2)
}

async function cargarReporte() {
    loading.value  = true
    errorMsg.value = ''
    try {
        const data = await ordenService.obtenerReporteDiario(fechaActiva.value)
        // El backend puede devolver un arreglo directamente o { data: [] }
        ordenes.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch (e: any) {
        errorMsg.value = e?.response?.data?.message ?? 'Error al cargar el reporte.'
    } finally {
        loading.value = false
    }
}

function actualizarFecha() {
    if (!fechaPickerValue.value) return
    const d = fechaPickerValue.value
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    fechaActiva.value = iso
    router.replace({ path: '/reporte-diario', query: { fecha: iso } })
    cargarReporte()
}

// Expose window for template inline call
const window = globalThis.window

onMounted(() => {
    const fechaParam = route.query.fecha as string | undefined
    if (fechaParam && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam)) {
        fechaActiva.value = fechaParam
    }
    fechaPickerValue.value = parseIsoToDate(fechaActiva.value)
    cargarReporte()
})
</script>

<style scoped>
/* ════════════════════════════════════════
   Variables
   ════════════════════════════════════════ */
.reporte-page {
    --color-primary:   #3b5bdb;
    --color-primary-light: #e8edff;
    --color-surface:   #ffffff;
    --color-bg:        #f3f4f8;
    --color-border:    #dde1ea;
    --color-text:      #1e2740;
    --color-muted:     #6b7280;
    --color-success:   #0e9f6e;
    --color-row-even:  #f7f8fc;
    --radius:          10px;
    --shadow:          0 2px 12px rgba(0,0,0,0.08);

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
    max-width: 860px;
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
.th-orden   { width: 90px;  text-align: center; }
.th-ingreso { width: 160px; }
.th-monto   { width: 100px; text-align: right; }

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
    border: 1px solid #c0ccf5;
}
.cell-cliente { font-weight: 500; }
.cell-fecha   { color: var(--color-muted); font-size: 0.82rem; white-space: nowrap; }
.cell-monto   { text-align: right; font-variant-numeric: tabular-nums; font-weight: 500; font-size: 0.875rem; }

/* Fila vacía */
.empty-row {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-muted);
}
.empty-row i   { font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.4; }
.empty-row span { font-size: 0.9rem; }

/* ── Pie de tabla: totales ── */
.reporte-tabla tfoot tr {
    background: #1e2740;
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
.total-anticipo,
.total-pagos {
    color: #fff;
    font-weight: 800;
    font-size: 0.95rem;
    padding: 9px 12px;
    text-align: right;
}
.total-pagos { color: #6ee7b7; }

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
.error-card i    { font-size: 2rem; }
.error-card p    { margin: 0; font-size: 0.9rem; }

/* ════════════════════════════════════════
   Print
   ════════════════════════════════════════ */
@media print {
    .no-print { display: none !important; }

    .reporte-page {
        background: #fff;
        padding: 0;
        min-height: unset;
    }
    .reporte-contenido {
        border: none;
        box-shadow: none;
        border-radius: 0;
        padding: 1.5cm 1cm;
        max-width: 100%;
        margin: 0;
    }
    .doc-header  { border-bottom-color: #000; }
    .doc-title   { font-size: 13pt; }
    .doc-fecha   { font-size: 10pt; }
    .doc-badge   { border-color: #000; background: #eee; }
    .badge-num, .badge-label { color: #000; }

    .reporte-tabla thead tr { background: #2d3a5a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .reporte-tabla th       { color: #fff !important; font-size: 8pt; padding: 6px 8px; }
    .reporte-tabla td       { font-size: 9pt; padding: 5px 8px; }
    .row-even td            { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .reporte-tabla tbody tr:hover td { background: unset !important; }

    .chip-orden             { background: transparent; border: none; font-weight: 700; }

    .reporte-tabla tfoot tr { background: #1e2740 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .total-label-cell, .total-anticipo, .total-pagos { color: #fff !important; font-size: 9pt; }
    .total-pagos            { color: #6ee7b7 !important; }

    .doc-footer { font-size: 8pt; }
}
</style>
