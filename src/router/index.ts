import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    if (to.meta?.requiresAdmin) {
        const storedToken = localStorage.getItem('auth_token')
        if (!storedToken) return next('/login')

        const storedUser = localStorage.getItem('auth_user')
        const user = storedUser ? JSON.parse(storedUser) : null
        if (!user || user.role !== 'admin') return next('/orden-servicio')
    }
    next()
})

export default router;
