import axios, { type AxiosInstance } from 'axios'

// --- DTOs ---

export interface PrinterProductItem {
    quantity: number
    description: string
    sku: string
    price?: number
    total?: number
    isPayment?: boolean
}

export interface PrinterPaymentItem {
    name: string
    amount: number
}

export interface PrinterCustomerInfo {
    name?: string
    phoneNumber?: string
    address?: string
    municipality?: string
    state?: string
    country?: string
}

export interface PrinterCashierReport {
    user: string
    date: string
    movement: string
    cash_1000?: number
    cash_500?: number
    cash_200?: number
    cash_100?: number
    cash_50?: number
    cash_20?: number
    cash?: number
    others?: number
    total: number
    description?: string
}

export interface PrintTestRequest {
    port: string
    paperWidth?: 58 | 80 | 112
    connectionType?: 'Usb' | 'Network' | 'Serial' | 'Windows'
    usbPrinterName?: string
}

export interface PrintPaymentRequest {
    port: string
    paperWidth?: 58 | 80 | 112
    connectionType?: 'Usb' | 'Network' | 'Serial' | 'Windows'
    usbPrinterName?: string
    name: string
    address?: string
    email?: string
    phoneNumber?: string
    taxInfo?: string
    id: string
    identifier?: string
    date: string
    subtotal?: number
    taxes?: number
    total: number
    change?: number
    openCashDrawer?: boolean
    customerInfo?: PrinterCustomerInfo
    products: PrinterProductItem[]
    payments: PrinterPaymentItem[]
    totalPaid?: number
    footer?: string
    qrCodeData?: string
}

export interface PrintPreparationRequest {
    port: string
    paperWidth?: 58 | 80 | 112
    connectionType?: 'Usb' | 'Network' | 'Serial' | 'Windows'
    usbPrinterName?: string
    id: string
    identifier?: string
    date: string
    products: PrinterProductItem[]
}

export interface PrintCashierReportRequest {
    port: string
    paperWidth?: 58 | 80 | 112
    connectionType?: 'Usb' | 'Network' | 'Serial' | 'Windows'
    usbPrinterName?: string
    cashier: PrinterCashierReport
}

export interface OpenCashDrawerRequest {
    port: string
    connectionType?: 'Usb' | 'Network' | 'Serial' | 'Windows'
    usbPrinterName?: string
}

// --- Response types ---

export interface PrintHealthResponse {
    status: string
    timestamp: string
}

export interface PrintTestResponse {
    message: string
    paperWidth?: string
}

export interface PrintPaymentResponse {
    message: string
    orderId: string
}

export interface PrintGenericResponse {
    message: string
}

// --- Service ---

export class POSPrinterService {
    private api: AxiosInstance

    constructor() {
        const baseURL = import.meta.env.VITE_PRINTER_API_URL || 'http://localhost:5150/api/print'
        console.log(`POSPrinterService initialized with baseURL: ${baseURL}`)
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async checkHealth(): Promise<PrintHealthResponse> {
        const response = await this.api.get<PrintHealthResponse>('/health')
        return response.data
    }

    async testPrint(request: PrintTestRequest): Promise<PrintTestResponse> {
        const response = await this.api.post<PrintTestResponse>('/test', request)
        return response.data
    }

    async printPayment(request: PrintPaymentRequest): Promise<PrintPaymentResponse> {
        const response = await this.api.post<PrintPaymentResponse>('/payment', request)
        return response.data
    }

    async openCashDrawer(request: OpenCashDrawerRequest): Promise<PrintGenericResponse> {
        const response = await this.api.post<PrintGenericResponse>('/cashier/open', request)
        return response.data
    }
}
