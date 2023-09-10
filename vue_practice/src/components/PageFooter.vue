<template>
    <hr/>
    <footer>
      <ul class="footer-nav">
        <li><a href="https://twitter.com/">Twitter</a></li>
        <li><a href="https://facebook.com/">Facebook</a></li>
        <li><a href="https://youtube.com/">YouTube</a></li>
        <li><a href="https://instagram.com/">Instagram</a></li>
      </ul>
      <p><small>&copy; 2023 Pnu cse</small></p>
    </footer>
</template>

<script>
export default {
    name: "PageFooter"
}
</script>

<style scoped>
hr {
  max-height: 10px;
  margin: 0px 0px 0px;
  padding: 5px;
  background-color: #af9f8f;
}
footer {
  background: #949087;
  text-align: center;
  padding: 3rem;
  color: #949087;
  font-family: sans-serif;
}
footer ul {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
footer li {
  margin: 0 12px;
}
footer a {
  color: #fff;
}
footer a:hover {
  color: #c7c3ba;
}
footer small {
  color: #c7c3ba;
  font-size: .875rem;
}

.meta_image {
  width: 30px;
  height: 30px;
  object-fit: cover;
}
</style>