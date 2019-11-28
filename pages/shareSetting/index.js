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
    console.log("sharesetting", this.data, this)
  },
  methods: {
    updateProps(e) {
      var myEventDetail = {
        title: this.data.title,
        description: this.data.description,
        showGrid: this.data.showGrid,
      }
      var myEventOption = {}
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
    gridSelectChange(e) {
      this.setData({
        showGrid: e.detail.value
      })
    }
  }
})