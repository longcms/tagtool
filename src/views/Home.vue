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
      @on-tag-change="changeTagData"
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
          title: '同类标签',
          desc: '标签的描述，补充说明',
          selected: false
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
      // 标注发生改变，触发。
      console.log(data)
    },
    changeTagData (item) {
      // 增加或者编辑标签属性，触发。
      if (item.title && item.desc) {
        let isNew = this.tagData.filter(i => {
          return i.title === item.title && i.desc === item.desc
        })
        isNew.length === 0 && this.tagData.push({
          'title': item.title,
          'desc': item.desc,
          'selected': false
        })
      }
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
