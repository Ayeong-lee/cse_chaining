<template>
  <div class="login">
    <h1>This is an account page</h1>
    <form class="loginform">
      <p>
        <span for="leastamount">최소 금액</span>
        <span class="input_text">{{leastamount}}</span>
      </p>
      <p>
        <label for="amountinput">금액</label>
        <input type="text" id="amountinput" class="input_text" ref="amountinput" v-model.trim="amount" placeholder="원하시는 금액을 입력하세요." />
      </p>
      <p>
        <span for="accountamount">현재 잔고</span>
        <span class="input_text">{{accountamount}}</span>
      </p>
      <p class="buttons">
        <button @click.prevent="doConfirm" class="button blue">제출</button>
        <button @click.prevent="doCancel" class="button">취소</button>
      </p>
    </form>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "account_",
  data : function() {
    return {
      leastamount: 5000, //임시로 입력해둠 boarditem.money로 받아올 예정
      accountamount: 500000000,// 임시로 입력해둠 accountItem.account로 받아올 예정
      amount: '',
      boardItem : {},
      accountItem : {},
      memberId : '',
      memberPassword : '',
      errorMessage : ''
    };
  },
  mounted() {
    this.getBoardRequired();
  },
  watch : {
    accountamount(newValue, oldValue){
      console.log(newValue, oldValue);
    }
  },
  methods : {
    doConfirm() {
      if(isNaN(this.amount)){
        alert("형식이 맞지 않습니다 \n형식에 맞게 숫자를 입력해주세요");
      } else if (this.amount < this.leastamount) {
        alert("최소 금액은 "+this.leastamount+"입니다.");
        return;
      } else if (this.amount > this.accountamount) {
        alert("잔고를 초과했습니다.");
        return;
      } else{
        this.accountamount -= this.amount
        alert("성공적으로 송금하였습니다.")
      }
    },
    doCancel() {
      this.$router.push('../');
    },
    getBoardRequired(){
      axios.get("http://localhost:9000/boards/" + this.$route.query.boardNo).then((res)=>{
        console.log(res);
        this.boardItem = res.data.data;
      }).catch((err) => {
        console.log(err);
      });
    },
    // getAccount(){
    //   axios.get("http://localhost:9000/members/login", memberInfo).then((res)=>{
    //     console.log(res);
    //     this.boardItem = res.data.data;
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // }
  },
}
</script>

<style scoped>
.login {
  width: 800px;
  margin: 20px auto;
}

.loginform {
  width: 400px;
  margin: auto;
}
.loginform p > span {
  display: inline-block;
  width: 100px;
  font-size: 14px;
  padding-right: 10px;
}
.loginform div > .input_text {
  width: 200px;
  font-size: 14px;
  height: 32px;
}
.loginform p > label {
  display: inline-block;
  width: 100px;
  font-size: 14px;
  padding-right: 10px;
}

.loginform p > .input_text {
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