<template>
    <div class="about">
        <h1>사이트맵</h1>
      <table>
        <colgroup>
          <col style="width:auto">
          <col style="width:auto">
        </colgroup>
        <tbody>
        <tr>
          <td>
            <router-link to="/connect">
              <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                  class="meta_image">
            </router-link>
          </td>
          <td>
            <router-link to="/boardRest">
              <img
                  src="https://cdn-icons-png.flaticon.com/512/3039/3039788.png"
                  class="meta_image">
            </router-link>
          </td>
        </tr>
        <tr class="intro">
          <td>메타마스크 연결</td>
          <td>기부하기</td>
        </tr>

        </tbody>
      </table>
    </div>
</template>

<style>

.meta_image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}
.about h1{
  font-family: 'Single Day';
  background-color: #42b983;
  margin: 0px;
}
.about table{
  background-color: #DAE8E4;
}
.about table .intro{
  font-family: 'Single Day';
  font-size: 30px;
}
.about table{
  width:100%; border-top:6px solid #46B6A0; border-spacing:0;
}
</style>