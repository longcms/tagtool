<template>
  <div id="app">
    <img :src="logo"/>
    <p>v1.1.1</p>
    <div id="nav">
      <router-link to="/">TagTool</router-link> |
      <router-link to="/about">使用说明</router-link>
    </div>
    <router-view/>
    <footer>By longcms</footer>
  </div>
</template>
<script>
import logo from '@/assets/logo.png'
export default {
  data () {
    return {
      logo
    }
  }
}
</script>
<style>
body {
  background-color: #f5f7f9;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
