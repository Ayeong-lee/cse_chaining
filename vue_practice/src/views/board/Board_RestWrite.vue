<template>
  <div class="board">
    <table>
      <colgroup>
        <col style="width:18.5%">
        <col style="width:auto">
      </colgroup>
      <tbody>
      <tr>
        <th scope="row">작성자</th>
        <td><input type="text" placeholder="아이디를 입력하세요." ref="writerInput" v-model.trim="writer"></td>
      </tr>
      <tr>
        <th scope="row">제목</th>
        <td><input type="text" placeholder="제목을 입력하세요." ref="subjectInput" v-model.trim="subject"></td>
      </tr>
      <tr>
        <th scope="row">내용</th>
        <td><textarea rows="10" placeholder="내용을 입력하세요." ref="contentTextarea" v-model.trim="content"></textarea></td>
      </tr>
      </tbody>
    </table>
    <div class="buttons">
      <div class="right">
        <button class="button blue" @click="boardSaveClick">등록</button>
        <button class="button" @click="boardCancelClick">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Board_RestWrite",
  data: function () {
    return {
      writer: '',
      subject: '',
      content: ''
    };
  },
  mounted() {
    this.$refs.writerInput.focus();
  },
  methods: {
    async boardSaveClick() {
      let boardItem = {writer: this.writer, subject: this.subject, content: this.content};
      axios.post("http://localhost:9000/boards", boardItem).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
      if (this.writer == "") {
        alert("작성자를 입력하세요.");
        this.$refs.writerInput.focus();
        return;
      } else if (this.subject == "") {
        alert("제목을 입력하세요.");
        this.$refs.subjectInput.focus();
        return;
      } else if (this.content == "") {
        alert("내용을 입력하세요.");
        this.$refs.contentTextarea.focus();
        return;
      }
      var result = confirm("등록하시겠습니까?");
      if (result) {
        let boardItem = { writer : this.writer, subject : this.subject, content : this.content };
        axios.post("http://localhost:9000/boards", boardItem).then((res)=>{
          console.log(res);
          if (res.data.success == true) {
            alert("등록되었습니다.");
            this.$router.push({name : 'BoardRest'});
          } else {
            alert("등록되지 않았습니다.");
          }
        }).catch((err) => {
          console.log(err);
          alert("등록되지 않았습니다.");
        });
      }
    },
    boardCancelClick() {
      this.$router.go(-1);
    },
  }

}
</script>

<style scoped>
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
  padding: 7px 20px 9px 20px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  line-heighT: 150%;
}

.board table td input, .board table td textarea {
  width: 100%;
  color: #000 !important;
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

.buttons > div > .button {
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

.buttons > div > .button.blue {
  color: #fff;
  border-color: #0099d2 !important;
  background: #0099d2 !important;
}

.board {
  width: 800px;
  margin: 20px auto;
}
</style>