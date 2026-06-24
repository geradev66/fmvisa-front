import OrdenServicioPage from '../pages/orden-servicio.vue';
import LoginPage from '../pages/login.vue';
import ReporteDiarioPage from '../pages/reporte-diario.vue';
import ReporteSalidasPage from '../pages/reporte-salidas.vue';
import ReportePagosPage from '../pages/reporte-pagos.vue';
import UsuariosPage from '../pages/usuarios.vue';
import TecnicosPage from '../pages/tecnicos.vue';
import RefaccionesPage from '../pages/refacciones.vue';
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
        path: '/reporte-pagos',
        name: 'reporte-pagos',
        component: ReportePagosPage
    },
    {
        path: '/usuarios',
        name: 'usuarios',
        component: UsuariosPage,
        meta: { requiresAdmin: true }
    },
    {
        path: '/tecnicos',
        name: 'tecnicos',
        component: TecnicosPage,
        meta: { requiresAdmin: true }
    },
    {
        path: '/refacciones',
        name: 'refacciones',
        component: RefaccionesPage,
        meta: { requiresAdmin: true }
    },
    {
        path: '/orden/:id',
        name: 'orden-publica',
        component: OrdenPublicaPage
    }
]