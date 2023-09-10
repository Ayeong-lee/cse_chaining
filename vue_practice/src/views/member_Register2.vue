<template>
  <div class="login">
    <h1>회원가입</h1>
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
      <p>
        <label for="memberAccountInput">계좌</label>
        <input type="password" id="memberAccountInput" class="input_text" ref="memberAccountInput" v-model.trim="my_account" placeholder="계좌를 입력하세요." />
      </p>
      <p>
        <label for="memberkeyInput">개인 키</label>
        <input type="password" id="memberkeyInput" class="input_text" ref="memberkeyInput" v-model.trim="private_key" placeholder="키를 입력하세요." />
      </p>
      <p class="buttons">
        <button @click.prevent="doRegister" class="button blue">회원가입</button>
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
      my_account: '',
      private_key: ''
    };
  },
  methods : {
    async doRegister() {
      let memberInfo = { id: this.memberId, password: this.memberPassword , name: this.memberName , myAccount: this.my_account , privateKey : this.private_key};
      await axios.post("http://localhost:9000/members/sign-up",memberInfo).then((res)=> {
        console.log(res.data)
        if(res.data.success){
          alert("가입에 성공하였습니다.")
          this.$router.push('../');
        }
      }).catch((err) => {
        alert("가입에 실패하였습니다.")
        this.errorMessage = err.response.data.errormessage;
      });
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

h1 {
  font-size: 30px;
  font-family: 'Single Day';
}
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