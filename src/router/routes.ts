import HomePage from '../pages/home.vue';
import OrdenServicioPage from '../pages/orden-servicio.vue';
import LoginPage from '../pages/login.vue';

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage
    },
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    {
        path: '/orden-servicio',
        name: 'orden-servicio',
        component: OrdenServicioPage
    }
]