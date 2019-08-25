import Cookies from "js-cookie";
import Vue from "vue";
import Router, { Route } from "vue-router";
import store from "./store";
import Home from "./views/Home.vue";

Vue.use(Router);

const requireAuth = () => (from: Route, to: Route, next: any) => {
    if (store.state.isAuthenticated) {
        return next();
    }
    if (store.state.isAuthenticated == undefined) {
        const sessionKey = Cookies.get("connect.sid");
        if (sessionKey) {
            store.commit("LOGIN");
            return next();
        }
    }
    next("/login");
};

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            redirect: "/schedule"
        },
        {
            path: "/schedule",
            name: "home",
            component: Home,
            beforeEnter: requireAuth(),
            children: [
                {
                    path: "/",
                    name: "My schedule",
                    component: () =>
                        import(
                            /* webpackChunkName: "schedule" */ "./components/MySchedule.vue"
                        )
                },
                {
                    path: "add",
                    name: "Add schedule",
                    component: () =>
                        import(
                            /* webpackChunkName: "schedule" */ "./components/AddSchedule.vue"
                        )
                }
            ]
        },
        {
            path: "/login",
            name: "login",
            // route level code-splitting
            // this generates a separate chunk (login.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "login" */ "./views/Login.vue")
        }
    ]
});
