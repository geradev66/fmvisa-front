import OrdenServicioPage from '../pages/orden-servicio.vue';
import LoginPage from '../pages/login.vue';
import ReporteDiarioPage from '../pages/reporte-diario.vue';
import ReporteSalidasPage from '../pages/reporte-salidas.vue';
import OrdenPublicaPage from '../pages/orden-publica.vue';

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage
    },
    {
        path: '/',
        name: 'home',
        redirect: '/login'
    },
    {
        path: '/orden-servicio',
        name: 'orden-servicio',
        component: OrdenServicioPage
    },
    {
        path: '/reporte-diario',
        name: 'reporte-diario',
        component: ReporteDiarioPage
    },
    {
        path: '/reporte-salidas',
        name: 'reporte-salidas',
        component: ReporteSalidasPage
    },
    {
        path: '/orden/:id',
        name: 'orden-publica',
        component: OrdenPublicaPage
    }
]