import throttle from './libs/throttle'
import ShapeHistory from './ShapeHistory'

const ShapeSet = function () {
  let shapeSet = {
    items: [],
    item: null,
    temp: null,
    edits: [],
    time: (new Date()).getTime(),
    history: new ShapeHistory()
  }
  let _time = shapeSet.time
  Object.defineProperty(shapeSet, 'time', {
    configurable: true,
    enumerable: true,
    get() {
      return _time
    },
    set(v) {
      if (_time !== v) {
        _time = v
        this.emit && this.emit(_time, 'time:set')
      }
    }
  })

  shapeSet.onChange = (v, n) => {

  }
  shapeSet.emit = throttle((v, n) => {
    shapeSet.onChange && shapeSet.onChange(v, n)
  })
  // shapeSet.emit = (v, n)=>{
  //   shapeSet.onChange && shapeSet.onChange(v, n)
  // }
  shapeSet.trigger = function (t) {
    t = t || (new Date()).getTime()
    this.time = t
  }
  shapeSet.addHistory = function () {
    this.history.add(this.cloneData())
  }

  shapeSet.revoke = function () {
    var t = this.history.back();
    t ? (this.items = t.items,
      this.item = t.item,
      this.temp = null,
      this.edits = null,
      this.trigger()) : (this.items = [],
      this.item = null,
      this.temp = null,
      this.edits = null,
      this.trigger())
  }

  shapeSet.redo = function () {
    var t = this.history.next();
    t && (this.items = t.items,
      this.item = t.item,
      this.temp = null,
      this.edits = null,
      this.trigger())
  }

  shapeSet.cloneData = function () {
    var t, e = [];
    return this.items.forEach(function (t) {
        e.push(t.clone())
      }),
      t = this.item && this.item.clone(), {
        items: e,
        item: t
      }
  }

  shapeSet.delete = function () {
    var t = this.items.filter(function (t) {
      return !1 === t.selected
    });
    this.items = t,
      this.edits = [],
      this.trigger()
  }

  shapeSet.setData = function (items) {

  }

  shapeSet.getData = function (scale) {
    return this.items.map(item => {
      return item.getAttr(scale)
    })
  }

  return shapeSet
}

export default ShapeSet