import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Auth/Login';
import Registration from '../components/Auth/Registration';

import History from '../components/Main/History/History';

Vue.use(Router)

// const authGuard = (to, from, next) => {
//     let isAuthenticated = false;
//     if (localStorage.getItem('loggedUser')) {
//         isAuthenticated = true;
//     }
//
//     if (isAuthenticated) {
//         next();
//     } else {
//         next('/auth/login');
//     }
// }

export default new Router({
    mode: 'history',
    routes: [
        // {
        //     path: '*',
        //     component: NotFoundComponent
        // },
        {
            path: '/auth',
            redirect: '/auth/login'
        }, {
            path: '/auth/login',
            name: 'Login',
            component: Login,
            meta: {
                title: 'Login',
                layout: 'auth-layout'
            }
        }, {
            path: '/auth/registration',
            name: 'Registration',
            component: Registration,
            meta: {
                title: 'Registration',
                layout: 'auth-layout'
            }
        }, {
            path: '',
            name: 'History',
            // beforeEnter: authGuard,
            component: History,
            meta: {
                layout: 'main-layout'
            }
        },
    ]
})
