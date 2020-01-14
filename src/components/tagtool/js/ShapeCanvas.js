import pointImg from '../assets/img/point.png'
import rectImg from '../assets/img/rect.png'
import penImg from '../assets/img/pen.png'
import lassoImg from '../assets/img/lasso.png'
import polygonImg from '../assets/img/polygon2.png'
import repairImg from '../assets/img/repair.png'
import rotateImg from '../assets/img/rotate.png'
import handImg from '../assets/img/hand.png'
import zoomImg from '../assets/img/zoom.png'
import zoominImg from '../assets/img/zoomout.png'
import zoomoutImg from '../assets/img/zoomin.png'
import lassocursor from '../assets/img/cursor-lasso.png'
import pencursor from '../assets/img/cursor-pen.png'
import tagImg from '../assets/img/tag.png'
import cutImg from '../assets/img/rect2.png'

import ShapeSet from './ShapeSet'
import ShapeDraw from './ShapeDraw'
import ShapePath from './ShapePath'
import ShapeEdit from './ShapeEdit'
import ShapeColorPicker from './ShapeColorPicker'
import ShapeContextmenu from './ShapeContextmenu'
import ShapeInfo from './ShapeInfo'

function ShapeCanvas () {
  let shapeCanvas = {
    canvas: document.createElement('canvas'),
    graph: document.createElement('canvas'),
    tools: [{
      type: 'point',
      src: pointImg,
      title: '选择(S)',
      shortcut: 83
    },
    {
      type: 'rect',
      src: rectImg,
      title: '矩形标注(R)',
      shortcut: 82
    },
    {
      type: 'polygon',
      src: polygonImg,
      title: '多边形标注(G)',
      shortcut: 71
    },
    {
      type: 'lasso',
      src: lassoImg,
      title: '套索标注(L)',
      shortcut: 76
    },
    {
      type: 'repair',
      src: repairImg,
      title: '修复选择区(J)',
      shortcut: 74
    },
    {
      type: '--',
      src: ''
    },
    {
      type: 'pen',
      src: penImg,
      title: '钢笔工具(P)',
      shortcut: 80
    },
    {
      type: '--',
      src: ''
    },
    {
      type: 'rotate',
      src: rotateImg,
      title: '旋转(T)'
    },
    {
      type: 'hand',
      src: handImg,
      title: '移动(M)',
      shortcut: 77
    }, {
      type: 'zoom',
      src: zoomImg,
      title: '缩放(Z)',
      shortcut: 90,
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
      shortcut: 70
    },
    {
      type: 'bColor',
      title: '背景色(B)',
      shortcut: 66
    },
    {
      type: '--',
      src: ''
    },
    {
      type: 'tag',
      title: '标记信息(I)',
      src: tagImg,
      shortcut: 73
    },
    {
      type: 'cut',
      title: '黑白预览(V)',
      src: cutImg,
      shortcut: 86
    }
    ],
    tool: 'point',
    menu: [{
      type: 'moveBack',
      title: '移动到后面',
      shortcut: 83
    }],
    color: 'red',
    bgColor: '#FFFFFF',
    editColor: '#00A8FF',
    context: null,
    shapeSet: null,
    accuracy: 4,
    colorPicker: null,
    info: null,
    scale: 1,
    angle: 0,
    zoomScale: 1,
    keyFlag: true,
    imgSrc: '',
    drawEnd: null,
    onSelect: null,
    changeInfo: null,
    tempTitle: '',
    tempDesc: '',
    tagData: [],
    itemData: [],
    autoInfo: true,
    multipleArr: [1, 1.5, 2, 3, 4, 8, 16, 32, 64, 128, 256],
    multiple: 0,
    x:0,
    y:0,
    init (option) {
      option = option || {}
      this.el = option.el || document.body
      this.width = option.width || document.documentElement.clientWidth
      this.height = option.height || document.documentElement.clientHeight
      this.canvas.width = this.width - 38
      this.canvas.height = this.height - 30
      this.el.className = this.cn('wrap')
      this.drawEnd = option.drawEnd || function () { }
      this.onSelect = option.onSelect || function () { }
      this.changeInfo = option.changeInfo || function () { }
      this.tagData = option.tagData || []
      this.itemData = option.itemData || []
      this.autoInfo = option.autoInfo || this.autoInfo

      this.context = this.canvas.getContext('2d')
      this.wrap = this.ce('div')
      this.wrap.className = this.cn('canvas')

      this.wrap.appendChild(this.graph)
      this.wrap.appendChild(this.canvas)
      this.el.appendChild(this.wrap)
      this.toolbarInit()

      this.shapeSet = new ShapeSet()
      this.shapeSet.onChange = (v, n) => {
        this.dataChange(v, n)
      }

      this.Contextmenu = new ShapeContextmenu({
        data: [],
        cancel: () => {
          this.keyFlag = true
        },
        confirm: (t) => {
          this.keyFlag = true
          this.endSetEdit(t)
          this.shapeSet.trigger()
        }
      })
      this.Contextmenu.init()
      this.colorPicker = new ShapeColorPicker({
        el: this.el,
        color: this.color,
        cancel: () => {
          this.keyFlag = true
        },
        confirm: (t, o) => {
          this.keyFlag = true
          o === 'fColor' ? this.color = t : this.bgColor = t
          this.setToolbar()
        }
      })
      this.colorPicker.init()

      this.info = new ShapeInfo({
        el: this.el,
        cancel: () => {
          this.keyFlag = true
        },
        confirm: (t, i) => {
          this.keyFlag = true
          this.saveInfo(t, i)
        },
        more: (f) => {
          this.infoMore(f)
        }
      })
      this.info.init()

      this.canvas.addEventListener('mousedown', (e) => {
        this.mousedown(e)
      }, false)
      this.canvas.addEventListener('mousemove', (e) => {
        this.mousemove(e)
      }, false)
      this.canvas.addEventListener('mouseup', (e) => {
        this.mouseup(e)
      }, false)
      this.canvas.addEventListener('mouseout', (e) => {
        this.mouseout(e)
      }, false)
      this.canvas.addEventListener('click', (e) => {
        this.click(e)
      }, false)
      this.canvas.addEventListener('mousewheel', (e) => {
        this.mousewheel(e)
      }, false)
      this.canvas.addEventListener('DOMMouseScroll', (e) => {
        this.mousewheel(e)
      }, false)
      this.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        this.contextmenu(e)
      }, false)
      document.addEventListener('keydown', this.keydownHandle = (e) => {
        this.keyDown(e)
      }, false)
    },
    ce (tag) {
      return document.createElement(tag)
    },
    cn (name) {
      return 'll-' + name
    },
    toolbarInit () {
      this.status = this.ce('div')
      this.toolbar = this.ce('div')
      this.status.className = this.cn('status')
      this.toolbar.className = this.cn('tools')
      this.setToolbar()
      this.el.appendChild(this.status)
      this.el.appendChild(this.toolbar)
    },
    setToolbar () {
      this.toolbar.innerHTML = ''
      this.tools.forEach(item => {
        if (item.type === '--') {
          let hr = this.ce('hr')
          this.toolbar.appendChild(hr)
        } else {
          let btn = this.ce('button')
          let img = this.ce('img')

          if (item.type === 'fColor' || item.type === 'bColor') {
            img = this.ce('span')
            img.style.backgroundColor = item.type === 'fColor' ? this.color : this.bgColor
          } else {
            img.src = item.src
          }
          if (this.tool === item.type) {
            btn.className = 'selected'
          }
          btn.title = item.title
          btn.tool = item.type
          btn.addEventListener('click', (e) => {
            this.toolbarClick(e)
          }, false)
          btn.addEventListener('dblclick', (e) => {
            this.toolbarDblclick(e)
          }, false)
          btn.appendChild(img)
          this.toolbar.appendChild(btn)
        }
      })
      this.setStatus()
    },
    setStatus () {
      var t = this
      this.status.innerHTML = ''
      var e = this.tools.filter(function (e) {
        return e.type === t.tool
      })
      if (e = e.length > 0 ? e[0] : null) {
        var o = this.ce('button')
        var i = this.ce('img')
        if (i.src = e.src,
          o.title = e.title,
          o.tool = e.type,
          o.className = 'disabled',
          o.appendChild(i),
          this.status.appendChild(o),
          e.children && e.children.length > 0) {
          var s = e.children.some(function (e) {
            return t.statusType === e.type
          })
          e.children.forEach(function (e) {
            var o = t.ce('button')
            var i = t.ce('img')
            i.src = e.src,
              s ? o.className = t.statusType === e.type ? 'selected' : '' : (o.className = e.selected ? 'selected' : '',
                e.selected && (t.statusType = e.type)),
              o.title = e.title,
              o.tool = e.type,
              o.addEventListener('mousedown', function (e) {
                t.statusClick(e)
              }, !1),
              o.appendChild(i),
              t.status.appendChild(o)
          })
        }
      }
      if (this.editItem) {
        let span = t.ce('span')
        span.innerHTML = this.editItem.title.length === 0 ? '未设置标记名' : this.editItem.title
        t.status.appendChild(span)
        let em = t.ce('em')
        em.innerHTML = this.editItem.desc.length === 0 ? '' : this.editItem.desc
        t.status.appendChild(em)
      } else {
        let span = t.ce('span')
        span.innerHTML = '未选择任何标记'
        t.status.appendChild(span)
      }
    },
    toolbarClick (t) {
      // let tool = e.currentTarget.tool
      // this.tool = tool
      // this.setToolbar()
      var e = typeof t === 'string' ? t : t.currentTarget.tool;

      if (this.tool === 'cut') {
        this.shapeSet.trigger()
        if (e === 'cut') {
          e = 'point'
        }
      }

      ['fColor', 'bColor', 'rotate', 'tag'].indexOf(e) === -1 ? (this.tool = e, this.keyFlag = true,
        this.setCursor(e)) : this.keyFlag = false, this.toolhandleClick(e),
        this.setToolbar(t)
      if (this.tool === 'cut') {
        this.cut()
      }
    },
    toolbarDblclick: function (t) {
      t.currentTarget.tool === 'zoom' && (this.zoomScale = 1, this.multiple = 0,
        this.zoomSize(1))
    },
    statusClick: function (t) {
      var e = t.currentTarget.tool
      this.statusType = e,
        this.setStatus()
    },
    mousedown (e) {
      this.downX = e.offsetX
      this.downY = e.offsetY
      this.downClientX = e.clientX
      this.downClientY = e.clientY
      this.addShape('down', e)
    },
    mousemove (e) {
      this.usedX = this.moveX || 0
      this.usedY = this.moveY || 0
      this.moveX = e.offsetX
      this.moveY = e.offsetY
      this.moveClientX = e.clientX
      this.moveClientY = e.clientY
      this.addShape('move', e)
    },
    mouseup (e) {
      this.upX = e.offsetX
      this.upY = e.offsetY
      this.downClientX = e.clientX
      this.downClientY = e.clientY
      this.addShape('up', e)
    },
    mouseout (e) {
      this.outX = e.offsetX
      this.outY = e.offsetY
      this.downClientX = e.clientX
      this.downClientY = e.clientY
      this.addShape('out', e)
    },
    click (e) {
      this.clickX = e.offsetX
      this.clickY = e.offsetY
      this.addShape('click')
    },
    mousewheel: function (t) {
      var e = 0
      if (t.wheelDelta ? e = t.wheelDelta > 0 ? 1 : -1 : t.detail && (e = t.detail < 0 ? 1 : -1),
        e && this.tool === 'zoom') {
        this.canvas.style.cursor = 'default',
          this.downX = t.offsetX,
          this.downY = t.offsetY
        var o = this.zoomScale
        if(e === 1) {
          this.multiple++
          this.multiple = this.multiple > this.multipleArr.length-1 ? this.multipleArr.length-1 : this.multiple
        } else {
          this.multiple--
          this.multiple = this.multiple <0 ? 0 : this.multiple
        }
        this.zoomScale = this.multipleArr[this.multiple]
        this.zoomSize(o)
      }
    },
    keyDown: function (t) {
      var e = t.which || t.keyCode
      if (!this.keyFlag) {
        return
      }
      if (e === 90 && t.ctrlKey) {
        this.revoke()
      } else if (e === 89 && t.ctrlKey) {
        this.redo()
      } else if (e === 46) {
        this.delete()
      } else if (t.altKey) {
        var o = this.tools.filter(function (t) {
          return t.shortcut === e
        })
        o.length > 0 && this.toolbarClick(o[0].type)
      }
    },
    contextmenu: function (t) {
      this.keyFlag = true
      var e = this
      if (this.tool === 'point') {
        var o = this.shapeSet.items.slice()
        var i = []
        o.reverse().forEach(function (t, o) {
          t.contain(e.moveX, e.moveY, e.zoomScale) && i.push({
            title: '',
            item: t
          })
        }),
          i.length > 0 && this.Contextmenu.show(t, i)
      }
    },
    getTool () {
      let t = this.tools.filter(item => {
        return item.type === this.tool
      })
      if (t.length > 0) {
        return t[0]
      } else {
        return null
      }
    },
    addShape (t, e) {
      let tool = this.getTool()
      if (tool && tool.type) {
        this[tool.type] && this[tool.type](t, e)
      }
    },
    rect: function (t) {
      if (Math.abs(this.downX - this.upX) < 3 && Math.abs(this.downY - this.upY) < 3) {
        this.draw = !1
        return
      }
      if (t === 'down') {
        this.draw = !0
        this.shapeSet.item = new ShapePath({
          type: this.tool,
          color: this.color
        })
      } else if (t === 'move') {
        var _p = this.computePoint()
        !0 === this.draw && (this.shapeSet.item.rect(_p.x, _p.y, _p.tx, _p.ty),
          this.shapeSet.trigger())
      } else {
        if (!0 === this.draw) {
          var e = this.shapeSet.item
          this.shapeSet.items.push(e)
          this.shapeSet.item = null
          this.endSetEdit(e)
          this.shapeSet.addHistory()
          this.shapeSet.trigger()
        }
        this.draw = !1
      }
    },
    polygon: function (t) {
      var _p = this.computePoint()
      if (t === 'down') {
        var e, o
        this.draw = !0,
          this.shapeSet.item = this.shapeSet.item || new ShapePath({
            type: this.tool,
            color: this.color
          }),
          this.shapeSet.temp = new ShapePath({
            type: 'line',
            color: this.editColor
          })
        var i = this.shapeSet.item.children
        i.length > 0 && (o = i[i.length - 1])
        var s = new ShapePath({
          type: 'line',
          color: this.color,
          parent: this.shapeSet.item
        })
        if (i.length > 2 && (e = i[0]),
          o) {
          if (e && Math.abs(e.x - _p.x) < this.accuracy/this.zoomScale && Math.abs(e.y - _p.y) < this.accuracy/this.zoomScale) {
            s.line(o.tx, o.ty, e.x, e.y),
              this.shapeSet.item.addChild(s)
            var n = this.shapeSet.item
            n.children.shift(),
              this.shapeSet.items.push(n),
              this.shapeSet.item = null,
              this.shapeSet.temp = null,
              this.endSetEdit(n),
              this.shapeSet.addHistory(),
              this.shapeSet.trigger()
          } else {
            s.line(o.tx, o.ty, _p.x, _p.y),
              this.shapeSet.item.addChild(s),
              this.shapeSet.addHistory()
          }
        } else {
          s.line(_p.x, _p.y, _p.x, _p.y),
            this.shapeSet.item.addChild(s)
        }
        this.shapeSet.trigger()
      } else {
        t === 'move' ? this.shapeSet.temp && (this.shapeSet.temp.line(_p.x, _p.y, _p.tx, _p.ty),
          this.shapeSet.trigger()) : this.draw = !1
      }
    },
    lasso: function (t) {
      var _p = this.computePoint()
      if (t === 'down') {
        this.draw = !0,
          this.shapeSet.item = new ShapePath({
            type: this.tool,
            color: this.color
          }),
          this.shapeSet.temp = new ShapePath({
            type: 'line',
            color: this.color
          })
        var e = new ShapePath({
          type: 'line',
          color: this.color,
          parent: this.shapeSet.item
        })
        e.line(_p.x, _p.y, _p.x, _p.y),
          this.shapeSet.item.addChild(e),
          this.shapeSet.trigger(),
          this._x = this.downX,
          this._y = this.downY
      } else if (t === 'move') {
        if (this.draw) {
          if (!(Math.abs(this.moveX - this._x) > 3 || Math.abs(this.moveY - this._y) > 3)) {
            return
          }
          var o
          this._x = this.moveX,
            this._y = this.moveY
          var i = this.shapeSet.item.children
          i.length > 0 && (o = i[i.length - 1])
          var s = new ShapePath({
            type: 'line',
            color: this.color,
            parent: this.shapeSet.item
          })
          o ? (s.line(o.tx, o.ty, _p.tx, _p.ty),
            this.shapeSet.item.addChild(s)) : (s.line(_p.x, _p.y, _p.tx, _p.ty),
              this.shapeSet.item.addChild(s)),
            this.shapeSet.trigger()
        }
      } else if (t === 'up') {
        var n
        if (this.draw) {
          var h = this.shapeSet.item.children
          if (h.length > 2 && (n = h[1]),
            n) {
            var r = h[h.length - 1]
            var a = new ShapePath({
              type: 'line',
              color: this.color,
              parent: this.shapeSet.item
            })
            a.line(r.tx, r.ty, _p.ux, _p.uy),
              this.shapeSet.item.addChild(a)
            var c = new ShapePath({
              type: 'line',
              color: this.color,
              parent: this.shapeSet.item
            })
            c.line( _p.ux, _p.uy, n.x, n.y),
              this.shapeSet.item.addChild(c)
            var l = this.shapeSet.item
            l.children.shift(),
              this.shapeSet.items.push(l),
              this.shapeSet.item = null,
              this.shapeSet.temp = null,
              this.endSetEdit(l),
              this.shapeSet.addHistory(),
              this.shapeSet.trigger()
          }
        }
        this.draw = !1
      }
    },
    repair: function (t, e) {
      var _p = this.computePoint()
      if (t === 'down') {
        this.draw = !0,
          this.shapeSet.item = new ShapePath({
            type: this.tool,
            color: this.color
          }),
          this.shapeSet.temp = new ShapePath({
            type: 'line',
            color: this.color
          })
        var o = new ShapePath({
          type: 'line',
          color: this.color,
          parent: this.shapeSet.item
        })
        o.line(_p.x, _p.y, _p.x, _p.y),
          this.shapeSet.item.addChild(o),
          this.shapeSet.trigger(),
          this._x = this.downX,
          this._y = this.downY
      } else if (t === 'move') {
        if (this.draw) {
          if (!(Math.abs(this.moveX - this._x) > 3 || Math.abs(this.moveY - this._y) > 3)) {
            return
          }
          var i
          this._x = this.moveX,
            this._y = this.moveY
          var s = this.shapeSet.item.children
          s.length > 0 && (i = s[s.length - 1])
          var n = new ShapePath({
            type: 'line',
            color: this.color,
            parent: this.shapeSet.item
          })
          i ? (n.line(i.tx, i.ty, _p.tx, _p.ty),
            this.shapeSet.item.addChild(n)) : (n.line(_p.x, _p.y, _p.tx, _p.ty),
              this.shapeSet.item.addChild(n)),
            this.shapeSet.trigger()
        }
      } else if (t === 'up') {
        var h
        if (this.draw) {
          var r = this.shapeSet.item.children
          if (r.length > 2 && (h = r[1]),
            h) {
            var a = r[r.length - 1]
            var c = new ShapePath({
              type: 'line',
              color: this.color,
              parent: this.shapeSet.item
            })
            c.line(a.tx, a.ty, _p.ux, _p.uy),
              this.shapeSet.item.addChild(c)
            var l = new ShapePath({
              type: 'line',
              color: this.color,
              parent: this.shapeSet.item
            })
            l.line(_p.ux, _p.uy, h.x, h.y),
              this.shapeSet.item.addChild(l)
            var d = this.shapeSet.item
            if (d.children.shift(),
              this.editItem && (e.altKey || e.shiftKey)) {
              var A = e.shiftKey
              this.editItem.repair(d, A)
            } else {
              this.shapeSet.items.push(d),
                this.endSetEdit(d)
            }
            this.shapeSet.item = null,
              this.shapeSet.temp = null,
              this.shapeSet.addHistory(),
              this.shapeSet.trigger()
          }
        }
        this.draw = !1
      }
    },
    point: function (t, e) {
      var _p = this.computePoint()
      var o = this
      if (!(t === 'click' || e.button > 1)) {
        if (t === 'down') {
          var i = this.shapeSet.edits
          this.drawEdit = null
          Array.isArray(i) && i.forEach(function (t, e) {
            t.contain(o.moveX + o.x, o.moveY + o.y, o.zoomScale, !0) && (o.drawEdit = e)
          })
        } else if (t === 'move') {
          if (this.drawEdit | this.drawEdit === 0) {
            this.alter()
            this.shapeSet.trigger()
          } else {
            var s = this.shapeSet.items.slice()
            var n = this.shapeSet.edits
            var h = !1
            s.reverse().forEach(function (t, e) {
              t.contain(o.moveX + o.x, o.moveY + o.y, o.zoomScale) && !h ? (h = !0,
                t.over = !0) : t.over = !1
            })
            this.shapeSet.items = s.reverse()
            this.setStyle(10)
            Array.isArray(n) && n.forEach(function (t, e) {
              t.contain(o.moveX + o.x, o.moveY + o.y, o.zoomScale, !0) ? (t.over = !0,
                o.setStyle(e),console.log(t,_p)) : t.over = !1
            })
            this.shapeSet.trigger()
          }
        } else if (t === 'up') {
          if (this.drawEdit | this.drawEdit === 0) {
            this.oldItem = this.editItem.clone(),
              this.drawEdit = null
          } else {
            var r = this.shapeSet.items.slice()
            var a = !1
            this.shapeSet.edits = []
            this.editItem = null
            r.reverse().forEach(function (t, e) {
              t.contain(o.moveX + o.x, o.moveY + o.y, o.zoomScale) && !a ? (a = !0,
                o.endSetEdit(t, 1)) : (t.selected = !1, o.setStatus(), o.onSelect && o.onSelect(o.getData()))
            })
            this.shapeSet.items = r.reverse()
            this.shapeSet.trigger()
          }
        } else {
          t === 'out' && this.drawEdit | this.drawEdit === 0 && (this.oldItem = this.editItem.clone(),
            this.drawEdit = null)
        }
      }
    },
    pen: function (t) {
      var _p = this.computePoint()
      if (t === 'down') {
        var e
        this.draw = !0,
          this.shapeSet.item = this.shapeSet.item || new ShapePath({
            type: this.tool,
            color: this.color
          }),
          this.shapeSet.temp = new ShapePath({
            type: 'line',
            color: this.editColor
          })
        var o = this.shapeSet.item.children
        o.length > 0 && (e = o[o.length - 1])
        var i = new ShapePath({
          type: 'line',
          color: this.color,
          parent: this.shapeSet.item
        })
        o.length > 0 && (this.curve = !0),
          o.length > 2 && o[0],
          e ? (i.line(e.tx, e.ty, _p.x, _p.y),
            this.shapeSet.item.addChild(i)) : (i.line(_p.x, _p.y, _p.x, _p.y),
              this.shapeSet.item.addChild(i)),
          this.shapeSet.addHistory(),
          this.shapeSet.trigger()
      } else if (t === 'move') {
        if (this.curve) {
          var s = this.shapeSet.item.children
          var n = s[s.length - 1]
          var h = 2 * n.tx - _p.tx
          var r = 2 * n.ty - _p.ty
          n.curve(n.x, n.y, n.tx, n.ty, h, r),
            this.shapeSet.item.setBounds(),
            this.shapeSet.temp.line(h, r, _p.tx, _p.ty),
            this.shapeSet.trigger()
        } else {
          this.shapeSet.temp && (this.shapeSet.temp.line(_p.x, _p.y, _p.tx, _p.ty),
            this.shapeSet.trigger())
        }
      } else {
        if (this.draw && t === 'up') {
          var a
          var c
          var l = this.shapeSet.item.children
          l.length > 0 && (c = l[l.length - 1])
          var d = new ShapePath({
            type: 'line',
            color: this.color,
            parent: this.shapeSet.item
          })
          if (l.length > 0 && (this.curve = !0),
            l.length > 2 && (a = l[0]),
            c && a && Math.abs(a.x - _p.tx) < this.accuracy/this.zoomScale && Math.abs(a.y - _p.ty) < this.accuracy/this.zoomScale) {
            d.line(c.tx, c.ty, a.x, a.y),
              this.shapeSet.item.addChild(d)
            var A = this.shapeSet.item
            A.children.shift(),
              this.shapeSet.items.push(A),
              this.shapeSet.item = null,
              this.shapeSet.temp = null,
              this.endSetEdit(A),
              this.shapeSet.addHistory(),
              this.shapeSet.trigger(),
              this.curve = !1
          }
        }
        this.draw = !1,
          this.curve = !1
      }
    },
    zoom: function (t) {
      if (this.canvas.style.cursor = this.statusType === 'zoomin' ? 'zoom-in' : 'zoom-out',
        t === 'down') {
        var e = this.zoomScale
        if(this.statusType === 'zoomin') {
          this.multiple++
          this.multiple = this.multiple > this.multipleArr.length-1 ? this.multipleArr.length-1 : this.multiple
        } else {
          this.multiple--
          this.multiple = this.multiple <0 ? 0 : this.multiple
        }
        this.zoomScale = this.multipleArr[this.multiple]
        this.zoomSize(e)
      }
    },
    hand: function (t) {
      if(this.zoomScale !== 1) {
        if(t === 'down'){
          this.drag = !0
        } else if(t==='move') {
          if(this.drag){
            this.handMove()
          }
        } else if(t==='up') {
          this.drag = !1
        } else {
          this.drag = !1
        }
      }
    },
    rotate: function () {
      this.angle += 90
      this.angle = this.angle >= 360 ? 0 : this.angle
      var data = this.getData()
      var itemData = this.shapeSet.item && this.shapeSet.item.getAttr(this.scale)
      var tempData = this.shapeSet.temp && this.shapeSet.temp.getAttr(this.scale)
      var editData = this.shapeSet.edits && this.shapeSet.edits.map(item => {
        return item.getAttr(this.scale)
      })
      var editIndex 
      this.shapeSet.items.forEach((item,key) => {
        if(item.selected){
          editIndex = key
        }
      })
      this.setCanvas()

      this.shapeSet.items = []
      data.items.forEach(item => {
        let sp = new ShapePath()
        sp.setAttr(item, this.scale)
        this.shapeSet.items.push(sp)
      })
      
      itemData && (this.shapeSet.item = (new ShapePath()).setAttr(itemData, this.scale))
      tempData && (this.shapeSet.temp = (new ShapePath()).setAttr(tempData, this.scale))
      if(this.shapeSet.items[editIndex]) {
        this.endSetEdit(this.shapeSet.items[editIndex],1)
      }
     
      this.handMove()
    },
    rotateImage: function (can) {
      var e = this
      var o = can || e.img 
      var w = 0, h = 0 ,x = 0, y = 0
      var canvas, canvasContext
      switch(this.angle / 90){
        case 0 : 
          w = o.width
          h = o.height
          break
        case 1 : 
          w = o.height
          h = o.width
          x = 0
          y = -o.height
          break
        case 2 : 
          w = o.width
          h = o.height
          x = -o.width
          y = -o.height
          break
        case 3 : 
          w = o.height
          h = o.width
          x = -o.width
          y = 0
          break
      }
      canvas = document.createElement('canvas')
      canvasContext = canvas.getContext('2d')
      canvas.width = w
      canvas.height = h
      canvasContext.rotate(e.angle * Math.PI / 180)
      canvasContext.drawImage(o, x, y)
      return canvas
    },
    rotateFit: function () {
      var x=this.x, y=this.y, w = this.graph.width, h = this.graph.height
      
      var t = y 
      y = x 
      x = this.height * this.zoomScale - t - h
      
      this.x = x / this.zoomScale
      this.y = y / this.zoomScale
      this.zoomScale = 1
      this.multiple = 0
      this.usedX = this.moveX
      this.usedY = this.moveY
    },
    cut: function (t) {
      this.coverView()
    },
    fitRect: function (t, e, o, i) {
      return {
        x: Math.min(t, o),
        y: Math.min(e, i),
        width: Math.abs(o - t),
        height: Math.abs(i - e)
      }
    },
    fitPen: function (t, e, o, i, s, n, h, r) {
      return {
        x1: t,
        y1: e,
        cpx1: o,
        cpy1: i,
        cpx2: s,
        cpy2: n,
        x2: h,
        y2: r
      }
    },
    dataChange: function () {
      var t = this
      var e = this.shapeSet.items
      var o = this.shapeSet.item
      var i = this.shapeSet.temp
      var s = this.shapeSet.edits
      this.canvas.style.display = 'none'
      ShapeDraw.zoomScale = this.zoomScale
      ShapeDraw.offsetX = this.x
      ShapeDraw.offsetY = this.y
      ShapeDraw.angle = this.angle
      ShapeDraw.clear(this.context)
      e.forEach(function (e) {
        ShapeDraw.draw(t.context, e)
      })
      ShapeDraw.draw(this.context, o)
      ShapeDraw.draw(this.context, i)
      Array.isArray(s) && s.forEach(function (e) {
        ShapeDraw.draw(t.context, e)
      })
      this.canvas.style.display = ''
    },
    coverView: function () {
      var t = this
      var e = this.shapeSet.items
      this.canvas.style.display = 'none'
      ShapeDraw.zoomScale = this.zoomScale
      ShapeDraw.offsetX = this.x
      ShapeDraw.offsetY = this.y
      ShapeDraw.angle = this.angle
      ShapeDraw.clear(this.context)
      t.context.fillStyle = '#FFFFFF' // t.bgColor
      // 绘制背景
      t.context.beginPath()
      t.context.rect(0, 0, t.context.canvas.width, t.context.canvas.height)
      e.forEach(function (e) {
        ShapeDraw.draw(t.context, e, true)
      })
      t.context.fillStyle = '#FFFFFF' // t.color
      t.context.fill('evenodd')

      // 绘制前景
      t.context.beginPath()
      e.forEach(function (e) {
        ShapeDraw.draw(t.context, e, true)
      })
      t.context.fillStyle = '#000000' // t.color
      t.context.fill('evenodd')

      this.canvas.style.display = ''
    },
    setCursor: function (t) {
      var e = 'default'
      switch (t) {
        case 'hand':
          e = 'grab'
          break
        case 'rect':
        case 'polygon':
          e = 'crosshair'
          break
        case 'lasso':
          e = 'url('.concat(lassocursor, ') 8 21,auto')
          break
        case 'pen':
          e = 'url('.concat(pencursor, ') 1 22,auto')
      }
      this.canvas.style.cursor = e
    },
    setStyle: function (t) {
      var e = {
        0: 'nw-resize',
        1: 'n-resize',
        2: 'ne-resize',
        3: 'w-resize',
        4: 'e-resize',
        5: 'sw-resize',
        6: 's-resize',
        7: 'se-resize',
        8: 'crosshair',
        9: 'pointer',
        10: 'default'
      }
      var o = this.editItem && this.editItem.type
      if (o) {
        var i = t
        this.angle !== 90 && this.angle !== 270 || (i = t === 0 || t === 1 || t === 4 || t === 5 ? t + 2 : t - 2),
          this.canvas.style.cursor = o === 'rect' ? e[i] : e[10]
      } else {
        this.canvas.style.cursor = e[t]
      }
    },
    alter: function () {
      this.shapeSet.edits = ShapeEdit.alter({
        edits: this.shapeSet.edits,
        item: this.editItem,
        oldItem: this.oldItem,
        index: this.drawEdit,
        moveX: this.moveX,
        moveY: this.moveY,
        downX: this.downX,
        downY: this.downY,
        upX: this.upX,
        upY: this.upY,
        zoomScale: this.zoomScale,
        x: this.x,
        y: this.y
      })
    },
    toolhandleClick: function (t) {
      switch (t) {
        case 'fColor':
          this.colorPicker.show(this.color, t)
          break
        case 'bColor':
          this.colorPicker.show(this.bgColor, t)
          break
        case 'rotate':
          this.rotate()
          break
        case 'tag':
          this.setInfo()
          break
      }
    },
    computeSize: function () {
      // this.canvas.width = this.width
      // this.canvas.height = this.height
      // this.graph.width = this.width
      // this.graph.height = this.height
      this.canvas.width = this.wrap.offsetWidth
      this.canvas.height = this.wrap.offsetHeight
      this.graph.width = this.wrap.offsetWidth
      this.graph.height = this.wrap.offsetHeight
    },
    computePoint: function () {
      var x,y,tx,ty,ux,uy
      x = this.downX / this.zoomScale + this.x / this.zoomScale
      y = this.downY / this.zoomScale + this.y / this.zoomScale
      tx = this.moveX / this.zoomScale + this.x / this.zoomScale
      ty = this.moveY / this.zoomScale + this.y / this.zoomScale
      ux = this.upX / this.zoomScale + this.x / this.zoomScale
      uy = this.upY / this.zoomScale + this.y / this.zoomScale
      return {
        x,
        y,
        tx,
        ty,
        ux,
        uy
      }
    },
    setImage: function (src, fun, fail) {
      var e = this
      var o = new Image()
      o.onload = function () {
        e.img = o
        var t = ShapeDraw.fitSize(o.width, o.height, e.wrap.offsetWidth, e.wrap.offsetHeight)
        e.width = t.w
        e.height = t.h
        e.scale = t.w / o.width
        e.computeSize()
        e.graph.getContext('2d').drawImage(o, 0, 0, o.width, o.height, 0, 0, t.w, t.h)
        e.imgSrc = src

        e.editItem = null
        e.shapeSet.items = []
        e.shapeSet.item = null
        e.shapeSet.temp = null
        e.shapeSet.edits = null
        e.setStatus()

        fun && fun()
        e.zoomScale = 1
        e.multiple = 0
        e.angle = 0
        e.setCanvas()
        e.zoomSize(1)
        
      }
      o.onerror = function () {
        fail && fail()
      }
      o.src = src
    },
    zoomSize: function (t) {
      this.zoomScale <= 1 && (this.zoomScale = 1)
      var e = this.downX || 0
      var o = this.downY || 0
      var i = this.width * this.zoomScale
      var s = this.height * this.zoomScale
      
      var d = this.graph.getContext('2d')
      var A = this.img
      this.graph.style.display = 'none'

      var _x,_y,_w,_h,_ox,_oy
      var vW = this.angle / 90 % 2 === 1 ? this.wrap.offsetHeight : this.wrap.offsetWidth
      var vH = this.angle / 90 % 2 === 1 ? this.wrap.offsetWidth : this.wrap.offsetHeight
      _ox = this.x
      _oy = this.y
      _x = (e + _ox)/t * this.zoomScale - e 
      _y = (o + _oy)/t * this.zoomScale - o
      
      _x = _x < 0 ? 0 : _x
      _y = _y < 0 ? 0 : _y
      _w = i -_x - vW > 0 ? vW : i-_x
      _h = s -_y - vH > 0 ? vH : s-_y
      
      _w = _w < this.width ? (_x = i-this.width, this.width) : _w
      _h = _h < this.height ? (_y = s-this.height, this.height)  : _h

      var _mx = A.width * _x / i
      var _my = A.height * _y / s
      var _mw = A.width * _w / i
      var _mh = A.height * _h / s
      // this.graph.width = _w
      // this.graph.height = _h
      // this.canvas.width = _w
      // this.canvas.height = _h
      this.x = _x
      this.y = _y
      d.clearRect(0, 0, this.graph.width, this.graph.height)
      d.drawImage(A, _mx, _my, _mw, _mh, 0, 0, _w, _h)
      this.graph.style.display = ''
      this.dataChange()
      // this.setCanvas()
    },
    handMove: function () {
      var t = this.moveX - this.usedX
      var e = this.moveY - this.usedY

      var i = this.width * this.zoomScale
      var s = this.height * this.zoomScale
      
      var d = this.graph.getContext('2d')
      var A = this.img
      this.graph.style.display = 'none'

      var _x,_y,_w,_h,_ox,_oy
      var vW = this.angle / 90 % 2 === 1 ? this.wrap.offsetHeight : this.wrap.offsetWidth
      var vH = this.angle / 90 % 2 === 1 ? this.wrap.offsetWidth : this.wrap.offsetHeight
      _ox = this.x
      _oy = this.y
      _x = _ox - t
      _y = _oy - e
      _x = _x < 0 ? 0 : _x
      _y = _y < 0 ? 0 : _y
      _w = i -_x - vW > 0 ? vW : i-_x
      _h = s -_y - vH > 0 ? vH : s-_y
      _w = _w < this.width ? (_x = i-this.width, this.width) : _w
      _h = _h < this.height ? (_y = s-this.height, this.height)  : _h

      var _mx = A.width * _x / i
      var _my = A.height * _y / s
      var _mw = A.width * _w / i
      var _mh = A.height * _h / s
      // this.graph.width = _w
      // this.graph.height = _h
      // this.canvas.width = _w
      // this.canvas.height = _h
      this.x = _x
      this.y = _y
      d.clearRect(0, 0, this.graph.width, this.graph.height)
      d.drawImage(A, _mx, _my, _mw, _mh, 0, 0, _w, _h)

      // d.drawImage(A, 0, 0, A.width, A.height, 0, 0, i, s)
      this.graph.style.display = ''
      this.dataChange()

    },
    endSetEdit: function (t, flag) {
      ShapeEdit.shape && (ShapeEdit.shape.selected = !1)
      this.shapeSet.edits = ShapeEdit.setEdit(t)
      this.editItem = t
      this.oldItem = t.clone()
      t.selected = !0
      this.setStatus()
      
      if (!flag && this.autoInfo) {
        t.title = this.tempTitle
        t.desc = this.tempDesc
        this.drawEnd && this.drawEnd(this.getData())
        this.setInfo()
      } else {
        if(this.tempTitle.length>0){
          this.saveInfo(this.tempTitle, this.tempDesc)
        }
      }
      this.onSelect && this.onSelect(this.getData())
    },
    setCanvas: function () {
      var t = ''
      
      // var e = 1
      // this.width > this.height && this.angle / 90 % 2 === 1 && (e = this.wrap.offsetHeight / this.wrap.offsetWidth)
      // t += ' scale(' + e + ')'
      var angle = this.angle / 90 % 2  === 1, wW = this.wrap.offsetWidth, wH = this.wrap.offsetHeight
      this.canvas.width = angle ? wH : wW
      this.canvas.height = angle ? wW : wH
      this.graph.width = angle ? wH : wW
      this.graph.height = angle ? wW : wH
      var top = (wH-wW) / 2
      var left = -(wH-wW) / 2
      if(angle){
        t += ' translate3d('+left+'px, '+top+'px, 0)'
      }
      t += ' rotateZ(' + this.angle + 'deg)'

      this.canvas.style.transform = t
      this.graph.style.transform = t

      var o = this.img
      var t = ShapeDraw.fitSize(o.width, o.height, this.canvas.width, this.canvas.height)
      this.width = t.w
      this.height = t.h
      this.scale = t.w / o.width
      // this.wrap.style.transform = t
    },
    revoke: function () {
      this.shapeSet.revoke()
    },
    redo: function () {
      this.shapeSet.redo()
    },
    setInfo (tagData, itemData) {
      this.tagData = tagData || this.tagData
      this.itemData = itemData || this.itemData
      if (this.editItem) {
        let t = this.editItem.title
        let i = this.editItem.desc
        let eh = this.editItem
        let x = 0
        let y = 0
        if (eh.type === 'rect') {
          x = eh.x
          y = eh.y
        } else {
          if (eh.children.length > 0) {
            x = eh.children[0].x
            y = eh.children[0].y
          }
        }
        let el = this.wrap
        if (el) {
          x += el.offsetLeft
          y += el.offsetTop
        }
        this.info.show(t, i, {
          x: x,
          y: y,
          w: el.offsetWidth,
          h: el.offsetHeight,
          d1: this.tagData,
          d2: this.itemData
        })
      } else {
        this.keyFlag = true
      }
    },
    saveInfo (t, i) {
      this.editItem.title = t
      this.editItem.desc = i
      this.setStatus()
      this.changeInfo && this.changeInfo(this.getData(), this.editItem.getAttr(this.scale))
      // this.drawEnd && this.drawEnd(this.getData())
    },
    editInfo (k, f, tagData, itemData) {
      let shape = this.shapeSet.items[k]
      this.endSetEdit(shape, true)
      if (f) { this.setInfo(tagData, itemData) }
      this.shapeSet.trigger()
    },
    infoMore (f) {
      this.moreInfo && this.moreInfo(f)
    },
    setData (data, cb) {
      this.imgSrc = data.imgSrc
      this.bgColor = data.bgColor
      this.setImage(data.imgSrc, () => {
        this.shapeSet.items = []
        data.items.forEach(item => {
          let sp = new ShapePath()
          sp.setAttr(item, this.scale)
          this.shapeSet.items.push(sp)
        })
        this.shapeSet.addHistory()
        this.shapeSet.trigger()
        cb && cb()
      })
    },
    getData () {
      let reData = {}
      reData.imgSrc = this.imgSrc
      reData.bgColor = this.bgColor
      reData.items = this.shapeSet.getData(this.scale)
      return reData
    },
    destroy () {
      document.removeEventListener('keydown', this.keydownHandle, false)
    },
    delete () {
      this.shapeSet.delete()
      this.info.hide()
      this.onSelect && this.onSelect(this.getData())
    },
    setTempinfo (t, d) {
      this.tempTitle = t
      this.tempDesc = d
    }
  }

  return shapeCanvas
}

export default ShapeCanvas
