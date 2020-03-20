Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    nodes: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    nodes: [],
  },

  /**
   * 组件初始化
   */
  attached() {
  },

  ready() {
    this.initData() 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateProps(dataCur) {
      this.triggerEvent('event', {
        dataCur,
      })
    },
    clickHandler(e) {
      const cur = e.currentTarget.dataset.cur
      if (cur) {
        this.updateProps(cur)
      }
    },
    initData() {
    },
  }
})
