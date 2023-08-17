<template>
  <div class="boardview">
    <h3>게시글</h3>
    <table>
      <colgroup>
        <col style="width:18.5%">
        <col style="width:auto">
      </colgroup>
      <tbody>
      <tr>
        <th scope="row">제목</th>
        <td class="title">{{boardItem.subject}}</td>
      </tr>
      <tr>
        <th scope="row">내용</th>
        <td>{{boardItem.content}}</td>
      </tr>
      <tr>
        <th scope="row">작성자</th>
        <td>{{boardItem.writer}}</td>
      </tr>
      <tr>
        <th scope="row">작성일자</th>
        <td>{{boardItem.writedate}}</td>
      </tr>
      <tr>
        <th scope="row">최소금액</th>
<!--        <td>{{boardItem.money}}</td>-->
      </tr>
      </tbody>
    </table>
  </div>
  <div class="buttons">
    <div class="right">
      <router-link :to="{name : 'Account', query : {boardNo: boardItem.no}}" class="button blue"><span>기부하기</span></router-link>
      <button class="button" @click="boardListClick">목록</button>
    </div>
    <div class="left">
      <button class="button" v-if="isEditable" @click="boardEditClick">수정</button>
      <button class="button" v-if="isEditable" @click="boardDeleteClick">삭제</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name : 'Board_RestView',
  data : function() {
    return {
      boardItem : {}
    };
  },
  mounted() {
    this.getBoardRead();
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
    getBoardRead() {
      axios.get("http://localhost:9000/boards/" + this.$route.query.boardNo).then((res)=>{
        console.log(res);
        this.boardItem = res.data.data;
      }).catch((err) => {
        console.log(err);
      });
    },
    boardListClick() {
      this.$router.go(-1);
    },
    boardEditClick() {
      var result = confirm("수정하시겠습니까?");
      if (result) {
        this.$router.push({name: 'BoardRestEdit', query: {boardNo: this.boardItem.no}});
      }
    },
    async boardDeleteClick() {
      var result = confirm("삭제하시겠습니까?");
      if (result) {
        try {
          let res = await axios.delete("http://localhost:9000/boards/" + this.$route.query.boardNo);
          console.log(res.data.success);
          if (res.data.success == true) {
            alert("삭제되었습니다.");
            this.$router.push({name : 'BoardRest'});
          } else {
            alert("삭제되지 않았습니다.");
          }
        } catch(err) {
          console.log(err);
          alert("삭제되지 않았습니다.");
        }
      }
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