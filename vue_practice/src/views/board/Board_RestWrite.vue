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
        <td>{{ writer }}</td>
      </tr>
      <tr>
        <th scope="row">제목</th>
        <td><input type="text" placeholder="제목을 입력하세요." ref="subjectInput" v-model.trim="subject"></td>
      </tr>
      <tr>
        <th scope="row">금액</th>
        <td><input type="text" placeholder="금액을 입력하세요." ref="priceInput" v-model.trim="price"></td>
      </tr>
      <tr>
        <th scope="row">내용</th>
        <td><textarea rows="10" placeholder="내용을 입력하세요." ref="contentTextarea" v-model.trim="content"></textarea></td>
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
  // this.filename = files[0].name;
  // console.log(this.filename);
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
      price : '',
      fileName : '',
      uploadimageurl: [],    // 업로드한 이미지의 미리보기 기능을 위해 url 저장하는 객체
    };
  },
  // mounted() {
  //   this.$refs.writerInput.focus();
  // },
  methods: {
    // 수정된 onSubmitForm => imagecnt도 같이 전송해줘야 함
    // onSubmitForm(){
    //   if(this.$refs.form.validate()) {        // 위에 써준 rules를 만족하면 실행
    //     axios({
    //       url: "http://127.0.0.1:52273/content/write/",
    //       method: "POST",
    //       data: {
    //         boardnum: this.$route.params.id,
    //         writer: this.writer,
    //         title: this.title,
    //         text: this.text,
    //         imagecnt: this.imagecnt
    //       },
    //     }).then(res => {
    //       alert(res.data.message);
    //       window.history.back();
    //     }).catch(err => {
    //       alert(err);
    //     });
    //   }
    // },
    // 추가된 method
    // onImageChange(file) {    // v-file-input 변경시
    //   if (!file) {
    //     return;
    //   }
    //   const formData = new FormData();    // 파일을 전송할때는 FormData 형식으로 전송
    //   this.uploadimageurl = [];        // uploadimageurl은 미리보기용으로 사용
    //   file.forEach((item) => {
    //     formData.append('filelist', item)    // formData의 key: 'filelist', value: 이미지
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       this.uploadimageurl.push({url: e.target.result});
    //       // e.target.result를 통해 이미지 url을 가져와서 uploadimageurl에 저장
    //     };
    //     reader.readAsDataURL(item);
    //   });
    //   axios({
    //     url: "http://127.0.0.1:52273/content/imagesave/",    // 이미지 저장을 위해 back서버와 통신
    //     method: "POST",
    //     headers: {'Content-Type': 'multipart/form-data'},    // 이걸 써줘야 formdata 형식 전송가능
    //     data: formData,
    //   }).then(res => {
    //     console.log(res.data.message);
    //     this.imagecnt = file.length;    // 이미지 개수 저장
    //   }).catch(err => {
    //     alert(err);
    //   });
    // },
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
        // console.log(this.uploadimageurl[0]);
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
    boardSaveClick() {
      if (this.subject == "") {
        alert("제목을 입력하세요.");
        this.$refs.subjectInput.focus();
        return;
      } else if (this.content == "") {
        alert("내용을 입력하세요.");
        this.$refs.contentTextarea.focus();
        return;
      } else if (this.price < 0 || isNaN(this.price)) {
        alert("최소금액을 입력하세요.");
        this.$refs.priceInput.focus();
        return;
      }
      var result = confirm("등록하시겠습니까?");
      // console.log('write 중 filename:')
      // console.log(this.fileName);
      if (result) {
        // console.log(this.fileName);
        let boardItem = { writer : this.writer, subject : this.subject, minPrice : this.price, content : this.content ,imageLink : this.uploadimageurl[0]};
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