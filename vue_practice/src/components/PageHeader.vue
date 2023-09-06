<template>
  <header>
    <div id="nav">
      <h1>CSE_Chaining</h1>
      <ul id="topMenu">
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
        <!--        <li>-->
        <!--          <router-link to="/board/list">게시판</router-link>-->
        <!--        </li>-->
        <li>
          <router-link to="/boardRest">기부 게시판</router-link>
        </li>
      </ul>
      <p>
        <router-link :to="{ name: 'login_rest', query: { returnUrl: '/' }}" v-show="isLogin == false">Login
        </router-link>
      </p>
    </div>
  </header>
    <hr/>
</template>

<script>
export default {
  name: "PageHeader",
  computed: {
    isLogin() {
      return this.$store.getters['loginStore/isLogin'];
    }
  },
}
</script>

<style scoped>
#nav {
  display: flex;
}
h1 {
  font-family: GangwonState;
}

hr {
  margin: 0;
  padding: 4px 0;
  background-color: #46B6A0;
}

header {
  background-color: #A3D5BE;
  margin: 0;
  padding: 0;
}

#topMenu {
  text-align: center;
  margin: auto auto auto 570px;
  font-size: 20px;
  padding: 0;
}

#topMenu > li {
  display: inline-block;
  position: relative;
  margin: 0;
  padding: 0 20px;
  font-family: GangwonState;
}

#topMenu > li > router-link {
  display: block; /* 링크 텍스트는 블록으로 */
  font-size: 5em;
  color: #fff; /* 글자 색 */
  font-weight: 600; /* 글자 굵기 */
  padding: 20px 60px; /* 패딩 */

}

#topMenu > li > router-link:hover {
  color: #1fa8f8;
  text-shadow: 0 -1px #222;
}

ul {
  list-style: none;
}

</style>