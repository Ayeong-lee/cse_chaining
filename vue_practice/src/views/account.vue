<template>
  <div class="login">
    <h2>원하시는 기부 금액을 입력해주세요</h2>
    <form class="loginform">
      <p>
        <span for="leastamount">최소 금액</span>
        <span class="input_text">{{boardItem.minPrice}}</span>
      </p>
      <p>
        <label for="amountinput">금액</label>
        <input type="text" id="amountinput" class="input_text" ref="amountinput" v-model.trim="amount" placeholder="원하시는 금액을 입력하세요." />
      </p>
      <p class="buttons">
        <button @click.prevent="doConfirm" class="button">제출</button>
        <button @click.prevent="doCancel" class="button">취소</button>
      </p>
    </form>
    <ConnectMeta />
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";
import ConnectMeta from './Contract/connect.vue'
export default {
  name: "account_",
  components: {
    ConnectMeta,
  },
  data : function() {
    return {
      // leastamount: 5000, //임시로 입력해둠 boarditem.minPrice  받아올 예정
      // accountamount: 50000000,// 임시로 입력해둠 accountItem.account로 받아올 예정
      amount: '',
      key: '',
      boardItem : {},
      accountItem : {},
      memberId : '',
      memberPassword : '',
      errorMessage : '',
      get_link: ''
    };
  },
  mounted() {
    this.getBoardRequired();
    this.$nextTick(() => {
      window.addEventListener('click', this.onClick);
    });
  },
  watch : {
    accountamount(newValue, oldValue){
      console.log(newValue, oldValue);
    }
  },
  methods : {
    doConfirm() {
      this.getBoardRequired()

      let leaveAccount = this.boardItem.minPrice;
      if(isNaN(this.amount)){
        alert("형식이 맞지 않습니다 \n형식에 맞게 숫자를 입력해주세요");
        return;
      } else if (this.amount < leaveAccount) {
        alert("최소 금액은 "+leaveAccount+"입니다.");
        return;
      } else if (this.amount > ConnectMeta.computed.Getvalance()) {
        console.log(ConnectMeta.data().valance)
        alert("잔고를 초과했습니다.");
        return;
      } else{
        axios.defaults.headers.common['Access-Token'] = this.$store.state.loginStore.accessToken;
        let Item = { sendEth : this.amount , boardNo : this.$route.query.boardNo};
        axios.post("http://localhost:9000/blockchain/transaction" , Item ).then((res)=>{
          console.log(res);
          if(res.data.success){
            alert("성공적으로 송금하였습니다.")
            let data=res.data.data;
            this.get_link = data.url;
            console.log(data.url);
            console.log(this.get_link);
            window.open(this.get_link, '_black');
          }else if(res.data.message !== undefined){
            alert(res.data.message)
          }
          this.accountamount = res.data.accountamount;
        }).catch((err) => {
          console.log(err);
          alert("송금에 실패했습니다..");
        });
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
  },
}
</script>

<style scoped>
h2 {
  font-size: 30px;
  font-family: 'Single Day';
}
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