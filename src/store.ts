import Vue from "vue";
import Vuex from "vuex";
import * as APIClient from "./api-client";

Vue.use(Vuex);

export interface RootState {
    isAuthenticated?: boolean;
}

function initialState() {
    return {
        isAuthenticated: undefined
    };
}

export default new Vuex.Store<RootState>({
    state: initialState,
    mutations: {
        LOGIN(state) {
            state.isAuthenticated = true;
        },
        LOGOUT(state) {
            state.isAuthenticated = false;
        },
        CLEAR(state: any) {
            const s = initialState() as any;
            Object.keys(s).forEach(key => {
                state[key] = s[key];
            });
        }
    },
    actions: {
        LOGIN({ commit }, { userNumber, userPassword }) {
            return APIClient.login({ userNumber, userPassword }).then(() => {
                commit("LOGIN");
            });
        },
        LOGOUT({ commit }) {
            commit("LOGOUT");
        }
    }
});
