import { createApp } from 'vue';
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import App from './App.vue';
// Import custom styles
import './style.css';
import 'primeicons/primeicons.css'

// Import services and injection keys
import { OrdenServicioService } from './services/OrdenServicioService';
import { AuthServiceKey, ClienteServiceKey, EquipoServiceKey, OrdenServicioServiceKey, RefaccionServiceKey, TecnicoServiceKey, PrinterServiceKey, PagoServiceKey, UsuarioServiceKey, MovimientoInventarioServiceKey } from './injection-keys';

// Import individual components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { DatePicker } from 'primevue';
import Card from 'primevue/card';
import RadioButton from 'primevue/radiobutton';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import AutoComplete from 'primevue/autocomplete';

import router from './router';
import { AuthService } from './services/AuthService';
import { ClienteService } from './services/ClienteService';
import { EquipoService } from './services/EquipoService';
import { RefaccionService } from './services/RefaccionService';
import { TecnicoService } from './services/TecnicoService';
import { PrinterService } from './services/PrinterService';
import { PagoService } from './services/PagoService';
import { UsuarioService } from './services/UsuarioService';
import { MovimientoInventarioService } from './services/MovimientoInventarioService';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark'
        }
    },
    locale: {
        startsWith: 'Empieza con',
        contains: 'Contiene',
        notContains: 'No contiene',
        endsWith: 'Termina con',
        equals: 'Igual a',
        notEquals: 'Diferente a',
        noFilter: 'Sin filtro',
        lt: 'Menor que',
        lte: 'Menor o igual que',
        gt: 'Mayor que',
        gte: 'Mayor o igual que',
        dateIs: 'Fecha igual a',
        dateIsNot: 'Fecha diferente a',
        dateBefore: 'Fecha antes de',
        dateAfter: 'Fecha después de',
        clear: 'Limpiar',
        apply: 'Aplicar',
        matchAll: 'Coincidir todo',
        matchAny: 'Coincidir alguno',
        addRule: 'Agregar regla',
        removeRule: 'Eliminar regla',
        accept: 'Sí',
        reject: 'No',
        choose: 'Elegir',
        upload: 'Subir',
        cancel: 'Cancelar',
        close: 'Cerrar',
        noResultsFound: 'No se encontraron resultados',
        search: 'Buscar',
        pending: 'Pendiente',
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        chooseYear: 'Elegir año',
        chooseMonth: 'Elegir mes',
        chooseDate: 'Elegir fecha',
        prevDecade: 'Década anterior',
        nextDecade: 'Década siguiente',
        prevYear: 'Año anterior',
        nextYear: 'Año siguiente',
        prevMonth: 'Mes anterior',
        nextMonth: 'Mes siguiente',
        prevHour: 'Hora anterior',
        nextHour: 'Hora siguiente',
        prevMinute: 'Minuto anterior',
        nextMinute: 'Minuto siguiente',
        prevSecond: 'Segundo anterior',
        nextSecond: 'Segundo siguiente',
        am: 'AM',
        pm: 'PM',
        today: 'Hoy',
        now: 'Ahora',
        weekHeader: 'Sem',
        firstDayOfWeek: 1,
        showMonthAfterYear: false,
        dateFormat: 'dd/mm/yy',
        weak: 'Débil',
        medium: 'Medio',
        strong: 'Fuerte',
        passwordPrompt: 'Ingrese una contraseña',
        emptyFilterMessage: 'No se encontraron resultados',
        emptyMessage: 'No hay opciones disponibles',
        aria: {
            trueLabel: 'Verdadero',
            falseLabel: 'Falso',
            nullLabel: 'No seleccionado',
            star: '1 estrella',
            stars: '{star} estrellas',
            selectAll: 'Seleccionar todos',
            unselectAll: 'Deseleccionar todos',
            close: 'Cerrar',
            previous: 'Anterior',
            next: 'Siguiente',
            navigation: 'Navegación',
            scrollTop: 'Desplazar al inicio',
            moveTop: 'Mover al inicio',
            moveUp: 'Mover arriba',
            moveDown: 'Mover abajo',
            moveBottom: 'Mover al final',
            moveToTarget: 'Mover al destino',
            moveToSource: 'Mover al origen',
            moveAllToTarget: 'Mover todo al destino',
            moveAllToSource: 'Mover todo al origen',
            pageLabel: 'Página {page}',
            firstPageLabel: 'Primera página',
            lastPageLabel: 'Última página',
            nextPageLabel: 'Página siguiente',
            previousPageLabel: 'Página anterior',
            rowsPerPageLabel: 'Filas por página',
            jumpToPageDropdownLabel: 'Ir a página',
            jumpToPageInputLabel: 'Ir a página',
            selectRow: 'Fila seleccionada',
            unselectRow: 'Fila deseleccionada',
            expandRow: 'Fila expandida',
            collapseRow: 'Fila contraída',
            showFilterMenu: 'Mostrar menú de filtros',
            hideFilterMenu: 'Ocultar menú de filtros',
            filterOperator: 'Operador de filtro',
            filterConstraint: 'Restricción de filtro',
            editRow: 'Editar fila',
            saveEdit: 'Guardar edición',
            cancelEdit: 'Cancelar edición',
            listView: 'Vista de lista',
            gridView: 'Vista de cuadrícula',
            slide: 'Diapositiva',
            slideNumber: 'Diapositiva {slideNumber}',
            zoomImage: 'Ampliar imagen',
            zoomIn: 'Acercar',
            zoomOut: 'Alejar',
            rotateRight: 'Rotar a la derecha',
            rotateLeft: 'Rotar a la izquierda'
        }
    }
});
app.use(ToastService);
app.use(router);

// Provide services globally
const ordenServicioService = new OrdenServicioService();
const authService = new AuthService();
const clienteService = new ClienteService();
const equipoService = new EquipoService();
const refaccionService = new RefaccionService();
const tecnicoService = new TecnicoService();
const printerService = new PrinterService();
const pagoService = new PagoService();
const usuarioService = new UsuarioService();
const movimientoInventarioService = new MovimientoInventarioService();
app.provide(OrdenServicioServiceKey, ordenServicioService);
app.provide(AuthServiceKey, authService);
app.provide(ClienteServiceKey, clienteService);
app.provide(EquipoServiceKey, equipoService);
app.provide(RefaccionServiceKey, refaccionService);
app.provide(TecnicoServiceKey, tecnicoService);
app.provide(PrinterServiceKey, printerService);
app.provide(PagoServiceKey, pagoService);
app.provide(UsuarioServiceKey, usuarioService);
app.provide(MovimientoInventarioServiceKey, movimientoInventarioService);

// Provide more services as needed
// Register components
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('Select', Select);
app.component('DatePicker', DatePicker);
app.component('Checkbox', Checkbox);
app.component('Toast', Toast);
app.component('Card', Card);
app.component('RadioButton', RadioButton);
app.component('Divider', Divider);
app.component('Tag', Tag);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Textarea', Textarea);
app.component('Calendar', Calendar);
app.component('InputNumber', InputNumber);
app.component('AutoComplete', AutoComplete);
// Register more components as needed

//Pinia
const pinia = createPinia()
app.use(pinia)

app.mount('#app');