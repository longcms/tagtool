<template>
  <div class="help">
    <dl>
      <dt>1、工具界面</dt>
      <dd><img src="@/assets/toolbox.jpg"
          alt=""></dd>
    </dl>
    <dl>
      <dt>2、工具说明</dt>
      <dd>
        <p>鼠标放到工具栏上对应工具的图标，会有气泡提示，其中括号中的字母就是对应的快捷键，【 例如：选择(S)，对应的快捷键 s 】</p>
      </dd>
      <dd>
        <template v-for="(i,k) in tools">
          <p :key="i.type+'d'+k"
            v-if="i.type!='--'">
            <span class="help-icon"><img :src="i.src"
                v-if="i.src" /></span>
            <b>{{i.title}}</b>{{i.desc}}
          </p>
          <p :key="i.type+'p'+k"><img :src="i.pimg"
              v-if="i.pimg" /></p>
        </template>
      </dd>
    </dl>
    <dl>
      <dt>3、组件引入</dt>
      <dd>
        <p>
          <pre>{{importStr}}</pre>
        </p>
        <p>
          属性：<table>
          <thead>
            <tr>
              <th>属性名/th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>height</td>
              <td>工具的高度</td>
              <td>Number</td>
              <td>600</td>
            </tr>
            <tr>
              <td>tagWidth</td>
              <td>标签显示宽度</td>
              <td>Number</td>
              <td>300</td>
            </tr>
            <tr>
              <td>tagData</td>
              <td>类别标签</td>
              <td>Array</td>
              <td>[]</td>
            </tr>
          </tbody>
        </table></p>
        <p>事件：
          <table>
          <thead>
            <tr>
              <th>事件名</th>
              <th>说明</th>
              <th>参数</th>
              <th>值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>on-data-change</td>
              <td>页面标注发生改变的时候</td>
              <td>data</td>
              <td>标注对象数据</td>
            </tr>
            <tr>
              <td>on-tag-change</td>
              <td>编辑标注说明点击确定时候触发</td>
              <td>data, item</td>
              <td>标注对象数据，当前编辑对象数据</td>
            </tr>
          </tbody>
        </table></p>
      </dd>
    </dl>
    <dl>
      <dt>4、数据说明</dt>
      <dd>
        <pre readonly>
{
  "imgSrc": "http://pic11.nipic.com/20101217/3971381_164521900437_2.jpg", // 被标注图片URL
  "bgColor": "#FFFFFF", // 背景颜色
  "items": [{ // 标注形状数组
    "title": "常放心", // 标注标题
    "desc": "检测标注", // 标注描述
    "type": "rect",
    /**
     * 标注形状类型：rect=矩形，polygon=多边形，lasso=套索，repair=修复，pen=钢笔，line=线段，curve=曲线
     * 其中基础形状是 rect、line、curve，其他type都是由基础形状组合而来
     * type=rect 矩形时候，x,y为矩形的起始点坐标，width,height为矩形的宽度和高度
     * type=line 线段，新，x,y为线段的起始点坐标，tx,ty为线段的结束点坐标
     * type=curve 二次贝塞尔曲线，新，x,y为曲线的起始点坐标，tx,ty为曲线的结束点坐标，程序，cx,cy为控制点坐标
     */
    "color": "red", // 颜色
    "children": [], // 子形状组，一般line和curve居多
    "x": 125, // 起点x坐标
    "y": 83, // 起点y坐标
    "cx": 0, // 控制点1 x坐标
    "cy": 0, // 控制点1 y坐标
    "cx2": 0, // 控制点2 x坐标
    "cy2": 0, // 控制点2 y坐标
    "tx": 0, // 结束点x坐标
    "ty": 0, // 结束点y坐标
    "width": 131, // 宽度
    "height": 89, // 高度
    "r": 0, // 圆形的半径
    "fill": false // 是否填充
  }]
}
          </pre>
      </dd>
    </dl>

  </div>
</template>
<script>
import pointImg from './assets/img/point.png'
import rectImg from './assets/img/rect.png'
import penImg from './assets/img/pen.png'
import lassoImg from './assets/img/lasso.png'
import polygonImg from './assets/img/polygon2.png'
import repairImg from './assets/img/repair.png'
import rotateImg from './assets/img/rotate.png'
import handImg from './assets/img/hand.png'
import zoomImg from './assets/img/zoom.png'
import zoominImg from './assets/img/zoomout.png'
import zoomoutImg from './assets/img/zoomin.png'
import tagImg from './assets/img/tag.png'
import fcolorImg from './assets/img/fcolor.png'
import bcolorImg from './assets/img/bcolor.png'
import cutImg from './assets/img/rect2.png'
import fullImg from './assets/img/fullscreen.png'

import taginfoImg from '@/assets/taginfo.png'
import colorImg from '@/assets/color.png'
import vpointImg from '@/assets/point.gif'
import vrectImg from '@/assets/rect.gif'
import vpolygonImg from '@/assets/polygon.gif'
import vlassoImg from '@/assets/lasso.gif'
import vrepairImg from '@/assets/repair.gif'
import vpenImg from '@/assets/pen.gif'

export default {
  name: 'help',
  data () {
    return {
      importStr: '<tag-tool ref="tool" @on-data-change="saveTagData" :tag-data="tagData"></tag-tool>',
      tools: [{
        type: 'point',
        src: pointImg,
        title: '选择(S)',
        shortcut: 83,
        desc: '选择工具，选择已经绘制好的形状，点击选中，该形状就进入编辑模式。在编辑模式中鼠标放到各个控制点，控制点变大，按下拖动就可以改变已经画好的形状。',
        pimg: vpointImg
      },
      {
        type: 'rect',
        src: rectImg,
        title: '矩形标注(R)',
        shortcut: 82,
        desc: '绘制矩形的工具,编辑模式会出现8个控制点，通过控制点可以改变矩形大小。',
        pimg: vrectImg
      },
      {
        type: 'polygon',
        src: polygonImg,
        title: '多边形标注(G)',
        shortcut: 71,
        desc: '绘制多边形工具，编辑模式各个顶点变成控制点，通过控制点可以改变多边形形状。',
        pimg: vpolygonImg
      },
      {
        type: 'lasso',
        src: lassoImg,
        title: '套索标注(L)',
        shortcut: 76,
        desc: '套索工具，操作要点：按下鼠标左键直到绘制出自己想要的形状，松开鼠标左键即可。',
        pimg: vlassoImg
      },
      {
        type: 'repair',
        src: repairImg,
        title: '修复选择区(J)',
        shortcut: 74,
        desc: '使用方法和套索工具一样，该工具配合按键 alt 或者 shift 可以缩小和扩大用套索工具或修复工具绘制的形状。',
        pimg: vrepairImg
      },
      {
        type: '--',
        src: ''
      },
      {
        type: 'pen',
        src: penImg,
        title: '钢笔工具(P)',
        shortcut: 80,
        desc: '钢笔工具同其他绘图软件中的钢笔工具的简化版，可以画多边形，也可以画曲边多边形。操作要点：和多边形工具一样，绘制边线的时候结束点按住不放就会增加一个曲线的控制点，移动可以改变曲线的弯曲度和长度。得到的曲线是贝塞尔二次曲线。',
        pimg: vpenImg
      },
      {
        type: '--',
        src: ''
      },
      {
        type: 'rotate',
        src: rotateImg,
        title: '旋转(T)',
        desc: '辅助工具，顺时针方向，每次旋转角度90度。'
      },
      {
        type: 'hand',
        src: handImg,
        title: '移动(H)',
        shortcut: 72,
        desc: '被标注图在放大的模式下，被挡住的部分可以通过该移动工具移动到可视化区域中。'
      }, {
        type: 'zoom',
        src: zoomImg,
        title: '缩放(Z)',
        shortcut: 90,
        desc: '放大被标注图片，方便标注细节。双击该工具缩放恢复最初状态。',
        children: [{
          type: 'zoomin',
          title: '放大',
          src: zoominImg,
          selected: !0
        }, {
          type: 'zoomout',
          title: '缩小',
          src: zoomoutImg
        }]
      },
      {
        type: '--',
        src: ''
      },
      {
        type: 'fColor',
        title: '前景色(F)',
        src: fcolorImg,
        shortcut: 70,
        desc: '设置前景色颜色',
        pimg: colorImg
      },
      {
        type: 'bColor',
        title: '背景色(B)',
        src: bcolorImg,
        shortcut: 66,
        desc: '设置背景色颜色',
        pimg: colorImg
      },
      {
        type: '--',
        src: ''
      },
      {
        type: 'tag',
        title: '标记信息(I)',
        src: tagImg,
        shortcut: 73,
        desc: '为标注的图片增加标注说明,ctrl+s 确定保存，ctrl+x取消',
        pimg: taginfoImg
      },
      {
        type: 'cut',
        title: '黑白预览(V)',
        src: cutImg,
        shortcut: 86,
        desc: '黑白预览'
      },
      {
        type: 'full',
        title: '全屏(Q)',
        src: fullImg,
        shortcut: 81,
        desc: '全屏按钮'
      }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.help {
  text-align: left;
  width: 1264px;
  margin: 0 auto;
  font-size: 16px;

  dl,
  dt,
  dd {
    margin: 0;
    padding: 0;
  }

  dl {
    & > dt {
      line-height: unit(40/16);
    }
    & > dd {
      line-height: unit(32/16);
      p {
        text-align: justify;
        & > b {
          margin-right: 1em;
        }
      }

      pre {
        background: #1e1e1e;
        width: 100%;
        font-family: Arial, Helvetica, sans-serif;
        color: #9cdcda;
        overflow: hidden;
        border: 0;
        padding: 10px;
        -webkit-appearance: none;
        font-size: 14px;
      }

      table {
        font-family: Consolas, Menlo, Courier, monospace;
        font-size: 14px;
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
        border: 1px solid #e9e9e9;
        width: 100%;
        margin-bottom: 24px;

        th,td {
          border: 1px solid #e9e9e9;
          padding: 8px 16px;
          text-align: left;
        }

        th {
          background: #f7f7f7;
          white-space: nowrap;
          color: #5c6b77;
          font-weight: 600;
        }
      }
    }
  }

  img {
    max-width: 1264px;
  }

  &-icon {
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.9);
    position: relative;
    border-radius: 3px;
    margin: 2px 8px 1px 3px;
    padding: 4px 4px;
    border: 0;
    outline: 0;
    line-height: 1;

    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      opacity: 0.75;
      filter: drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.45));
    }
  }
}
</style>
