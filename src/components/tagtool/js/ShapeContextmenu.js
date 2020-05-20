const ShapeContextmenu = function(t) {
  var e = {};
  "string" == typeof t ? e.color = t : e = t || e;
  var o = e.confirm || function() {}
  ;
  return {
      bg: document.createElement("div"),
      el: document.createElement("div"),
      init: function() {
          this.el.className = "ll-menu"
          this.el.style.display = "none"
          this.bg.className = "ll-menu-bg"
          this.bg.style.display = "none"
          document.body.appendChild(this.bg)
          document.body.appendChild(this.el)
          this.bg.addEventListener("click", () => {
              this.hide()
          }, false)
          this.bg.addEventListener("contextmenu", (e) => {
            e.preventDefault()
        }, false)
      },
      click: function(t) {
          this.hide()
          o && o(t)
      },
      additem: function(t) {
          var e = this
            , o = this.el;
          o.innerHTML = ""
          t.forEach(function(t, i) {
              var s = document.createElement("div");
              s.innerHTML = t.title ? t.title : "形状" + (i + 1),
              s.addEventListener("click", function() {
                  e.click(t.item)
              }, !1),
              o.appendChild(s)
          })
      },
      show: function(t, e) {
          let st = document.documentElement.scrollTop
          let top = t.clientY + st
          this.additem(e)
          this.el.style.left = t.clientX + "px"
          this.el.style.top = top + "px"
          this.el.style.display = ""
          this.bg.style.display = ""
      },
      hide: function() {
          this.el.style.display = "none",
          this.bg.style.display = "none"
      }
  }
}
export default ShapeContextmenu