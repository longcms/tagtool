const ShapeHistory = () => {
  return {
    data: [],
    index: 0,
    max: 100,
    add: function (t) {
      this.data.length >= this.max && this.data.shift(),
        this.index = this.data.push(t) - 1
    },
    back: function () {
      this.index--;
      var t = this.index;
      return this.index < 0 && (this.index = 0),
        this.data[t]
    },
    next: function () {
      this.index++;
      var t = this.index;
      return this.index >= this.data.length && (this.index = this.data.length - 1),
        this.data[t]
    }
  }
}

export default ShapeHistory