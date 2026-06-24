import type { Fechas, EstadoEquipo } from '../models/orden-servicio'

/**
 * Converts a Date (or an ISO string) to an ISO 8601 string for the API.
 * Returns null for falsy / invalid values.
 */
export const toISOSafe = (d: Date | string | null | undefined): string | null => {
    if (!d) return null
    const date = d instanceof Date ? d : new Date(d)
    return isNaN(date.getTime()) ? null : date.toISOString()
}

/**
 * Safely parses a raw API value (ISO string, Date, null, undefined) into a Date.
 * Returns null for falsy / invalid values.
 */
export const parseDate = (raw: string | Date | null | undefined): Date | null => {
    if (!raw) return null
    const d = raw instanceof Date ? raw : new Date(raw)
    return isNaN(d.getTime()) ? null : d
}

// ── Fechas ────────────────────────────────────────────────────────────────────

/**
 * Serializes a Fechas object to API-safe ISO strings.
 * Use this before sending fechas to the backend.
 */
export const serializeFechas = (f: Fechas) => ({
    ingreso: toISOSafe(f.ingreso),
    salida: toISOSafe(f.salida),
    autorizacion: toISOSafe(f.autorizacion),
    llegadaRefaccion: toISOSafe(f.llegadaRefaccion),
    pedidoRefaccion: toISOSafe(f.pedidoRefaccion) ?? null,
    presupuesto: toISOSafe(f.presupuesto) ?? null,
})

/**
 * Deserializes an API Fechas object (ISO strings) back to Date objects.
 * Use this after receiving fechas from the backend.
 */
export const deserializeFechas = (raw: any): Fechas => ({
    ingreso: parseDate(raw?.ingreso),
    salida: parseDate(raw?.salida),
    autorizacion: parseDate(raw?.autorizacion),
    llegadaRefaccion: parseDate(raw?.llegadaRefaccion),
    pedidoRefaccion: parseDate(raw?.pedidoRefaccion),
    presupuesto: parseDate(raw?.presupuesto),
})

// ── EstadoEquipo ──────────────────────────────────────────────────────────────

/**
 * Serializes EstadoEquipo date fields to ISO strings for the API.
 */
export const serializeEstado = (e: EstadoEquipo) => ({
    ...e,
    fechaEnvio: toISOSafe(e.fechaEnvio),
    fechaReparacion: toISOSafe(e.fechaReparacion),
})

/**
 * Deserializes EstadoEquipo date fields from the API back to Date objects.
 */
export const deserializeEstado = (raw: any): EstadoEquipo => ({
    pendiente: raw?.pendiente ?? '',
    enviadoANombre: raw?.enviadoANombre ?? '',
    notasEnvio: raw?.notasEnvio ?? '',
    reparadoPor: raw?.reparadoPor ?? '',
    descripcionReparacion: raw?.descripcionReparacion ?? '',
    noPedido: raw?.noPedido ?? '',
    fechaEnvio: parseDate(raw?.fechaEnvio),
    fechaReparacion: parseDate(raw?.fechaReparacion),
})
