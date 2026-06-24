// composables/useOrdenServicio.ts

import type { Financiero, RefaccionItem } from "../models/orden-servicio"

export function useOrdenServicio() {
    // Total = presupuesto (incluye manoDeObra + refacciones) + revision
    const calcularSubtotal = (refacciones: RefaccionItem[], financiero: Financiero): number => {
        const presupuesto = calcularPresupuesto(refacciones, financiero)
        return presupuesto + financiero.revision
    }

    const calcularPagos = (financiero: Financiero): number => {
        return financiero.anticipo + financiero.pagos
    }

    const calcularSaldo = (refacciones: RefaccionItem[], financiero: Financiero): number => {
        const subtotal = calcularSubtotal(refacciones, financiero)
        const pagos = calcularPagos(financiero)
        return subtotal - pagos
    }

    const calcularTotal = (refacciones: RefaccionItem[], financiero: Financiero): number => {
        const subtotal = calcularSubtotal(refacciones, financiero)
        // return subtotal + financiero.iva
        // Por ahora, no se aplica IVA a la orden de servicio, solo se muestra el subtotal
        return subtotal;
    }

    const calcularPresupuesto = (refacciones: RefaccionItem[], financiero: Financiero): number => {
        const refaccionesTotal = refacciones.reduce(
            (acc, r) => acc + ((r.precio ?? 0) * (r.cantidad ?? 1)),
            0
        )
        return refaccionesTotal + (financiero.manoDeObra ?? 0)
    }

    return {
        calcularSubtotal,
        calcularTotal,
        calcularSaldo,
        calcularPagos,
        calcularPresupuesto
    }
}