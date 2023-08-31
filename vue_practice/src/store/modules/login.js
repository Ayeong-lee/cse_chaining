import axios from 'axios';
// import { useCookies } from "vue3-cookies";
const axiosRefresh = axios.create();
// const { cookies } = useCookies();

const loginStore = {
    namespaced: true,
    state: {
        memberId: '',
        accessToken: '',
        refreshToken: ''
    },
    getters: {
        // 로그인 여부를 가져옵니다.
        isLogin(state) {
            return state.refreshToken == '' ? false : true;
        },
        // accessToken이 만료되었는지 여부를 가져옵니다.
        isAccessTokenExpire(state) {
            let expire = false;
            // accessToken에서 .(도트)로 분리하여 payload를 가져옵니다.
            let base64Payload = state.accessToken.split('.')[1];
            // URL과 호환되지 않는 문자를 base64 표준 문자로 교체합니다.
            base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            // atob() 메소드로 복호화합니다.
            base64Payload = atob(base64Payload);
            // JSON 객체로 변환합니다.
            var payloadObject = JSON.parse(base64Payload);
            // accessToken의 만료 시간을 확인합니다.
            var currentDate = new Date().getTime() / 1000;
            if (payloadObject.exp <= currentDate) {
                console.log("token expired");
                expire = true;
            } else {
                console.log("token valid");
            }
            return expire;
        }
    },
    mutations: {
        // memberId를 설정합니다.
        setMmemberId(state, memberId) {
            state.memberId = memberId;
        },
        // Access-Token를 설정합니다.
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        },
        // Refresh-Token를 설정합니다.
        setRefreshToken(state, refreshToken) {
            state.refreshToken = refreshToken;
        },
        // 초기화시킵니다.
        reset(state) {
            state.memberId = '';
            state.accessToken = '';
            state.refreshToken = '';
            //cookies.remove("testvue.login.memberId");
            //cookies.remove("testvue.login.accessToke");
            //cookies.remove("testvue.login.refreshToken");
            //cookies.remove("testvue.login");
        }
        /*
        // Storage에 state를 저장합니다.
        saveStateToStorage(state) {
            //cookies.set("testvue.login.memberId", state.memberId, 60 * 60 * 24 * 30);
            //cookies.set("testvue.login.accessToke", state.accessToken, 60 * 60 * 24 * 30);
            //cookies.set("testvue.login.refreshToken", state.refreshToken, 60 * 60 * 24 * 30);
            //cookies.set("testvue.login", JSON.stringify(state), 60 * 60 * 24 * 30);
        },
        // Storage에서 state를 읽어옵니다.
        readStateFromStorage(state) {
            //if (cookies.get("testvue.login.memberId") != null) {
            //	state.memberId = cookies.get("testvue.login.memberId");
            //}
            //if (cookies.get("testvue.login.accessToken") != null) {
            //	state.accessToken = cookies.get("testvue.login.accessToken");
            //}
            //if (cookies.get("testvue.login.refreshToken") != null) {
            //	state.refreshToken = cookies.get("testvue.login.refreshToken");
            //}
            //if (cookies.get("testvue.login") != null) {
            //	let storage = cookies.get("testvue.login");
            //	if (storage.memberId != null) {
            //		state.memberId = storage.memberId;
            //	}
            //	if (storage.accessToken != null) {
            //		state.accessToken = storage.accessToken;
            //	}
            //	if (storage.memberId != null) {
            //		state.refreshToken = storage.refreshToken;
            //	}
            //}
        }
        */
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
                    commit('setRefreshToken', res.data.refreshToken);
                    // Storage에 state를 저장합니다.
                    //commit('saveStateToStorage');
                    axios.defaults.headers.common['Access-Token'] = res.data.accessToken;
                    result = true;
                } else {
                    console.log("로그인되지 않았습니다.");
                    let err = new Error("Request failed with status code 401");
                    err.status = 401;
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
        },
        // Access-Token를 갱신합니다.
        async doRefreshToken({commit, state}) {
            let result = false;
            let resultErr = null;
            if (state.accessToken != "") {
                let token = { id: state.memberId, accessToken : state.accessToken, refreshToken : state.refreshToken };
                try {
                    let res = await axiosRefresh.post("http://localhost:9000/members/refresh", token);
                    if (res.data.success == true) {
                        console.log("Access-Token이 갱신되었습니다.");
                        commit('setAccessToken', res.data.accessToken);
                        console.log(res.data.accessToken);
                        axios.defaults.headers.common['Access-Token'] = res.data.accessToken;
                        result = true;
                    } else {
                        console.log("Access-Token이 갱신되지 않았습니다.");
                        let err = new Error("Request failed with status code 401");
                        err.status = 401;
                        err.response = {data:{"success":false, "errormessage":"Access-Token이 갱신되었습니다."}};
                        resultErr = err;
                    }
                } catch(err) {
                    //console.log(err);
                    if (!err.response) {
                        err.response = {data:{"success":false, "errormessage":err.message}};
                    }
                    resultErr = err;
                }
            } else {
                let err = new Error("Access-Token does not exist");
                err.status = 401;
                err.response = {data:{"success":false, "errormessage":"Access-Token이 없습니다."}};
                resultErr = err;
            }
            return new Promise((resolve, reject) => {
                if (result) {
                    resolve();
                } else {
                    reject(resultErr);
                }
            });
        }
        /*
        doReadStateFromStorage({commit}) {
            commit('readStateFromStorage');
        }
        */
    }
};

export default loginStore;