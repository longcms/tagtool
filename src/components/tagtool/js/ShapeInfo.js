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
      this.el.appendChild(this.infoEl)
      this.bg.className = 'll-info-bg'
      this.bg.style.display = 'none'
      option.el ? option.el.appendChild(this.bg) : document.body.appendChild(this.bg)
      option.el ? option.el.appendChild(this.el) : document.body.appendChild(this.el)
    },
    infoElInit () {
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
      this.titleDiv.appendChild(this.moreBtn)
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

      this.okBtn.addEventListener('click', (e) => {
        this.confirm()
      }, false)
      this.cancelBtn.addEventListener('click', (e) => {
        this.cancel()
      }, false)
      this.moreBtn.addEventListener('click', (e) => {
        this.more()
      }, false)

      this.infoEl.appendChild(this.titleDiv)
      this.infoEl.appendChild(this.descDiv)
      this.infoEl.appendChild(this.btnDiv)
    },
    show (t, i) {
      this.el.style.display = ''
      this.bg.style.display = ''
      this.titleInput.value = t
      this.descInput.value = i
      setTimeout(() => {
        this.titleInput.focus()
      }, 100)
    },
    hide () {
      this.el.style.display = 'none'
      this.bg.style.display = 'none'
      this.more(true)
    },
    confirm () {
      this.hide()
      option.confirm && option.confirm(this.titleInput.value.trim(), this.descInput.value.trim())
    },
    cancel () {
      this.hide()
      option.cancel && option.cancel()
    },
    more (f) {
      option.more && option.more(f)
    }
  }
}

export default ShapeInfo
