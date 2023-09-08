<template>
  <div class="boardview">
    <h3>기부 프로필</h3>
    <table>
      <colgroup>
        <col style="width:18.5%">
        <col style="width:auto">
      </colgroup>
      <tbody>
      <tr>
        <th scope="row">id</th>
        <td class="title">{{boardItem.id}}</td>
      </tr>
      <tr>
        <th scope="row">계좌 정보</th>
        <td>{{boardItem.myAccount}}</td>
      </tr>
      <tr>
        <th scope="row">성함</th>
        <td>{{boardItem.name}}</td>
      </tr>
      <tr>
        <th scope="row">비밀번호</th>
        <td>{{boardItem.password}}</td>
      </tr>
      <tr>
        <th scope="row">비밀Key</th>
        <td>{{boardItem.privateKey}}</td>
      </tr>
      <tr>
        <th scope="row">기부 횟수</th>
        <td>{{boardItem.transactionCount}}</td>
      </tr>
      </tbody>
    </table>
    <button class="button" v-on:click="value = 'https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl='+getQR+'&choe=UTF-8'">QR생성</button>
    <img :src="value" v-if="this.value.length > 1">
  </div>
</template>
<script>
import axios from "axios";
export default {
  name : 'Board_RestView',
  data : function() {
    return {
      boardItem : {},
      imgURL: '',
      filename : '',
      value: ''
    };
  },
  mounted() {
    this.getBoardRead();
    this.getLink();
    this.$nextTick(() => {
      window.addEventListener('click', this.onClick);
    });
  },
  computed : {
    isEditable() {
      var result = false;
      var isLogin = this.$store.getters['loginStore/isLogin'];
      if (isLogin) {
        const writer = this.$store.state.loginStore.memberId;
        if (writer == this.boardItem.writer) {
          result = true;
        }
      }
      return result;
    }
  },
  methods : {
    getQR () {
      console.log(window.location.href)
      return window.location.href
    },
    getLink(){
      this.imgURL = "http://localhost:9000" + this.boardItem.imageLink
      return this.imgURL;
    },
    getBoardRead() {
      axios.defaults.headers.common['Access-Token'] = this.$store.state.loginStore.accessToken;
      axios.get("http://localhost:9000/members/me").then((res)=>{
        console.log(res);
        console.log(this.$route.query.boardNo);
        this.boardItem = res.data.data;
        console.log(this.boardItem.imageLink);
        this.imgURL = this.getLink();
        console.log(this.imgURL)
      }).catch((err) => {
        console.log(err);
      });

    },
  }
};
</script>

<style scoped>
.boardview {
  width: 800px;
  margin: 20px auto;
}

.boardview table {
  width: 100%;
  border-top: 2px solid #1d4281;
  border-spacing: 0;
}

.boardview table th {
  padding: 8px 10px 10px 10px;
  vertical-align: middle;
  color: #1d4281;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  background: #f8f8f8;
}

.boardview table td {
  padding: 7px 20px 9px 20px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  line-heighT: 150%;
}
.boardview table tr .picture{
  height:300px
}

.boardview table td.title {
  font-weight: bold;
}
</style>