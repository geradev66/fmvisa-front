import type { Cliente } from "../models/cliente";
import type { Equipo } from "../models/equipo";
import type { OrdenServicio } from "../models/orden-servicio";

export let ClientesMockDb : Cliente[] = [ 
    {
        id: "1",
        nombre: "Comercializadora del Norte S.A. de C.V.",
        celular: "8181234567",
        domicilio: "Av. Constitución 1234",
        rfc: "CDN950101ABC",
        colonia: "Centro",
        ciudad: "Monterrey",
        estado: "Nuevo León",
        cp: "64000",
        email: "contacto@comnorte.com",
        telefono: "8187654321",
        contacto: "Juan Pérez García"
    },
    {
        id: "2",
        nombre: "Tecnologías Industriales de México S.A.",
        celular: "5512345678",
        domicilio: "Blvd. Miguel de Cervantes Saavedra 301",
        rfc: "TIM980215XYZ",
        colonia: "Ampliación Granada",
        ciudad: "Ciudad de México",
        estado: "CDMX",
        cp: "11520",
        email: "ventas@tecindmex.com.mx",
        telefono: "5598765432",
        contacto: "María Fernández López"
    },
    {
        id: "3",
        nombre: "Distribuidora Guadalajara S.C.",
        celular: "3331234567",
        domicilio: "Av. Vallarta 2500",
        rfc: "DGU020305RST",
        colonia: "Providencia",
        ciudad: "Guadalajara",
        estado: "Jalisco",
        cp: "44630",
        email: "info@distgdl.com",
        telefono: "3345678901",
        contacto: "Roberto Sánchez Martínez"
    },
    {
        id: "4",
        nombre: "Servicios y Mantenimiento del Bajío S.A.",
        celular: "4421234567",
        domicilio: "Av. Universidad 456",
        rfc: "SMB150812DEF",
        colonia: "Juriquilla",
        ciudad: "Querétaro",
        estado: "Querétaro",
        cp: "76230",
        email: "servicios@smbajio.com",
        telefono: "4429876543",
        contacto: "Laura González Ramírez"
    },
    {
        id: "5",
        nombre: "Autopartes y Refacciones del Pacífico",
        celular: "6641234567",
        domicilio: "Carretera Internacional 789",
        rfc: "ARP190506GHI",
        colonia: "Las Quintas",
        ciudad: "Culiacán",
        estado: "Sinaloa",
        cp: "80060",
        email: "ventas@autopacifico.com",
        telefono: "6678901234",
        contacto: "Carlos Moreno Díaz"
    }
]

export const EquipoMockDb : Equipo[] = [
    {
        id: "1",
        marca: "HP",
        modelo: "LaserJet Pro M404dn",
        noSerie: "MXCD1234567",
        tipo: "Impresora Láser",
        falla: "No imprime, error de papel atascado",
        accesorios: "Cable de poder, cable USB, bandeja adicional"
    },
    {
        id: "2",
        marca: "Dell",
        modelo: "OptiPlex 7090",
        noSerie: "DOPT9876543",
        tipo: "Computadora de Escritorio",
        falla: "No enciende, posible problema en fuente de poder",
        accesorios: "Teclado, mouse, cable VGA"
    },
    {
        id: "3",
        marca: "Cisco",
        modelo: "Catalyst 2960-X",
        noSerie: "FCW2145G0TL",
        tipo: "Switch de Red",
        falla: "Puertos 10-15 no funcionan",
        accesorios: "Cable de consola, rack mount kit"
    },
    {
        id: "4",
        marca: "Epson",
        modelo: "EcoTank L3250",
        noSerie: "X7KY123456",
        tipo: "Impresora Multifuncional",
        falla: "No reconoce tinta, error en sistema de tanques",
        accesorios: "Cable USB, CD de instalación, botellas de tinta vacías"
    },
    {
        id: "5",
        marca: "Lenovo",
        modelo: "ThinkPad X1 Carbon Gen 9",
        noSerie: "PF3A2BC1",
        tipo: "Laptop",
        falla: "Pantalla parpadeante, posible problema en cable flex",
        accesorios: "Cargador, maletín, mouse inalámbrico"
    }
]

export const OrdenServicioMockDb : OrdenServicio[] = [
    {
        id: "1",
        numeroOrden: "OS-2026-001",
        fechaCreacion: new Date("2026-02-20"),
        cliente: ClientesMockDb[0],
        equipo: EquipoMockDb[0],
        fechas: {
            ingreso: new Date("2026-02-20"),
            salida: null,
            autorizacion: new Date("2026-02-21"),
            llegadaRefaccion: null
        },
        estado: {
            pendiente: "En diagnóstico",
            enviadoANombre: "",
            fechaEnvio: null,
            notasEnvio: "",
            reparadoPor: "técnico1",
            fechaReparacion: null,
            descripcionReparacion: "Revisando mecanismo de alimentación de papel"
        },
        estadoOrden: "Pendiente",
        referencias: "Ninguno",
        tipoCargo: "CargoRegular",
        financiero: {
            presupuesto: 1500,
            revision: 300,
            anticipo: 500,
            pagos: 0,
            iva: 240
        },
        historial: [
            {
                id: "1",
                fecha: "2026-02-20T10:30:00",
                accion: "Orden creada",
                usuario: "admin"
            },
            {
                id: "2",
                fecha: "2026-02-21T14:15:00",
                accion: "Cliente autorizó presupuesto",
                usuario: "admin"
            }
        ]
    },
    {
        id: "2",
        numeroOrden: "OS-2026-002",
        fechaCreacion: new Date("2026-02-21"),
        cliente: ClientesMockDb[1],
        equipo: EquipoMockDb[1],
        fechas: {
            ingreso: new Date("2026-02-21"),
            salida: null,
            autorizacion: null,
            llegadaRefaccion: new Date("2026-02-25")
        },
        estado: {
            pendiente: "Esperando refacción",
            enviadoANombre: "",
            fechaEnvio: null,
            notasEnvio: "",
            reparadoPor: "técnico2",
            fechaReparacion: null,
            descripcionReparacion: "Fuente de poder dañada, se ordenó repuesto"
        },
        estadoOrden: "Refacción",
        referencias: "Ninguno",
        tipoCargo: "CargoRegular",
        financiero: {
            presupuesto: 2800,
            revision: 350,
            anticipo: 1000,
            pagos: 0,
            iva: 448
        },
        historial: [
            {
                id: "1",
                fecha: "2026-02-21T09:00:00",
                accion: "Orden creada",
                usuario: "admin"
            },
            {
                id: "2",
                fecha: "2026-02-21T16:30:00",
                accion: "Diagnóstico completado - fuente dañada",
                usuario: "técnico2"
            },
            {
                id: "3",
                fecha: "2026-02-22T11:00:00",
                accion: "Refacción ordenada",
                usuario: "admin"
            }
        ]
    },
    {
        id: "3",
        numeroOrden: "OS-2026-003",
        fechaCreacion: new Date("2026-02-22"),
        cliente: ClientesMockDb[2],
        equipo: EquipoMockDb[2],
        fechas: {
            ingreso: new Date("2026-02-22"),
            salida: new Date("2026-02-26"),
            autorizacion: new Date("2026-02-23"),
            llegadaRefaccion: null
        },
        estado: {
            pendiente: "Reparado",
            enviadoANombre: "",
            fechaEnvio: null,
            notasEnvio: "",
            reparadoPor: "técnico3",
            fechaReparacion: new Date("2026-02-25"),
            descripcionReparacion: "Puertos dañados por sobrecarga, se reemplazó placa de circuito"
        },
        estadoOrden: "Entregar",
        referencias: "Reparado",
        tipoCargo: "CargoRegular",
        financiero: {
            presupuesto: 4500,
            revision: 400,
            anticipo: 2000,
            pagos: 2900,
            iva: 464
        },
        historial: [
            {
                id: "1",
                fecha: "2026-02-22T08:45:00",
                accion: "Orden creada",
                usuario: "admin"
            },
            {
                id: "2",
                fecha: "2026-02-23T10:20:00",
                accion: "Presupuesto autorizado",
                usuario: "admin"
            },
            {
                id: "3",
                fecha: "2026-02-25T17:00:00",
                accion: "Reparación completada",
                usuario: "técnico3"
            }
        ]
    },
    {
        id: "4",
        numeroOrden: "OS-2026-004",
        fechaCreacion: new Date("2026-02-23"),
        cliente: ClientesMockDb[3],
        equipo: EquipoMockDb[3],
        fechas: {
            ingreso: new Date("2026-02-23"),
            salida: null,
            autorizacion: null,
            llegadaRefaccion: null
        },
        estado: {
            pendiente: "Cliente no autorizó",
            enviadoANombre: "",
            fechaEnvio: null,
            notasEnvio: "",
            reparadoPor: "técnico1",
            fechaReparacion: null,
            descripcionReparacion: "Sistema de tanques dañado - requiere cambio completo"
        },
        estadoOrden: "Informa",
        referencias: "NoAutorizo",
        tipoCargo: "SinCargo",
        financiero: {
            presupuesto: 1200,
            revision: 250,
            anticipo: 0,
            pagos: 250,
            iva: 40
        },
        historial: [
            {
                id: "1",
                fecha: "2026-02-23T11:15:00",
                accion: "Orden creada",
                usuario: "admin"
            },
            {
                id: "2",
                fecha: "2026-02-24T15:45:00",
                accion: "Diagnóstico completado",
                usuario: "técnico1"
            },
            {
                id: "3",
                fecha: "2026-02-25T10:00:00",
                accion: "Cliente informado del presupuesto",
                usuario: "admin"
            },
            {
                id: "4",
                fecha: "2026-02-26T09:30:00",
                accion: "Cliente no autorizó reparación",
                usuario: "admin"
            }
        ]
    },
    {
        id: "5",
        numeroOrden: "OS-2026-005",
        fechaCreacion: new Date("2026-02-24"),
        cliente: ClientesMockDb[4],
        equipo: EquipoMockDb[4],
        fechas: {
            ingreso: new Date("2026-02-24"),
            salida: null,
            autorizacion: new Date("2026-02-24"),
            llegadaRefaccion: null
        },
        estado: {
            pendiente: "En reparación",
            enviadoANombre: "",
            fechaEnvio: null,
            notasEnvio: "",
            reparadoPor: "técnico2",
            fechaReparacion: null,
            descripcionReparacion: "Reemplazando cable flex de pantalla"
        },
        estadoOrden: "Autoriza",
        referencias: "Garantia",
        tipoCargo: "GarantiaVendor",
        financiero: {
            presupuesto: 1800,
            revision: 300,
            anticipo: 0,
            pagos: 0,
            iva: 0
        },
        historial: [
            {
                id: "1",
                fecha: "2026-02-24T13:20:00",
                accion: "Orden creada",
                usuario: "admin"
            },
            {
                id: "2",
                fecha: "2026-02-24T14:00:00",
                accion: "Verificado - equipo en garantía",
                usuario: "admin"
            },
            {
                id: "3",
                fecha: "2026-02-25T09:15:00",
                accion: "Reparación iniciada",
                usuario: "técnico2"
            }
        ]
    }
]