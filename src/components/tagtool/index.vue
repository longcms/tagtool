<template>
  <div class="tool-wrap">
    <div class="tool-info"
      :style="infoStyle">
      <div class="tool-tab-title">
        <span :class="{selected:tab===1}"
          @click="tab=1">当前标签信息</span>
        <span :class="{selected:tab===2}"
          @click="tab=2">其他标签信息</span>
      </div>
      <ul class="tool-tab-item"
        v-if="tab===1">
        <li v-for="(i,k) in items"
          @click="editTagInfo(k)"
          :key="k"
          :class="{'selected':i.selected}">
          <button v-if="i.selected"
            @click.stop="delTag"
            style="background-color:#ed4014">删除</button>
          <button v-if="i.selected"
            @click.stop="editTagInfo(k,1)">编辑</button>
          <b v-if="i.selected"></b>
          {{i.title}}
          <i v-if="i.title.length===0">未设置标记名</i>
          <p v-if="i.selected">{{i.desc}}</p>
        </li>
      </ul>
      <ul class="tool-tab-item"
        v-if="tab===2">
        <li class="detail">
          <p>指定标签，后面新画图形将沿用该标签的描述</p>
        </li>
        <li v-for="(i,k) in tagData"
          @click="setTagInfo(k)"
          :key="k"
          :class="{'selected':i.selected}">
          <b v-if="i.selected"></b>
          {{i.title}}
          <p v-if="i.selected">{{i.desc}}</p>
        </li>
      </ul>
    </div>
    <div class="tool-canvas"
      :style="canvasStyle">
      <div ref="toolCanvas"></div>
    </div>
    <div class="tool-mask"
      v-show="loading">
      <loading :message="message"></loading>
    </div>

  </div>
</template>
<script>
import './assets/css/skin.less'
import ShapeCanvas from './js/ShapeCanvas'
import loading from './loading'

export default {
  name: 'tagTool',
  props: {
    height: {
      type: Number, // 工具高度
      default: 600
    },
    tagWidth: {
      type: Number, // 标签显示宽度
      default: 300
    },
    tagData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      loading: true,
      tab: 1,
      shapes: [],
      message: '加载中...'
    }
  },
  components: {
    loading
  },
  computed: {
    infoStyle () {
      return {
        width: this.tagWidth + 'px',
        height: this.height + 'px'
      }
    },
    canvasStyle () {
      return {
        height: this.height + 'px',
        marginRight: this.tagWidth + 'px'
      }
    },
    items () {
      return this.shapes.items
    }
  },
  mounted () {
    this.initCanvas()
  },
  destroy () {
    this.sc && this.sc.destroy()
  },
  methods: {
    initCanvas () {
      this.sc = new ShapeCanvas()
      this.sc.init({
        el: this.$refs.toolCanvas, // 工具容器,未设置默认时body
        drawEnd: (data) => { // 绘制一个图形结束触发
          this.shapes = data
          this.$emit('on-data-change', data)
        },
        changeInfo: (data, item) => { // 增加了保存触发 
          this.shapes = data
          this.$emit('on-tag-change', data, item)
        },
        onSelect: (data) => {
          this.shapes = data
        },
        tagData: this.tagData,
        itemData: this.items
      })
    },
    setImage (imgURL) {
      this.loading = true
      this.sc.setImage(imgURL, () => {
        this.loading = false
      }, () => {
        this.message = '图片加载失败'
      })
    },
    setTagData (item) {
      this.shapes = item
      this.loading = true
      this.sc.setData(this.shapes, () => {
        this.loading = false
      })
    },
    getTagData () {
      if (this.sc) {
        return this.sc.getData()
      } else {
        return []
      }
    },
    editTagInfo (k, f) {
      this.sc.editInfo(k, f, this.tagData, this.items)
    },
    setTagInfo (key) {
      this.tagData.forEach((i, k) => {
        if (k === key) {
          i.selected = !i.selected
        } else {
          i.selected = false
        }
      })
      let item = this.tagData[key]
      if (item.selected) {
        this.sc.setTempinfo(item.title, item.desc)
      } else {
        this.sc.setTempinfo('', '')
      }
    },
    addTagInfo (i) {
      this.sc.info.show(i.title, i.desc)
    },
    delTag () {
      this.sc.delete()
    },
    view () {
      this.sc && this.sc.coverView()
    }
  }
}
</script>
<style lang="less" scoped>
.tool {
  &-wrap {
    width: 100%;
    position: relative;
    background: #ffffff;
  }

  &-canvas {
    position: relative;
  }

  &-info {
    position: relative;
    float: right;
    background-color: #313343;
    color: rgba(255, 255, 255, 0.6);
  }

  &-tab {
    &-title {
      position: relative;
      background-color: #000000;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      & > span {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        background-color: #000000;
        width: 50%;

        &:hover {
          opacity: 0.8;
        }

        &.selected {
          background-color: #313343;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    &-item {
      position: absolute;
      list-style: none;
      text-align: left;
      margin: 0;
      padding: 0;
      overflow-y: auto;
      top: 42px;
      width: 100%;
      bottom: 0;
      & > li {
        font-size: 14px;
        line-height: unit(40/14);
        padding: 0 10px;
        border-bottom: 1px solid #000000;
        cursor: pointer;
        & > i {
          color: rgba(255, 255, 255, 0.3);
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.45);
          color: rgba(255, 255, 255, 0.6);
        }

        &.selected {
          background-color: #000000;
          color: rgba(255, 255, 255, 0.9);

          & > b {
            display: inline-block;
            height: 10px;
            width: 4px;
            border-bottom: 2px solid green;
            border-right: 2px solid green;
            transform: rotate(45deg);
            margin-right: 5px;
          }

          button {
            float: right;
            font-size: 14px;
            width: 50px;
            border-style: solid;
            border-width: 0;
            background-color: #606060;
            border-top-width: 1px;
            border-top-color: rgba(255, 255, 255, 0.25);
            border-bottom-width: 1px;
            border-bottom-color: rgba(0, 0, 0, 0.6);
            overflow: hidden;
            padding: 2px 5px 3px 5px;
            margin-top: 8px;
            border-radius: 3px;
            color: #d5d5d5;
            -webkit-appearance: none;
            text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.45);
            transition: color 0.2s linear, background-color 0.2s linear,
              border 0.2s linear, box-shadow 0.2s linear;
            outline: 0;
            & + button {
              margin-right: 0.5em;
            }

            &:hover {
              background-color: #6a6a6a;
            }

            &:active {
              background-color: #505050;
              border-top-color: rgba(0, 0, 0, 0.6);
              border-bottom-width: 1px;
              border-bottom-color: rgba(255, 255, 255, 0.25);
            }
          }
        }

        &.detail {
          line-height: 1.5;
          color: #0dbc79;
          &:hover {
            background-color: transparent;
          }
        }
        p {
          line-height: 1;
          font-size: 12px;
          margin: 0;
          padding-left: 15px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 6px;
        }
      }
    }
  }
  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
  }
  &-more {
    width: 400px;
    height: 175px;
    position: absolute;
    left: 320px;
    top: 40px;
    background-color: #313343;
    overflow-y: auto;
    &-item {
      list-style: none;
      text-align: left;
      margin: 0;
      padding: 0;
      overflow-y: auto;
      width: 100%;
      bottom: 0;
      & > li {
        font-size: 12px;
        line-height: unit(20/12);
        padding: 0 5px;
        display: inline-block;
        border-style: solid;
        border-width: 0;
        background-color: #606060;
        border-radius: 3px;
        cursor: pointer;
        margin: 5px;
        & > span {
          color: rgba(255, 255, 255, 0.8);
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.45);
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
}
</style>
