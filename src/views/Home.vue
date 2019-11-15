<template>
  <div class="home">
    <div class="btn-group">
      <button @click="setImage">加载图片</button>
      <button @click="setTagData">加载数据</button>
      <button @click="getTagData">获取标注数据</button>
      <button @click="view">黑白图片预览</button>
    </div>
    <tag-tool ref="tool"
      @on-data-change="saveTagData"
      :tag-data="tagData"></tag-tool>
  </div>
</template>

<script>
import tagTool from '@/components/tagtool'
import demoData from './demo'
export default {
  name: 'home',
  components: {
    tagTool
  },
  data () {
    return {
      tagData: [
        {
          'title': '箭头',
          'desc': '箭头标注',
          'selected': false
        },
        {
          'title': '马',
          'desc': '动物世界马',
          'selected': false
        },
        {
          'title': '轮船',
          'desc': '世界轮船',
          'selected': false
        },
        {
          'title': '航空母舰',
          'desc': '军事图片识别',
          'selected': false
        }
      ]
    }
  },
  mounted () {
    this.$refs.tool.setImage('http://sc.68design.net/qita7/HappyChildhood/images/RTYD_1003.jpg')
  },
  methods: {
    setImage () {
      this.$refs.tool.setImage('http://sc.68design.net/qita7/HappyChildhood/images/MHTN_2002.jpg')
    },
    setTagData () {
      this.$refs.tool.setTagData(demoData)
    },
    getTagData () {
      let data = this.$refs.tool.getTagData()
      alert(JSON.stringify(data))
    },
    saveTagData (data) {
      console.log(data)
    },
    view () {
      this.$refs.tool.view()
    }
  }
}
</script>
<style lang="less">
.btn-group {
  text-align: left;
  padding-bottom: 0.5em;
  button {
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    line-height: 1.5;
    outline: 0;
    touch-action: manipulation;
    cursor: pointer;
    background-color: #313343;
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid transparent;
    user-select: none;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 3px;
    transition: color 0.2s linear, background-color 0.2s linear,
      border 0.2s linear, box-shadow 0.2s linear;
    & + button {
      margin-left: 0.5em;
    }
    &:hover {
      background-color: #000000;
    }
  }
}
</style>
