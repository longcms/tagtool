<template>
  <div class="loading">
    <span></span>
    <em>{{message}}</em>
  </div>
</template>
<script>
export default {
  name: 'loading',
  props: {
    message: {
      type: [Number, String],
      default: '加载中...'
    }
  }
}
</script>
<style lang="less" scoped>
.loading {
  width: 150px;
  height: 4px;
  border-radius: 2px;
  margin: 0 auto;
  margin-top: 100px;
  position: relative;

  &>em {
    margin-top: 20px;
    display: inline-block;
  }
}
.loading span {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #313343;
  position: absolute;
  margin-top: -7px;
  margin-left: -8px;
  animation: changePosition 1.0s ease-in infinite alternate;
}
@keyframes changeBgColor {
  0% {
    background: #313343;
  }
  100% {
    background: lightblue;
  }
}
@keyframes changePosition {
  0% {
    background: #313343;
  }
  100% {
    margin-left: 150px;
    background: lightblue;
  }
}
</style>
