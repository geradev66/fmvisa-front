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
import { AuthServiceKey, ClienteServiceKey, EquipoServiceKey, OrdenServicioServiceKey } from './injection-keys';

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
import router from './router';
import { AuthService } from './services/AuthService';
import { ClienteService } from './services/ClienteService';
import { EquipoService } from './services/EquipoService';
// Add more components as needed

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(router);

// Provide services globally
const ordenServicioService = new OrdenServicioService();
const authService = new AuthService();
const clienteService = new ClienteService();
const equipoService = new EquipoService();
app.provide(OrdenServicioServiceKey, ordenServicioService);
app.provide(AuthServiceKey, authService);
app.provide(ClienteServiceKey, clienteService);
app.provide(EquipoServiceKey, equipoService);

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
// Register more components as needed

//Pinia
const pinia = createPinia()
app.use(pinia)

app.mount('#app');