export interface Printer {
  _id?: string;
  nombre: string;
  tipo: "usb" | "network" | "serial" | "windows";
  puerto?: string; // Para impresoras USB o Serial
  ip?: string; // Para impresoras de red
  windowsName?: string; // Para impresoras instaladas en Windows
  puertoRed?: string; // Para impresoras de red con puerto específico
  vendorId?: string; // Para impresoras USB
  productId?: string; // Para impresoras USB
  ancho: 58 | 80 | 112;
}

export interface CrearPrinterDTO extends Omit<Printer, '_id'> {}

export interface ActualizarPrinterDTO extends Partial<Omit<Printer, '_id'>> {}
