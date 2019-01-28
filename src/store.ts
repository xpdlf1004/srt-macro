import Vue from "vue";
import Vuex from "vuex";
import * as APIClient from "./api-client";
import { Schedule } from "../common/schedule";

Vue.use(Vuex);

export interface RootState {
    isAuthenticated?: boolean;
    schedules: Schedule[];
}

function initialState() {
    return {
        isAuthenticated: undefined,
        schedules: []
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
        },
        ADD_SCHEDULE(state, schedule: Schedule) {
            state.schedules = [...state.schedules, schedule];
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
