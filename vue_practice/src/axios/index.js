import axios from 'axios';
import store from '@/store';

axios.interceptors.request.use(async function (config) {
    // 요청이 전달되기 전에 처리
    // 로그인되었는지 확인한다.
    var isLogin = store.getters['loginStore/isLogin'];
    if (isLogin) {
        // accessToken이 만료되었는지 확인합니다.
        var isAccessTokenExpire = store.getters['loginStore/isAccessTokenExpire'];
        if (isAccessTokenExpire) {
            // accessToken이 만료되면 토큰 재발급을 진행합니다.
            try {
                // accessToken 재발급 요청
                await store.dispatch("loginStore/doRefreshToken");
                // 재발급된 accessToken으로 해더를 수정합니다.
                config.headers['Access-Token'] = store.state.loginStore.accessToken;
            } catch(err) {
                alert("다시 로그인을 해주시기 바랍니다.\n" + err.response.data.errormessage);
            }
        }
    }
    return config;
}, function (error) {
    // 요청 오류에 대한 처리
    return Promise.reject(error);
});

export default axios;