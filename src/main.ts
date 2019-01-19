import BootstrapVue from "bootstrap-vue";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
