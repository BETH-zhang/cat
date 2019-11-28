const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    toolType: {
      type: "String",
      value: "",
      observer:function(news, olds, path){
        console.log('properties: ', news, olds, path)
      }
    }
  },
  data: {
  },
  attached() {
    console.log("sharesetting")
  },
  methods: {
    updateProps(e) {
      var myEventDetail = {
        share: e.currentTarget.dataset.cur,
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('sharesettingevent', myEventDetail, myEventOption)
    },

    titleInputChange(e) {
      this.setData({
        title: e.detail.value,
      })
    },
    desInputChange(e) {
      this.setData({
        description: e.detail.value
      })
    },

    setShareTitle() {
      this.setData({
        showTitlePanel: true,
      })
    },
    
    inputTitle() {
      this.setData({
        showTitlePanel: false,
      })
    },

  }
})