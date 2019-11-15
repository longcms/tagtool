const colorPicker = (t) => {
  var e = {};
  "string" == typeof t ? e.color = t : e = t || e;
  var o = e.color,
    i = e.confirm || function () {},
    s = e.cancel || function () {},
    $el = e.el || null;
  return {
    width: 256,
    height: 256,
    barWidth: 20,
    color: o,
    oldColor: o,
    bg: document.createElement("div"),
    el: document.createElement("div"),
    colorBox: document.createElement("canvas"),
    colorBar: document.createElement("canvas"),
    colorInput: document.createElement("div"),
    barColors: [],
    colors: [{
      color: "#f00",
      weight: 0
    }, {
      color: "#ff0",
      weight: .17
    }, {
      color: "#0f0",
      weight: .33
    }, {
      color: "#0ff",
      weight: .5
    }, {
      color: "#00f",
      weight: .67
    }, {
      color: "#f0f",
      weight: .83
    }, {
      color: "#f00",
      weight: 1
    }],
    comColor: ["#2d8cf0", "#ff9900", "#ed4014", "#19c919", "#f9e31c", "#ea1a1a", "#9b1dea", "#00c2b1", "#ac7a33", "#1d35ea", "#8bc34a", "#f16b62", "#ea4ca3", "#0d94aa", "#5d4037", "#607d8b", "#000000", "#ffffff"],
    init: function () {
      var t = this;
      this.initColorInput(),
        this.initColorBox(o),
        this.initColorBar(),
        this.el.className = "ll-color-picker",
        this.el.style.display = "none",
        this.el.appendChild(this.colorBox),
        this.el.appendChild(this.colorBar),
        this.el.appendChild(this.colorInput),
        this.bg.className = "ll-color-picker-bg",
        this.bg.style.display = "none",
        $el ? $el.appendChild(this.bg) : document.body.appendChild(this.bg),
        $el ? $el.appendChild(this.el) : document.body.appendChild(this.el),
        this.setColor(o),
        this.colorBox.addEventListener("click", function (e) {
          t.clickBox(e)
        }, !1),
        this.colorBar.addEventListener("click", function (e) {
          t.clickBar(e)
        }, !1),
        this.bg.addEventListener("click", function () {
          t.hide()
        }, !1)
    },
    initColorBox: function (t, e) {
      this.colorBox.width = this.width,
        this.colorBox.height = this.height;
      var o = this.colorBox.getContext("2d");
      o.clearRect(0, 0, this.colorBox.width, this.colorBox.height),
        o.fillStyle = t,
        o.fillRect(0, 0, this.colorBox.width, this.colorBox.height);
      var i = o.createLinearGradient(0, 0, this.width, 0);
      i.addColorStop(0, "#FFFFFF"),
        i.addColorStop(1, "hsla(0,0%,100%,0)"),
        o.fillStyle = i,
        o.fillRect(0, 0, this.colorBox.width, this.colorBox.height);
      var s = o.createLinearGradient(0, 0, 0, this.height);
      s.addColorStop(0, "transparent"),
        s.addColorStop(1, "#000000"),
        o.fillStyle = s,
        o.fillRect(0, 0, this.colorBox.width, this.colorBox.height)
    },
    initColorBar: function (t) {
      t = t || 0,
        this.colorBar.width = this.barWidth,
        this.colorBar.height = this.height;
      var e = this.colorBar.getContext("2d");
      e.clearRect(0, 0, this.colorBar.width, this.colorBar.height);
      var o = e.createLinearGradient(0, 0, 0, this.height);
      if (this.colors.forEach(function (t) {
          o.addColorStop(t.weight, t.color)
        }),
        e.fillStyle = o,
        e.fillRect(0, 0, this.colorBar.width, this.colorBar.height),
        0 === this.barColors.length)
        for (var i = this.dataToArray(e.getImageData(0, 0, 1, this.colorBox.height).data), s = 0; s < i.length; s += 4) {
          var n = i.slice(s, s + 4),
            h = this.formatColor(n);
          this.barColors.push(h.slice(1))
        }
      e.fillStyle = "#FFFFFF",
        e.fillRect(0, t, this.colorBar.width, 1)
    },
    initColorInput: function () {
      var t = this;
      this.colorInput.className = "ll-color-picker__input",
        this.view = document.createElement("div"),
        this.view.className = "ll-color-picker__input-view",
        this.oldView = document.createElement("div"),
        this.oldView.className = "ll-color-picker__input-view",
        this.view.style.backgroundColor = this.color,
        this.oldView.style.backgroundColor = this.oldColor,
        this.rgbDiv = document.createElement("div"),
        this.rLabel = document.createElement("label"),
        this.rInput = document.createElement("input"),
        this.rInput.setAttribute("maxlength", "3"),
        this.rInput.setAttribute("id", "rInput"),
        this.rLabel.innerHTML = "R:",
        this.gLabel = document.createElement("label"),
        this.gInput = document.createElement("input"),
        this.gInput.setAttribute("maxlength", "3"),
        this.gInput.setAttribute("id", "gInput"),
        this.gLabel.innerHTML = "G:",
        this.bLabel = document.createElement("label"),
        this.bInput = document.createElement("input"),
        this.bInput.setAttribute("maxlength", "3"),
        this.bInput.setAttribute("id", "bInput"),
        this.bLabel.innerHTML = "B:",
        this.rgbDiv.className = "ll-color-picker__input-rgb",
        this.rgbDiv.appendChild(this.rLabel),
        this.rgbDiv.appendChild(this.rInput),
        this.rgbDiv.appendChild(this.gLabel),
        this.rgbDiv.appendChild(this.gInput),
        this.rgbDiv.appendChild(this.bLabel),
        this.rgbDiv.appendChild(this.bInput),
        this.hexLabel = document.createElement("label"),
        this.hexInput = document.createElement("input"),
        this.hexInput.setAttribute("maxlength", "7"),
        this.hexInput.setAttribute("id", "hexInput"),
        this.hexLabel.innerHTML = "Hex:",
        this.hexDiv = document.createElement("div"),
        this.hexDiv.className = "ll-color-picker__input-hex",
        this.hexDiv.appendChild(this.hexLabel),
        this.hexDiv.appendChild(this.hexInput),
        this.comDiv = document.createElement("div"),
        this.comDiv.className = "ll-color-picker__input-com",
        this.comColor.forEach(function (e) {
          var o = document.createElement("span");
          o.style.backgroundColor = e,
            t.comDiv.appendChild(o),
            o.addEventListener("click", function (e) {
              var o = e.target;
              t.setColor(o.style.backgroundColor)
            }, !1)
        }),
        this.btnDiv = document.createElement("div"),
        this.btnDiv.className = "ll-color-picker__input-btn",
        this.okBtn = document.createElement("button"),
        this.cancelBtn = document.createElement("button"),
        this.okBtn.innerHTML = "确定",
        this.cancelBtn.innerHTML = "取消",
        this.btnDiv.appendChild(this.okBtn),
        this.btnDiv.appendChild(this.cancelBtn),
        this.colorInput.appendChild(this.view),
        this.colorInput.appendChild(this.oldView),
        this.colorInput.appendChild(this.rgbDiv),
        this.colorInput.appendChild(this.hexDiv),
        this.colorInput.appendChild(this.comDiv),
        this.colorInput.appendChild(this.btnDiv),
        this.rInput.addEventListener("input", function (e) {
          t.changeInput("r")
        }, !1),
        this.gInput.addEventListener("input", function (e) {
          t.changeInput("g")
        }, !1),
        this.bInput.addEventListener("input", function (e) {
          t.changeInput("b")
        }, !1),
        this.hexInput.addEventListener("input", function (e) {
          t.changeInput("hex")
        }, !1),
        this.okBtn.addEventListener("click", function (e) {
          t.confirm()
        }, !1),
        this.cancelBtn.addEventListener("click", function (e) {
          t.cancel()
        }, !1)
    },
    clickBox: function (t) {
      var e = this.colorBox.getContext("2d").getImageData(t.offsetX, t.offsetY, 1, 1).data;
      this.color = this.formatColor(e),
        this.setColor(this.color, !0)
    },
    clickBar: function (t) {
      var e = this.colorBar.getContext("2d").getImageData(t.offsetX, t.offsetY, 1, 1).data,
        o = this.formatColor(e);
      this.color = o,
        this.setColor(this.color)
    },
    changeInput: function (t) {
      switch (t) {
        case "hex":
          7 === this.hexInput.value.length && this.setColor(this.hexInput.value);
          break;
        default:
          var e = parseInt(this.rInput.value, 10),
            o = parseInt(this.gInput.value, 10),
            i = parseInt(this.bInput.value, 10);
          e = isNaN(e) ? 0 : e > 255 ? 255 : e < 0 ? 0 : e,
            o = isNaN(o) ? 0 : o > 255 ? 255 : o < 0 ? 0 : o,
            i = isNaN(i) ? 0 : i > 255 ? 255 : i < 0 ? 0 : i,
            this.setColor("rgb(" + e + "," + o + "," + i + ")")
      }
    },
    setColor: function (t, e) {
      var o = [0, 0, 0, 255];
      if ("#" === t.slice(0, 1))
        o[0] = parseInt(t.slice(1, 3), 16),
        o[1] = parseInt(t.slice(3, 5), 16),
        o[2] = parseInt(t.slice(5, 7), 16);
      else if ("rgba" === t.slice(0, 4)) {
        var i = t.slice(5, -1).split(",");
        o[0] = parseInt(i[0], 10),
          o[1] = parseInt(i[1], 10),
          o[2] = parseInt(i[2], 10),
          o[3] = parseInt(i[3], 10)
      } else if ("rgb" === t.slice(0, 3)) {
        var s = t.slice(4, -1).split(",");
        o[0] = parseInt(s[0], 10),
          o[1] = parseInt(s[1], 10),
          o[2] = parseInt(s[2], 10)
      } else
        o = this.sToColor(t);
      var n = this.formatColor(o, "hex");
      this.color = n,
        this.hexInput.value = n,
        this.view.style.backgroundColor = this.color,
        this.oldView.style.backgroundColor = this.oldColor,
        this.rInput.value = o[0],
        this.gInput.value = o[1],
        this.bInput.value = o[2];
      var h = this.colorInCanvas(n.slice(1), this.barColors),
        r = "#" + this.barColors[h];
      this.initColorBar(h),
        this.initColorBox(r, e)
    },
    show: function (t, e) {
      this.el.style.display = "",
        this.bg.style.display = "",
        this.oldColor = t,
        this.flag = e,
        this.setColor(t)
    },
    hide: function () {
      this.el.style.display = "none",
        this.bg.style.display = "none"
    },
    confirm: function () {
      this.hide(),
        i && i(this.color, this.flag)
    },
    cancel: function () {
      this.hide(),
        s && s(this)
    },
    formatColor: function (t, e) {
      e = e || "hex";
      var o = t[0],
        i = t[1],
        s = t[2],
        n = t[3],
        h = "";
      switch (e) {
        case "hex":
          var r = o.toString(16),
            a = i.toString(16),
            c = s.toString(16);
          h = "#" + (r = 1 === r.length ? "0" + r : r) + (a = 1 === a.length ? "0" + a : a) + (c = 1 === c.length ? "0" + c : c);
          break;
        case "rgb":
          h = "rgb(" + o + "," + i + "," + s + ")";
          break;
        case "rgba":
          h = "rgba(" + o + "," + i + "," + s + "," + n + ")"
      }
      return h
    },
    sToColor: function (t) {
      var e = document.createElement("canvas");
      e.width = 10,
        e.height = 10;
      var o = e.getContext("2d");
      return o.fillStyle = t,
        o.fillRect(0, 0, 10, 10),
        o.getImageData(5, 5, 1, 1).data
    },
    colorInCanvas: function (t, e) {
      var o = parseInt(t.slice(0, 2), 16),
        i = parseInt(t.slice(2, 4), 16),
        s = parseInt(t.slice(4, 6), 16),
        n = e.map(function (t, e) {
          var n = parseInt(t.slice(0, 2), 16),
            h = parseInt(t.slice(2, 4), 16),
            r = parseInt(t.slice(4, 6), 16);
          return {
            v: Math.sqrt(Math.pow(o - n, 2) + Math.pow(i - h, 2) + Math.pow(s - r, 2)),
            k: e
          }
        }).slice();
      return n.sort(function (t, e) {
          return t.v - e.v
        }),
        n[0].k
    },
    dataToArray: function (t) {
      for (var e = [], o = 0; o < t.length; o++)
        e.push(t[o]);
      return e
    },
    RGBToHSL: function (t, e, o) {
      var i, s, n;
      t /= 255,
        e /= 255,
        o /= 255;
      var h = Math.min(t, e, o),
        r = Math.max(t, e, o);
      return n = (h + r) / 2,
        i = 0,
        r - h == 0 ? s = 0 : (s = n < .5 ? (r - h) / (r + h) : (r - h) / (2 - r - h),
          t === r && (i = (e - o) / (r - h)),
          e === r && (i = 2 + (o - t) / (r - h)),
          o === r && (i = 4 + (t - e) / (r - h)),
          i = (i *= 60) < 0 ? i + 360 : i), {
          H: Math.round(i),
          S: Math.round(100 * s),
          L: Math.round(100 * n)
        }
    },
    HSLToRGB: function (t, e, o) {
      var i, s, n;
      t /= 360,
        o /= 100;
      var h = function (i) {
        var s, n, h;
        return s = 2 * o - (n = o < .5 ? o * (1 + e) : o + e - o * e),
          (h = "R" === i ? t + 1 / 3 : "G" === i ? t : t - 1 / 3) < 0 && (h += 1),
          h > 1 && (h -= 1),
          6 * h < 1 ? s + 6 * (n - s) * h : 2 * h < 1 ? n : 3 * h < 2 ? s + (n - s) * (2 / 3 - h) * 6 : s
      };
      return 0 == (e /= 100) ? i = s = n = o : (i = h("R"),
        s = h("G"),
        n = h("B")), {
        R: Math.round(255 * i).toString(16),
        G: Math.round(255 * s).toString(16),
        B: Math.round(255 * n).toString(16)
      }
    }
  }
}

export default colorPicker