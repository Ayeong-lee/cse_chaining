<template>
    <section class="hi-i">
        <h1 class="title">❤Chaining❤</h1>
        <p>
            블록체인 기술과 함께하는 기부문화. <br>
            새로운 기술과 함께 행복한 시간을 만끽해보세요.
        </p>
    </section>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Single+Day&display=swap');

.hi-i {
    text-align: center;
    padding-top: 10vh;
    background-image: url('../assets/vecteezy_vector-illustration-for-charity-welfare-assistance-concept_6902005.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}
.title {
    font-family: 'Dancing Script', cursive;
    font-size: 7rem;
    margin-bottom: 2rem;
}
p {
    font-family: 'Single Day';
    line-height: 1.7;
    font-size: 2rem;
    color : #ffffff;
    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.65);
    text-shadow: 2px 2px 4px rgba(255, 38, 0, 0.89);
}
section {
    color : #DB005B;
    height: 100vh;
    scroll-snap-align: start;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}
</style>
