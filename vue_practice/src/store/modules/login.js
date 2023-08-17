import axios from 'axios';

const loginStore = {
    namespaced: true,
    state: {
        memberId: '',
        accessToken: ''
    },
    getters: {
        // 로그인 여부를 가져옵니다.
        isLogin(state) {
            return state.accessToken == '' ? false : true;
        }
    },
    mutations: {
        // memberId를 설정합니다.
        setMmemberId(state, memberId) {
            state.memberId = memberId;
        },
        // accessToken를 설정합니다.
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        },
        // 초기화시킵니다.
        reset(state) {
            state.memberId = '';
            state.accessToken = '';
        }
    },
    actions: {
        // 로그인합니다.
        async doLogin({ commit }, memberInfo) {
            let result = false;
            let resultErr = null;
            try {
                let res = await axios.post("http://localhost:9000/members/login", memberInfo);
                if (res.data.success == true) {
                    console.log("로그인되었습니다.");
                    commit('setMmemberId', memberInfo.id);
                    commit('setAccessToken', res.data.accessToken);
                    axios.defaults.headers.common['Access-Token'] = res.data.accessToken;
                    result = true;
                } else {
                    console.log("로그인되지 않았습니다.");
                    let err = new Error("Request failed with status code 401");
                    err.response = {data:{"success":false, "errormessage":"로그인되지 않았습니다."}};
                    resultErr = err;
                }
            } catch(err) {
                if (!err.response) {
                    err.response = {data:{"success":false, "errormessage":err.message}};
                }
                resultErr = err;
            }
            return new Promise((resolve, reject) => {
                if (result) {
                    resolve();
                } else {
                    reject(resultErr);
                }
            });
        },
        // 로그아웃합니다.
        doLogout({commit}) {
            commit('reset');
            delete axios.defaults.headers.common['Access-Token'];
        }
    }
};

export default loginStore;