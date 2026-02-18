// composables/useOrdenServicio.ts

import type { Financiero } from "../models/orden-servicio"

export function useOrdenServicio() {
    const calcularSubtotal = (financiero: Financiero): number => {
        return financiero.presupuesto + 
               financiero.revision + 
               financiero.anticipo + 
               financiero.pagos + 
               financiero.iva
    }

    const calcularTotal = (financiero: Financiero): number => {
        const subtotal = calcularSubtotal(financiero)
        return subtotal + financiero.iva
    }

    return {
        calcularSubtotal,
        calcularTotal
    }
}