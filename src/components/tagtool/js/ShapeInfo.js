const ShapeInfo = (option) => {
  option = option || {}
  return {
    width: 256,
    height: 256,
    bg: document.createElement('div'),
    el: document.createElement('div'),
    infoEl: document.createElement('div'),
    init () {
      this.el.className = 'll-info'
      this.el.style.display = 'none'
      this.infoElInit()
      this.arrow = document.createElement('div')
      this.arrow.className = 'll-info-arrow'
      this.el.appendChild(this.infoEl)
      this.bg.className = 'll-info-bg'
      this.bg.style.display = 'none'
      option.el ? option.el.appendChild(this.bg) : document.body.appendChild(this.bg)
      option.el ? option.el.appendChild(this.arrow) : document.body.appendChild(this.arrow)
      option.el ? option.el.appendChild(this.el) : document.body.appendChild(this.el)
    },
    infoElInit () {
      this.tagDiv = document.createElement('div')
      this.tagDiv.className = 'll-info-item'

      this.titleDiv = document.createElement('div')
      this.titleLabel = document.createElement('label')
      this.titleInput = document.createElement('input')
      this.titleLabel.innerHTML = '名称：'
      this.titleInput.setAttribute('placeholder', '标注名称')
      this.moreBtn = document.createElement('button')
      this.moreBtn.className = 'll-info-btn'
      this.moreBtn.innerHTML = '...'
      this.titleDiv.appendChild(this.titleLabel)
      this.titleDiv.appendChild(this.titleInput)
      // this.titleDiv.appendChild(this.moreBtn)
      this.titleDiv.className = 'll-info-item'

      this.descDiv = document.createElement('div')
      this.descLabel = document.createElement('label')
      this.descInput = document.createElement('textarea')
      this.descLabel.innerHTML = '简介：'
      this.descInput.setAttribute('placeholder', '标注描述')
      this.descDiv.appendChild(this.descLabel)
      this.descDiv.appendChild(this.descInput)
      this.descDiv.className = 'll-info-item'

      this.btnDiv = document.createElement('div')
      this.btnDiv.className = 'll-info-btn'
      this.okBtn = document.createElement('button')
      this.cancelBtn = document.createElement('button')

      this.okBtn.innerHTML = '确定'
      this.cancelBtn.innerHTML = '取消'
      this.btnDiv.appendChild(this.okBtn)
      this.btnDiv.appendChild(this.cancelBtn)

      this.titleInput.addEventListener('input', (e) => {
        this.filterData(e)
      }, false)
      this.titleInput.addEventListener('focus', (e) => {
        this.tagUl.style.display = ''
        this.filterData(e)
      }, false)
      this.titleInput.addEventListener('blur', (e) => {
        setTimeout(() => {
          this.tagUl.style.display = 'none'
        }, 350);
      }, false)

      this.titleInput.addEventListener('keydown', (e) => {
        e.stopPropagation()
        var code = e.which || e.keyCode
        if(e.ctrlKey && code === 83){
          e.preventDefault()
          this.confirm()
        } else if(e.ctrlKey && code === 88){
          e.preventDefault()
          this.cancel()
          return false
        }
      }, false)
      this.descInput.addEventListener('keydown', (e) => {
        e.stopPropagation()
        var code = e.which || e.keyCode
        if(e.ctrlKey && code === 83){
          e.preventDefault()
          e.cancelBubble = true
          this.confirm()
        } else if(e.ctrlKey && code === 88){
          e.preventDefault()
          this.cancel()
          return false
        }
      }, false)

      this.okBtn.addEventListener('click', (e) => {
        this.confirm()
      }, false)
      this.cancelBtn.addEventListener('click', (e) => {
        this.cancel()
      }, false)
      this.moreBtn.addEventListener('click', (e) => {
        this.more()
      }, false)

      this.tagUl = document.createElement('ul')
      this.tagUl.className = 'll-info-list'
      this.infoEl.appendChild(this.tagDiv)
      this.infoEl.appendChild(this.titleDiv)
      this.infoEl.appendChild(this.descDiv)
      this.infoEl.appendChild(this.btnDiv)
      this.infoEl.appendChild(this.tagUl)
    },
    setTag (d1, d2) {
      this.tagDiv.innerHTML = ''
      let c = 3
      let a = d1.concat(d2)
      a = a.filter(item => {
        return (item.title+'').trim().length > 0
      })
      this.data = a
      for (let i = 0; i < c && a[i]; i++) {
        let btn = document.createElement('button')
        btn.innerHTML = a[i].title
        btn.addEventListener('click', () => {
          this.titleInput.value = a[i].title
          this.descInput.value = a[i].desc
          this.focus()
        }, false)
        this.tagDiv.appendChild(btn)
      }
    },
    show (t, i, op) {
      this.setTag(op.d1, op.d2)
      this.el.style.display = ''
      this.bg.style.display = ''
      this.arrow.style.display = ''
      let eW = this.el.offsetWidth
      let eH = this.el.offsetHeight
      let x = op.x
      let y = op.y
      let ax = op.x - 6
      let ay = op.y
      if (eW + op.x > op.w) {
        x -= eW + op.x - op.w
        x -= 15
      } else {
        x -= 15
      }

      if (eH + op.y > op.h) {
        y -= eH
        y -= 6
        ay -= 12
      } else {
        y += 5
      }

      // this.el.style.left = x + 'px'
      // this.el.style.top = y + 'px'
      // this.arrow.style.left = ax + 'px'
      // this.arrow.style.top = ay + 'px'

      this.titleInput.value = t
      this.descInput.value = i
      this.op = op
      this.focus()
    },
    hide () {
      this.el.style.display = 'none'
      this.bg.style.display = 'none'
      this.arrow.style.display = 'none'
      this.more(true)
    },
    confirm () {
      this.hide()
      let title = this.titleInput.value.trim() || ''
      let desc = this.descInput.value.trim() || ''
      option.confirm && option.confirm(title, desc)
    },
    cancel () {
      this.hide()
      option.cancel && option.cancel()
    },
    more (f) {
      option.more && option.more(f)
    },
    filterData (e) {
      let input = e.target
      let n = input.value
      this.tagUl.innerHTML = ''
      if (n.trim().length === 0) {
        return
      }
      this.tagUl.style.left = input.offsetLeft + 'px'
      this.tagUl.style.top = (input.offsetTop + input.offsetHeight) + 'px'
      this.tagUl.style.width = input.offsetWidth + 'px'
      if (this.data && this.data.length > 0) {
        let result = this.data.filter(item => {
          return item.title.indexOf(n) > -1
        })
        result.forEach(i => {
          let li = document.createElement('li')
          li.innerHTML = i.title
          li.addEventListener('click', () => {
            console.log(i)
            this.titleInput.value = i.title
            this.descInput.value = i.desc
          }, false)
          this.tagUl.appendChild(li)
        })
      }
    },
    focus(){
      setTimeout(() => {
        this.titleInput.focus()
      }, 100)
    }
  }
}

export default ShapeInfo
