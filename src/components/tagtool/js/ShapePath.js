import {
  isRegExp
} from 'util'

const ShapePath = function (e) {
  var o = {
    title: '',
    desc: '',
    type: (e = e || {}).type || '',
    color: e.color || '',
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    cx2: 0,
    cy2: 0,
    tx: 0,
    ty: 0,
    width: 0,
    height: 0,
    r: 0,
    selected: e.selected || !1,
    selectedColor: '#00A8FF',
    over: !1,
    overColor: '#00A8FF',
    handle: e.handle || !1,
    parent: e.parent || null,
    fill: e.fill || !1,
    bindIndex: e.bindIndex || 0,
    edit: e.edit || !1,
    children: [],
    bounds: {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    },
    setBounds: function (t, e, o, i) {
      arguments.length === 0 ? this[this.type + 'BoundsCompute'] && this[this.type + 'BoundsCompute']() : (this.bounds.minX = t,
      this.bounds.minY = e,
      this.bounds.maxX = o,
      this.bounds.maxY = i)
    },
    clone: function (e) {
      if (void 0 === e && (e = this),
      typeof (e) !== 'object') {
        return e
      }
      var o = new ShapePath()
      for (var i in Array.isArray(e) && (o = []),
      e)
        {i !== 'parent' && e.hasOwnProperty(i) && (o[i] = this.clone(e[i]))}
      return o
    },
    rect: function (t, e, o, i) {
      this.x = Math.round(Math.min(t, o)),
      this.y = Math.round(Math.min(e, i)),
      this.width = Math.round(Math.abs(o - t)),
      this.height = Math.round(Math.abs(i - e)),
      this.setBounds(this.x, this.y, this.x + this.width, this.y + this.height)
    },
    arc: function (t, e, o) {
      this.x = Math.round(t),
      this.y = Math.round(e),
      this.r = Math.round(o),
      this.setBounds()
    },
    line: function (t, e, o, i) {
      this.x = Math.round(t),
      this.y = Math.round(e),
      this.tx = Math.round(o),
      this.ty = Math.round(i)
      // this.parent && this.parent.setBounds()
    },
    curve: function (t, e, o, i, s, n) {
      this.type = 'curve',
      this.x = Math.round(t),
      this.y = Math.round(e),
      this.cx = Math.round(s),
      this.cy = Math.round(n),
      this.tx = Math.round(o),
      this.ty = Math.round(i)
      // this.parent && this.parent.setBounds()
    },
    polygon: function () {
      this.setBounds()
    },
    addChild: function (t) {
      this.children.push(t),
      this.setBounds()
    },
    insertChild: function (t) {
      this.children.push(t),
      this.setBounds()
    },
    polygonBoundsCompute: function () {
      var t = []
      var e = []
      this.children.forEach(function (o) {
        t.push(o.tx),
        e.push(o.ty)
      })
      var o = Math.min.apply(null, t)
      var i = Math.min.apply(null, e)
      var s = Math.max.apply(null, t)
      var n = Math.max.apply(null, e)
      this.setBounds(o, i, s, n)
    },
    lassoBoundsCompute: function () {
      this.polygonBoundsCompute()
    },
    repairBoundsCompute: function () {
      this.polygonBoundsCompute()
    },
    penBoundsCompute: function () {
      var t = []
      var e = []
      this.children.forEach(function (i) {
        i.type === 'curve' ? o.curveToPoints(i).forEach(function (o) {
          t.push(o.x),
          e.push(o.y)
        }) : (t.push(i.tx),
        e.push(i.ty))
      })
      var i = Math.min.apply(null, t)
      var s = Math.min.apply(null, e)
      var n = Math.max.apply(null, t)
      var h = Math.max.apply(null, e)
      this.setBounds(i, s, n, h)
    },
    contain: function (t, e, o, ed) {
      o = o || 1
      var i = !1
      if (this.type === 'arc') {
        i = Math.sqrt(Math.pow(this.x * o - t, 2) + Math.pow(this.y * o - e, 2)) <= this.r
      } else {
        var s = this.bounds.minX * o
        var n = this.bounds.minY * o
        var h = this.bounds.maxX * o
        var r = this.bounds.maxY * o
        if (ed) {
          s = (s+h)/2 -2
          n = (n+r)/2 -2
          h = s + 4
          r = n + 4
        }
        t >= s && t <= h && e >= n && e <= r && (i = !0,
        this.type !== 'polygon' && this.type !== 'lasso' && this.type !== 'repair' && this.type !== 'pen' || (i = this.inPolygon(t, e, o)))
      }
      return i
    },
    inPolygon: function (t, e, i) {
      var s = t
      var n = e
      var h = []
      this.children.forEach(function (t) {
        t.type === 'curve' ? o.curveToPoints(t).forEach(function (t) {
          h.push({
            x: t.x * i,
            y: t.y * i
          })
        }) : h.push({
          x: t.x * i,
          y: t.y * i
        })
      }),
      h.push({
        x: this.children[0].x * i,
        y: this.children[0].y * i
      })
      for (var r = !1, a = -1, c = h.length, l = c - 1; ++a < c; l = a) {
        (h[a].y <= n && n < h[l].y || h[l].y <= n && n < h[a].y) && s < (h[l].x - h[a].x) * (n - h[a].y) / (h[l].y - h[a].y) + h[a].x && (r = !r)
      }
      return r
    },
    intersect: function (t, e, o, i) {
      var s = []
      var n = (i.x - o.x) * (t.y - o.y) - (i.y - o.y) * (t.x - o.x)
      var h = (e.x - t.x) * (t.y - o.y) - (e.y - t.y) * (t.x - o.x)
      var r = (i.y - o.y) * (e.x - t.x) - (i.x - o.x) * (e.y - t.y)
      if (r != 0) {
        var a = n / r
        var c = h / r
        a >= 0 && a <= 1 && c >= 0 && c <= 1 ? s.push({
          x: t.x + a * (e.x - t.x),
          y: t.y + a * (e.y - t.y)
        }) : s = !1
      } else {
        s = !1
      }
      return s
    },
    direction: function (t) {
      if (!((t = t || this.children).length < 3)) {
        for (var e = t.length, o = 0, i = e - 1, s = 0; s < e; i = s++) {
          o += t[i].x * t[s].y - t[s].x * t[i].y
        }
        return o < 0
      }
    },
    getIntersect: function (t) {
      for (var e = this.children, i = t.children, s = [], n = 0, h = e.length; n < h; n++) {
        for (var r = 0, a = i.length; r < a; r++) {
          var c = o.intersect({
            x: e[n].x,
            y: e[n].y
          }, {
            x: e[n].tx,
            y: e[n].ty
          }, {
            x: i[r].x,
            y: i[r].y
          }, {
            x: i[r].tx,
            y: i[r].ty
          })
          c && c.length > 0 && !o.repeat(s, c[0]) && s.push({
            oi: n,
            oj: r,
            intersect: c[0],
            item: e[n],
            shape: i[r]
          })
        }
      }
      return {
        sect: s
      }
    },
    repair: function (t, e) {
      o.repairThree(t, e)
    },
    getIntersectPoint: function (t, e) {
      e = !!e
      var i = []
      var s = this.children.map(function (t, e) {
        return {
          oi: e,
          x: t.x,
          y: t.y
        }
      })
      var n = t.children.map(function (t, e) {
        return {
          oj: e,
          x: t.x,
          y: t.y
        }
      })
      var h = this.direction() === t.direction()
      e ? h || (n.reverse(),
      n = n.map(function (t, e) {
        return {
          oj: e,
          x: t.x,
          y: t.y
        }
      })) : h && (n.reverse(),
      n = n.map(function (t, e) {
        return {
          oj: e,
          x: t.x,
          y: t.y
        }
      }))
      for (var r = 0; r < s.length; r++) {
        var a = s[r]
        var c = s[r + 1 >= s.length ? 0 : r + 1]
        t.contain(a.x, a.y) ? s[r].del = !0 : s[r].del = !1
        for (var l = 0; l < n.length; l++) {
          var d = n[l]
          var A = n[l + 1 >= n.length ? 0 : l + 1]
          var u = o.intersect(a, c, d, A)
          u && u.length > 0 && !o.repeat(i, u[0]) && i.push({
            oi: r,
            oj: l,
            intersect: u[0]
          }),
          r === 0 && (this.contain(d.x, d.y) ? n[l].add = !e : n[l].add = e)
        }
      }
      return e && i.length > 2 && (i = []), {
        points: s,
        temp: n,
        sect: i
      }
    },
    repairThree: function (e, o) {
      var i = this.getIntersectPoint(e, o)
      if (i.sect.length !== 0) {
        for (var s = i.points.slice(), n = i.temp.slice(), h = [], r = function (t, e, o, i, s) {
            if (e < o) {
              return t.slice(e + 1, o + 1)
            }
            if (e > o) {
              var n = t.slice(e + 1)
              return n.push.apply(n, t.slice(0, o + 1)),
              n
            }
            if (i < s) {
              return []
            }
            var h = t.slice(e + 1)
            return h.push.apply(h, t.slice(0, o + 1)),
            h
          }, a = 0, c = i.sect.length; a < c; a++) {
          var l = i.sect[a]
          var d = a + 1 >= c ? 0 : a + 1
          var A = i.sect[d]
          var u = r(s, l.oi, A.oi, a, d)
          var m = r(n, l.oj, A.oj, a, d)
          u.length > 0 && (u[0].x === l.intersect.x && u[0].y === l.intersect.y || u[0].x === A.intersect.x && u[0].y === A.intersect.y) && u.shift(),
          u.every(function (t) {
            return !t.del
          }) && h.push.apply(h, u),
          m.length > 0 && (m[0].x === l.intersect.x && m[0].y === l.intersect.y || m[0].x === A.intersect.x && m[0].y === A.intersect.y) && m.shift(),
          m.every(function (t) {
            return t.add
          }) && (h.push(l.intersect),
          h.push.apply(h, m),
          h.push(A.intersect))
        }
        for (var p = [], g = 0, f = h.length; g < f; g++) {
          var v = new ShapePath({
            type: 'line',
            color: this.color,
            parent: this
          })
          var y = g + 1 >= f ? 0 : g + 1
          v.line(h[g].x, h[g].y, h[y].x, h[y].y),
          p.push(v)
        }
        this.children = p,
        this.setBounds()
      }
    },
    repeat: function (t, e) {
      return t.some(function (t) {
        return t.intersect.x === e.x && t.intersect.y === e.y
      })
    },
    curveToPoints: function (t) {
      for (var e = t.x, o = t.y, i = t.cx, s = t.cy, n = t.tx, h = t.ty, r = [], a = 0; a < 50; a++) {
        var c = 0.02 * a
        var l = Math.pow(1 - c, 2) * e + 2 * c * (1 - c) * i + Math.pow(c, 2) * n
        var d = Math.pow(1 - c, 2) * o + 2 * c * (1 - c) * s + Math.pow(c, 2) * h
        r.push({
          x: l,
          y: d
        })
      }
      return r
    },
    getPoly: function () {
      var t = []
      return this.children.forEach(function (e) {
        e.type === 'curve' ? o.curveToPoints(e).forEach(function (e) {
          t.push({
            x: e.x,
            y: e.y
          })
        }) : t.push({
          x: e.x,
          y: e.y
        })
      }),
      t.push({
        x: this.children[0].x,
        y: this.children[0].y
      }),
      t
    },
    getChildAttr (scale) {
      self = this
      let children = []
      if (self.children.length > 0) {
        children = self.children.map(item => {
          return item.getAttr(scale)
        })
      }
      return children
    },
    setChildAttr (items, scale) {
      let spArr = []
      if (items.length > 0) {
        items.forEach(item => {
          let sp = new ShapePath()
          sp.setAttr(item, scale)
          sp.parent = this
          spArr.push(sp)
        })
      }
      return spArr
    },
    getAttr (scale) {
      return {
        title: this.title,
        desc: this.desc,
        type: this.type,
        color: this.color,
        children: this.getChildAttr(scale),
        x: this.x / scale,
        y: this.y / scale,
        cx: this.cx / scale,
        cy: this.cy / scale,
        cx2: this.cx2 / scale,
        cy2: this.cy2 / scale,
        tx: this.tx / scale,
        ty: this.ty / scale,
        width: this.width / scale,
        height: this.height / scale,
        r: this.r / scale,
        fill: this.fill,
        selected: this.selected
      }
    },
    setAttr (attr, scale) {
      this.title = attr.title
      this.desc = attr.desc
      this.type = attr.type
      this.color = attr.color
      this.children = this.setChildAttr(attr.children, scale)
      this.x = attr.x * scale
      this.y = attr.y * scale
      this.cx = attr.cx * scale
      this.cy = attr.cy * scale
      this.cx2 = attr.cx2 * scale
      this.cy2 = attr.cy2 * scale
      this.tx = attr.tx * scale
      this.ty = attr.ty * scale
      this.width = attr.width * scale
      this.height = attr.height * scale
      this.r = attr.r * scale
      this.fill = attr.fill || false
      this.initAttr()
    },
    initAttr () {
      if (this.type === 'rect') {
        this.setBounds(this.x, this.y, this.x + this.width, this.y + this.height)
      } else {
        this.setBounds()
      }
    }
  }
  return o
}

export default ShapePath
