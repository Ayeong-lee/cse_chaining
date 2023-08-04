<template>
  <div class="board">
    <h1>This is an board list page</h1>
    <table>
      <colgroup>
        <col style="width:10%">
        <col style="width:50%">
        <col style="width:15%">
        <col style="width:25%">
      </colgroup>
      <thead>
      <tr>
        <th scope="col">번호</th>
        <th scope="col">제목</th>
        <th scope="col">작성자</th>
        <th scope="col">작성일</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="boardItem in boardList" v-bind:key="boardItem.no">
        <td>{{boardItem.no}}</td>
        <td>{{boardItem.subject}}</td>
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
      boardList : []
    }
  },
  mounted() {
    this.getBoardList()
    this.getOrder()
  },
  methods: {
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

.board { width:800px; margin: 20px auto; }
.board table { width:100%; border-top:2px solid #1d4281; border-spacing:0; }
.board table th { padding:8px 10px 10px 10px; vertical-align:middle; color:#1d4281; font-size:14px; border-bottom:1px solid #ccc; background:#f8f8f8; }
.board table td { padding:7px 10px 9px 10px; text-align:center; vertical-align:middle; border-bottom:1px solid #ccc; font-size:14px; line-heighT:150%; }
</style>