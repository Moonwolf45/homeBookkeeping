export default function (to, from, next) {
    if (JSON.parse(localStorage.getItem('auth_user')) && localStorage.getItem('access_token')) {
        next();
    } else {
        next('/auth/login?loginError=true');
    }
}
