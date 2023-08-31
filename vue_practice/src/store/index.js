import { createStore } from 'vuex';
// import scoreStore from '@/store/modules/score.js';
import loginStore from '@/store/modules/login.js';
import createPersistedState from "vuex-persistedstate";

const storageState = createPersistedState({
    paths: ['loginStore']
});
export default createStore({
    modules: {
        // scoreStore: scoreStore,
        loginStore: loginStore
    },
    plugins: [storageState],
    state: {
        // 합산 점수
        total: 0,
        // 랜덤 점수
        score: 0,
        // 카운트
        count: 3
    },
    getters: {
        // 합계를 가져옵니다.
        getTotal(state) {
            return state.total;
        },
        // 점수를 가져옵니다.
        getScore(state) {
            return state.score;
        },
        // 카운트 문자열을 가져옵니다.
        getCountString(state) {
            return "현재 카운트가 " + state.count + "번 남았습니다.";
        },
        // 점수가 10이상이면 성공 문자열을 가져옵니다.
        getTotalState(state, getters) {
            if (state.count == 0) {
                return getters.getTotal >= 10 ? "성공" : "실패";
            }
        }
    },
    mutations: {
        // 카운트를 감소시킵니다.
        decrementCount(state) {
            state.count--;
        },
        // 점수를 랜덤으로 증가 시킵니다.
        incrementTotalByRandom(state) {
            const random = Math.floor(Math.random() * 10);
            state.score = random;
            state.total += random;
        },
        // 점수와 카운트를 초기화시킵니다.
        reset(state) {
            state.total = 0;
            state.score = 0;
            state.count = 3;
        }
    },
    actions: {
        // 점수를 처리합니다.
        doScore({commit,state}) {
            if (state.count > 0) {
                commit('decrementCount');
                commit('incrementTotalByRandom');
            }
        },
        // 초기화합니다.
        reset({commit}) {
            commit('reset');
        }
        // or
        // doScore({commit,state}) {
        //     if (state.count > 0) {
        //         commit('decrementCount');
        //         commit('incrementTotalByRandom');
        //     }
        // },
        // reset({commit}) {
        //     commit('reset');
        // }
    }
});