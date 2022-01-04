import Vue from 'vue'
import Router from 'vue-router'

import AuthGuard from './auth-guard'

import Login from '@/components/Auth/Login';
import Registration from '@/components/Auth/Registration';
import ForgotPassword from '@/components/Auth/ForgotPassword';

import Overview from '@/components/Main/Overview/Overview';
import History from '@/components/Main/History/History';
import Planning from '@/components/Main/Planning/Planning';
import Records from '@/components/Main/Records/Records';
import Settings from '@/components/Main/Settings/Settings';

Vue.use(Router)

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
            path: '/auth/forgot-password',
            name: 'Forgot password',
            component: ForgotPassword,
            meta: {
                title: 'Forgot password',
                layout: 'auth-layout'
            }
        }, {
            path: '/',
            name: 'overview',
            beforeEnter: AuthGuard,
            component: Overview,
            meta: {
                layout: 'main-layout'
            }
        }, {
            path: '/history',
            name: 'History',
            beforeEnter: AuthGuard,
            component: History,
            meta: {
                layout: 'main-layout'
            }
        }, {
            path: '/planning',
            name: 'Planning',
            beforeEnter: AuthGuard,
            component: Planning,
            meta: {
                layout: 'main-layout'
            }
        }, {
            path: '/records',
            name: 'Records',
            beforeEnter: AuthGuard,
            component: Records,
            meta: {
                layout: 'main-layout'
            }
        }, {
            path: '/settings',
            name: 'Settings',
            beforeEnter: AuthGuard,
            component: Settings,
            meta: {
                layout: 'main-layout'
            }
        }
    ]
})
