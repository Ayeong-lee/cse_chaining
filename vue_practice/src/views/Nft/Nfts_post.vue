<template>
  <div class="board">
    <table>
      <colgroup>
        <col style="width:18.5%">
        <col style="width:auto">
      </colgroup>
      <tbody>
      <tr>
        <th scope="row">발행자</th>
        <td>{{ writer }}</td>
      </tr>
      <tr>
        <th scope="row">NFT 이름</th>
        <td><input type="text" placeholder="제목을 입력하세요." ref="subjectInput" v-model.trim="subject"></td>
      </tr>
      <tr>
        <th scope="row">설명</th>
        <td><textarea rows="10" placeholder="설명을 입력하세요." ref="contentTextarea" v-model.trim="content"></textarea></td>
      </tr>
      </tbody>
      <div class="custom-file">
        <input type="file" name="photos" id="photos" v-on:change='savePic()' @change="readInputFile"/>
      </div>
      <br>
    </table>
    <div id="imagePreview">
      <img id="img"/>
    </div>
    <div class="buttons">
      <div class="right">
        <button class="button blue" @click="boardSaveClick">등록</button>
        <button class="button" @click="boardCancelClick">취소</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import $ from 'jquery';
const readInputFile = (e) => {// 미리보기 기능구현
  $('#imagePreview').empty();
  var files = e.target.files;
  var fileArr = Array.prototype.slice.call(files);
  fileArr.forEach(function(f){
    if(!f.type.match("image/.*")){
      alert("이미지 확장자만 업로드 가능합니다.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e){
      var html = `<img src=${e.target.result} />`;
      $('#imagePreview').append(html);
    };
    reader.readAsDataURL(f);
  })
}
</script>

<script>
import axios from "axios";

export default {
  name: "Board_RestWrite",
  data: function () {
    return {
      writer : this.$store.state.loginStore.memberId,
      subject: '',
      content: '',
      fileName : '',
      uploadimageurl: [],    // 업로드한 이미지의 미리보기 기능을 위해 url 저장하는 객체
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('click', this.onClick);
    });
  },
  methods: {
    savePic(){
      var photos   = new FormData();
      var photoFile = document.getElementById("photos");
      photos.append("photos", photoFile.files[0]);
      this.filename = photoFile.files[0].name;
      console.log(this.fileName);
      axios.defaults.headers.common['Access-Token'] = this.$store.state.loginStore.accessToken;
      axios.post('http://localhost:9000/upload', photos  , {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization' : `Bearer ${this.$store.state.accessToken}`
        }
      }).then((res)=> {
        this.uploadimageurl = res.data.photos;
        console.log('savePic()on load... getting'+this.uploadimageurl[0])
        // console.log(this.uploadimageurl[0]);
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
    boardSaveClick() {
      if (this.subject == "") {
        alert("이름을 입력하세요.");
        this.$refs.subjectInput.focus();
        return;
      } else if (this.content == "") {
        alert("내용을 입력하세요.");
        this.$refs.contentTextarea.focus();
        return;
      }
      var result = confirm("등록하시겠습니까?");
      if (result) {
        axios.defaults.headers.common['Access-Token'] = this.$store.state.loginStore.accessToken;
        let boardItem = { NFTname : this.subject,  description : this.content ,img : this.uploadimageurl[0]};
        axios.post("http://localhost:9000/blockchain/nfts", boardItem ,{
          headers: {
            'Authorization' : `Bearer ${this.$store.state.accessToken}`
          }
        }).then((res)=>{
          console.log(res);
          if (res.data.success == true) {
            alert("등록되었습니다.")
            this.$router.go(-1);
          } else {
            console.log(res.data.success)
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