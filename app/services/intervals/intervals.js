const interval = {
  //to keep a reference to all the intervals
  intervals : {},

  //create another interval
  make : function (fun, delay) {
    //see explanation after the code
    const newInterval = setInterval.apply(
      window,
      [fun, delay].concat([].slice.call(arguments, 2))
   )

    this.intervals[newInterval] = true

    return newInterval
  },

  //clear a single interval
  clear : function (id) {
    return clearInterval(this.intervals[id])
  },

  //clear all intervals
  clearAll : function () {
    const all = Object.keys(this.intervals)
    const len = all.length

    while (len-- > 0) {
      clearInterval(all.shift())
    }
  }
}

export default interval