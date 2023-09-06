<template>
  <div class="header">
    <div class="topline">
      <div class="headmenu">
        <div v-if="isLogin">
          {{ this.$store.state.loginStore.memberId }}님, 안녕하세요.
          <span @click="Logout()">로그아웃</span>
          <router-link :to="{ name: 'register', query: { returnUrl: '/' }}" v-show="isLogin == true">회원수정</router-link>
        </div>
        <div v-else>
          <router-link :to="{ name: 'login_rest', query: { returnUrl: '/' }}" v-show="isLogin == false">로그인</router-link>
          <router-link :to="{ name: 'register2', query: { returnUrl: '/' }}" v-show="isLogin == false">회원가입</router-link>
        </div>
      </div>
    </div>
  </div>
  <PageHeader/> <!-- 헤더 컴포넌트 -->
  <router-view/>  <!-- 페이지 이동이 표시될 곳 -->
  <PageFooter/> <!-- 푸터 컴포넌트 -->
</template>

<script>
import PageHeader from '@/components/PageHeader'
import PageFooter from '@/components/PageFooter'

export default {
  name: 'App',
  methods: {
    Logout() {
      this.$store.dispatch("loginStore/doLogout");
      this.$router.push('/');
    }
  },
  // mounted() {
  //   this.$store.dispatch("loginStore/doReadStateFromStorage");
  // },
  computed: {
    isLogin() {
      return this.$store.getters['loginStore/isLogin'];
    }
  },
  components: {
    PageFooter,
    PageHeader
  }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}

.header {
  position: relative;
  background-color: #46B6A0;
}

.header .topline {
  position: relative;
  height: 30px;
  margin: 0 10px;
}

.header .topline .headmenu {
  position: absolute;
  right: 0;
  top: 4px;
}

.header .topline .headmenu a {
  padding: 0 5px;
  font-weight: bold;
  color: #2c3e50;
}

.header .topline .headmenu span {
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
  text-decoration: underline;
}
</style>