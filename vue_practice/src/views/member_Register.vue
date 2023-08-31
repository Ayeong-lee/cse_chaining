<template>
  <div class="login">
    <h1>This is an re-registration page</h1>
    <form class="Regform">
      <p>
        <label for="memberIdInput">성함</label>
        <input type="text" id="memberNameInput" class="input_text" ref="memberNameInput" v-model.trim="memberName" placeholder="성함을 입력하세요." />
      </p>
      <p>
        <label for="memberIdInput">아이디</label>
        <input type="text" id="memberIdInput" class="input_text" ref="memberIdInput" v-model.trim="memberId" placeholder="아이디를 입력하세요." />
      </p>
      <p>
        <label for="memberPasswordInput">패스워드</label>
        <input type="password" id="memberPasswordInput" class="input_text" ref="memberPasswordInput" v-model.trim="memberPassword" placeholder="패스워드를 입력하세요." />
      </p>
      <p class="buttons">
        <button @click.prevent="doRegister" class="button blue">회원수정</button>
        <button @click.prevent="doCancel" class="button">취소</button>
      </p>
    </form>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "member_Register",
  data : function() {
    return {
      memberId : '',
      memberPassword : '',
      memberName: '',
      errorMessage : '',
    };
  },
  methods : {
    async doRegister() {
      let memberInfo = { id: this.memberId, password: this.memberPassword , name: this.memberName};
      let success = false;
      axios.defaults.headers.common['Access-Token'] = this.$store.state.loginStore.accessToken;
      await axios.put("http://localhost:9000/members",{
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${this.$store.state.accessToken}`
        }
      },
          memberInfo
      ).then(response => {
        const returnUrl = window.location.search.replace(/^\?returnUrl=/, "");
        this.$router.push(returnUrl);
        success = response.success;
      }).catch((err) => {
        this.errorMessage = err.response.data.errormessage;
      });
      if (this.memberId == "") {
        alert("아이디를 입력하세요.");
        this.$refs.memberIdInput.focus();
        return;
      } else if (this.memberPassword == "") {
        alert("패스워드를 입력하세요.");
        this.$refs.memberPasswordInput.focus();
        return;
      }
      if (success == true) {
        console.log("회원가입 되었습니다.");
      } else {
        console.log("가입되지 않았습니다.");
        let err = new Error("Request failed with status code 401");
        err.status = 401;
      }
    },
    doCancel() {
      this.$router.push('../');
    }
  },
  mounted() {
    this.$refs.memberIdInput.focus();
  }
}
</script>
<style>
.login {
  width: 800px;
  margin: 20px auto;
}

.Regform {
  width: 400px;
  margin: auto;
}

.Regform p > label {
  display: inline-block;
  width: 100px;
  font-size: 14px;
  padding-right: 10px;
}

.Regform p > .input_text {
  width: 200px;
  font-size: 14px;
  height: 32px;
}

.buttons {
  position: relative;
  height: 32px;
  margin-top: 20px;
}

.buttons > .button {
  overflow: visible;
  cursor: pointer;
  min-width: 125px;
  height: 32px;
  margin: 0 2px;
  padding: 0 15px;
  line-height: 32px;
  font-size: 14px;
  border: 1px solid #dfdfdf;
  background: #fff;
  border-radius: 10px;
}
</style>