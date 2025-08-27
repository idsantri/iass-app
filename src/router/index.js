import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import authStore from '@/stores/authStore';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, _from, next) => {
    // if (to.fullPath == '/') {
    //   return next('/home')
    // }
    const store = authStore();
    const isAuthenticate = store.isLoggedIn;
    // const newUser = store.mustChangePassword;

    const guestRoutes = ['Register', 'Login', 'Forgot', 'Reset', 'Verify'];
    const protectedRoutes = !guestRoutes.includes(to.name);

    if (protectedRoutes && !isAuthenticate) {
        next('/login');
        // } else if (isAuthenticate && newUser && to.fullPath != '/profile' && to.fullPath != '/logout') {
        //     next('/profile');
    } else if (!protectedRoutes && isAuthenticate) {
        history.go(-1);
    } else {
        next();
    }
});

const DEFAULT_TITLE = import.meta.env.VITE_APP_INSTANCE;
router.afterEach(async (to) => {
    await nextTick(() => {
        document.title = to.meta.title ? `${DEFAULT_TITLE} — ${to.meta.title}` : DEFAULT_TITLE;
    });
});
export default router;
