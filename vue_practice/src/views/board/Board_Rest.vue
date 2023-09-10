<template>
  <div class="board-list">
    <div class="common-buttons">
      <div class="right">
        <router-link :to="{name: 'boardRestWrite'}" class="button btnBorder btnLightBlue"><span>쓰기</span></router-link>
      </div>
    </div>
    <table class="w3-table-all">
      <thead>
      <tr>
        <th>No</th>
        <th>제목</th>
        <th>작성자</th>
        <th>등록일시</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="boardItem in boardList" v-bind:key="boardItem.no">
        <td><span @click="boardNoClick(boardItem)">{{boardItem.no}}</span></td>
        <td><router-link :to="{name : 'BoardView', query : {boardNo: boardItem.no}}">{{boardItem.subject}}</router-link></td>
        <td>{{boardItem.writer}}</td>
        <td>{{boardItem.writedate}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name : "Board_Rest",
  data() { //변수생성
    return {
      boardList : [],
      boardPagination : {}
    }
  },
  mounted() {
    this.getBoardList()
    this.getOrder()
  },
  methods: {
    boardNoClick(boardItem) {
      this.$router.push({name : 'BoardView', query : {boardNo : boardItem.no}});
    },
    getBoardList() {
      axios.get('http://localhost:9000/boards').then((res)=>{
        console.log(res);
        this.boardList = res.data.data;
      }).catch((err) => {
        console.log(err);
      });
    },
    getOrder : function() {
      axios.get('http://localhost:9000/boards')
          .then((response) => {
            console.warn(response);
            this.result = response.data
          })
    }
  }
}
</script>

<style scoped>

.board-list {
  width: 800px;
  margin: 20px auto;
}
.button {
  display: block;
  position: relative;
  float: right;
  width: 65px;
  padding: 0;
  margin: 10px 20px 10px 0;
  font-weight: 100;
  text-align: center;
  line-height: 35px;
  color: #FFF;
  border-radius: 5px;
  transition: all 0.2s ;
  font-family: 'Single Day';
  font-size: 20px;
  text-decoration: none;
}
.btnBorder {
  box-shadow: 0px 0px 0px 0px #01939A;
}
.btnLightBlue {
  background: #5DC8CD;
}
.btnLightBlue.btnBorder:hover {
  box-shadow: 0px 0px 0px 5px #01939A;
}
.board table {
  width: 100%;
  border-top: 2px solid #1d4281;
  border-spacing: 0;
}

.board table th {
  padding: 8px 10px 10px 10px;
  vertical-align: middle;
  color: #1d4281;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  background: #f8f8f8;
}

.board table td {
  padding: 7px 10px 9px 10px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  line-heighT: 150%;
}

</style>