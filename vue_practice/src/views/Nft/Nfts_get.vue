<template>
  <div class="boardview">
    <h3>NFT목록</h3>
    <table>
      <colgroup>
        <col style="width:18.5%">
        <col style="width:auto">
      </colgroup>
      <thead>
      <tr>
        <th>NFT이름</th>
        <th>내용</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="boardItem in nftItem" v-bind:key="boardItem.title">
        <td>{{boardItem.title}}</td>
        <td>{{boardItem.description}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name : 'NFTsGet',
  data : function() {
    return {
      boardItem : {},
      nftItem: []
    };
  },
  mounted() {
    this.getBoardRead();
  },
  methods : {
    getBoardRead() {
      axios.defaults.headers.common['Access-Token'] = this.$store.state.loginStore.accessToken;
      axios.get("http://localhost:9000/blockchain/nfts" ,{
        headers: {
          'Authorization' : `Bearer ${this.$store.state.accessToken}`
        }
      }).then((res) => {
        console.log(res);
        this.boardItem = res.data.data;
        this.nftItem = this.boardItem.ownedNfts;
        console.log(this.nftItem);
      }).catch((err) => {
        console.log(err);
      });
    }
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

.buttons {
  position: relative;
  height: 32px;
  margin-top: 20px;
}

.buttons > div.right {
  position: absolute;
  height: 32px;
  right: 0;
}

.buttons > div.left {
  position: absolute;
  height: 32px;
  left: 0;
}

.buttons > div.right > .button.blue {
  display: inline-block;
  overflow: visible;
  cursor: pointer;
  width: 125px;
  height: 32px;
  margin: 0 2px;
  padding: 0 15px;
  line-height: 32px;
  font-size: 14px;
  border: 1px solid #dfdfdf;
  background: #fff;
  border-radius: 10px;
}
.buttons > div > button {
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