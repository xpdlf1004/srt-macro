import Vue from "vue";
import Vuex from "vuex";
import * as APIClient from "./api-client";
import { Schedule } from "../common/schedule";
import * as _ from "lodash";

Vue.use(Vuex);

export interface RootState {
    isAuthenticated?: boolean;
    schedules: {
        [id: string]: Schedule;
    };
}

function initialState() {
    return {
        isAuthenticated: undefined,
        schedules: localStorage.getItem("schedule")
            ? JSON.parse(localStorage.getItem("schedule")!)
            : {}
    };
}

export default new Vuex.Store<RootState>({
    state: initialState,
    getters: {
        schedules: state => {
            return _.chain(state.schedules)
                .values()
                .filter(
                    (schedule: Schedule) =>
                        schedule.status === "error" ||
                        schedule.status === "running"
                )
                .value();
        },
        waitPaymentSchedules: state => {
            return _.chain(state.schedules)
                .values()
                .filter(
                    (schedule: Schedule) => schedule.status === "waitForPay"
                )
                .value();
        }
    },
    mutations: {
        LOGIN(state) {
            state.isAuthenticated = true;
        },
        LOGOUT(state) {
            state.isAuthenticated = false;
        },
        CLEAR(state: any) {
            localStorage.clear();
            const s = initialState() as any;
            Object.keys(s).forEach(key => {
                state[key] = s[key];
            });
        },
        UPDATE_SCHEDULE(state, schedule: Schedule) {
            const newSchedule = { ...state.schedules, [schedule.id]: schedule };
            localStorage.setItem("schedule", JSON.stringify(newSchedule));
            state.schedules = newSchedule;
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
