<template>
  <div>
    <!-- connect-wallet button is visible if the wallet is not connected -->
    <button v-if="!connected" @click="connect">wallet 연결하기</button>
    <!-- call-contract button is visible if the wallet is connected -->
    <button v-if="connected" @click="callContract">잔고 조회하기</button>
    <div v-html="contractResult" class="ETHmessage">
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
export default {
  name: 'connectWeb3',

  data() {
    return {
      connected: false,
      contractResult: '',
      account : [],
      web3: '',
      my_account: '',
      valance: ''
    }
  },
  methods: {
    connect: function () {
      // this connects to the wallet
      if (window.ethereum) { // first we check if metamask is installed
        window.ethereum.request({method: 'eth_requestAccounts'})
            .then(() => {
              this.connected = true; // If users successfully connected their wallet
            });
      }
    },
    callContract: async function () {
      // method for calling the contract method
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);

      } else if (typeof window.web3 !== 'undefined') {
        this.web3 = new Web3(window.web3.currentProvider);
      } else {
        alert('No web3 instance injected, using local web3.')
        //메타마스크를 설치하라는 alert 띄워줄 것
      }
      if (this.web3) {
        this.account = await this.web3.eth.requestAccounts(); //이렇게 하면 계좌 리스트가 불러와지고
        this.my_account = this.account[0]; //거기서 맨 첫번째 요소를 불러와서 계좌에 셋팅해주면 됨 -> '문자열' 형식인지 다시 확인해보고 백엔드로 전달
        this.valance = await this.web3.eth.getBalance(this.account[0]); //이건 본인 계좌 잔고 함수
        console.log(this.account);
        console.log(this.valance);

        let result = Number(this.valance);
        result = result/Math.pow(10,18);
        result = result.toFixed(4);
        this.contractResult = '현재 잔고는<br>' + result.toString() + 'ETH<br>입니다.';
      }
    }
  }
}
</script>

<style scoped>
div .ETHmessage {
  font-family: GangwonState;
  font-size: 30px;
}
div button {
  display: inline-block;
  overflow: visible;
  cursor: pointer;
  width: 180px;
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