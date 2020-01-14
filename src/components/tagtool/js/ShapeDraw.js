const ShapeDraw = {
  lineWidth: 1,
  pixelComp: 0.5,
  zoomScale: 1,
  rule: 'evenodd',
  offsetX: 0,
  offsetY: 0,
  angle: 0,
  draw: function (t, e, o) {
    e && this[e.type] && this[e.type](t, e, o)
  },
  clear: function (t) {
    t.clearRect(0, 0, t.canvas.width, t.canvas.height)
  },
  arc: function (t, e) {
    if (e && t) {
      t.beginPath()
      t.lineWidth = this.lineWidth
      var o = e.r
      e.handle && e.over && o++
      var i = 0
      t.lineWidth % 2 === 1 && (i = this.pixelComp)
      var s = Math.round(e.x * this.zoomScale) - i
      var n = Math.round(e.y * this.zoomScale) - i
      t.arc(s-this.offsetX, n-this.offsetY, o, 0, 2 * Math.PI)
      var h = e.over ? e.overColor : e.color
      h = e.selected ? e.selectedColor : h
      if (e.fill) {
        t.fillStyle = h
        t.fill()
      }
      t.strokeStyle = h
      t.stroke()
    }
  },
  rect: function (t, e, x) {
    if (e && t) {
      if (!x) {
        t.beginPath()
      }
      t.lineWidth = this.lineWidth
      var o = 0
      t.lineWidth % 2 === 1 && (o = this.pixelComp)
      e.handle && e.over && (t.lineWidth = this.lineWidth + 2)
      var i = Math.round(Math.round(e.x) * this.zoomScale-this.offsetX) - o
      var s = Math.round(Math.round(e.y) * this.zoomScale-this.offsetY) - o
      var n = Math.round(e.width * this.zoomScale)
      var h = Math.round(e.height * this.zoomScale)
      if (e.edit) {
        i = Math.round(Math.round(e.x) * this.zoomScale + e.width * (this.zoomScale - 1) / 2-this.offsetX) - o
        s = Math.round(Math.round(e.y) * this.zoomScale + e.height * (this.zoomScale - 1) / 2-this.offsetY) - o
        n = Math.round(e.width)
        h = Math.round(e.height)
      }
      t.rect(i, s, n, h)
      var r = e.over ? e.overColor : e.color
      r = e.selected ? e.selectedColor : r
      if (e.fill) {
        t.fillStyle = r
        t.fill()
      }
      t.strokeStyle = r
      if (!x) {
        t.stroke()
      }
    }
  },
  line: function (t, e, o) {
    if (e && t) {
      t.lineWidth = this.lineWidth
      var i = 0
      t.lineWidth % 2 === 1 && (i = this.pixelComp)
      var s = Math.round(Math.round(e.x) * this.zoomScale - this.offsetX) - i 
      var n = Math.round(Math.round(e.y) * this.zoomScale - this.offsetY) - i
      var h = Math.round(Math.round(e.tx) * this.zoomScale - this.offsetX) - i
      var r = Math.round(Math.round(e.ty) * this.zoomScale - this.offsetY) - i
      if (o) {

      } else {
        t.beginPath()
        t.moveTo(s, n)
      }
      t.lineTo(h, r)
      o || t.stroke()
    }
  },
  curve: function (t, e, o) {
    if (e && t) {
      t.lineWidth = this.lineWidth
      var i = 0
      t.lineWidth % 2 === 1 && (i = this.pixelComp)
      var s = Math.round(Math.round(e.x) * this.zoomScale - this.offsetX) - i
      var n = Math.round(Math.round(e.y) * this.zoomScale - this.offsetY) - i
      var h = Math.round(Math.round(e.cx) * this.zoomScale - this.offsetX) - i
      var r = Math.round(Math.round(e.cy) * this.zoomScale - this.offsetY) - i
      var a = Math.round(Math.round(e.tx) * this.zoomScale - this.offsetX) - i
      var c = Math.round(Math.round(e.ty) * this.zoomScale - this.offsetY) - i
      if (o) {

      } else {
        t.beginPath()
        t.moveTo(s, n)
      }
      t.quadraticCurveTo(h, r, a, c)
      o || t.stroke()
    }
  },
  polygon: function (t, e, x) {
    var o = this
    if (e && t && e.children.length > 0) {
      if (!x) {
        t.beginPath()
      }
      var i = e.over ? e.overColor : e.color
      i = e.selected ? e.selectedColor : i
      t.strokeStyle = i
      t.lineWidth = this.lineWidth
      var s = 0
      t.lineWidth % 2 === 1 && (s = this.pixelComp)
      e.children.forEach(function (e, i) {
        if (i === 0) {
          var n = Math.round(e.x * o.zoomScale) - s - o.offsetX
          var h = Math.round(e.y * o.zoomScale) - s - o.offsetY
          t.moveTo(n, h)
        }
        o.draw(t, e, !0)
      })
      // t.closePath()
      if (!x) {
        t.stroke()
      }
      if (e.children.length > 0 && e.fill) {
        t.fillStyle = i
        t.fill()
      }
    }
  },
  lasso: function (t, e, x) {
    this.polygon(t, e, x)
  },
  repair: function (t, e, x) {
    this.polygon(t, e, x)
  },
  pen: function (t, e, x) {
    t.lineCap = 'square'
    this.polygon(t, e, x)
  },
  isPointInPath: function (t, e) {
    console.time('isPointInPath')
    var o = document.createElement('canvas')
    o.width = 1
    o.height = 1
    var i = o.getContext('2d')
    this.draw(i, t)
    var s = i.isPointInPath(e.x, e.y)
    o = null
    i = null
    console.timeEnd('isPointInPath')
    return s
  },
  fitSize: function (t, e, o, i) {
    var s = {
      w: 0,
      h: 0
    }
    return t <= o && e <= i ? (s.w = t,
    s.h = e) : t / e < o / i ? (s.h = Math.min(e, i),
    s.w = t * s.h / e) : (s.w = Math.min(t, o),
    s.h = e * s.w / t),
    s
  }
}

export default ShapeDraw
