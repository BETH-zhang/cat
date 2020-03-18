// /**
//   2  * 使用方法:
//   3  * 1) WXHTML要缩放的图片 必须 传入 src 以及绑定 bindtap事件,
//   4  *    e.g:     
//   5  *    
//   6  * 2) WXHTML 要引入Modal模板(isCheckDtl无需再定义):
//   7  *      
//   8  *        
//   9  *        
//  10  *      
//  11  * 3) JS页面要引入JS文件,覆盖当前页面的事件:
//  12  *    var resizePicModalService =  require ('../../components/resizePicModal/resizePicModal.js')
//  13  *    var resizePicModal = {}
//  14  * 4) 在onLoad事件中,实例化ResizePicModal
//  15  *        resizePicModal = new resizePicModalService.ResizePicModal()
//  16  */
//  17 var app = getApp()
//  18 let modalEvent = {
//  19   distanceList: [0, 0],//存储缩放时,双指距离.只有两个数据.第一项为old distance.最后一项为new distance
//  20   disPoint: { x: 0, y: 0 },//手指touch图片时,在图片上的位置
//  21   imgIdList:{},
//  22   
//  23   /**
//  24    * 打开弹窗
//  25    */
//  26   showResizeModal: function (e) {
//  27     var src = e.currentTarget.dataset.src;
//  28     var x = 0
//  29     var y =0
//  30     try {
//  31       var width = this.imgIdList[e.currentTarget.id].width; //图片原宽
//  32       var height = this.imgIdList[e.currentTarget.id].height; //图片原高
//  33      
//  34       //小程序固定宽320px
//  35       height = height * (320 / width);
//  36       width = 320;
//  37 
//  38       x = (app.windowWidth - width) / 2 //> 0 ? (app.windowWidth - width) / 2 : 0;
//  39       y = (app.windowHeight - height) / 2// > 0 ? (app.windowHeight - height) / 2 : 0;
//  40 
//  41     } catch (e) { }
//  42     var img = {
//  43       top: y,
//  44       left: x,
//  45       x: x, y: y,
//  46       width: '100%',
//  47       baseScale: 1,
//  48       currentSrc: src,
//  49     };
//  50     this.setData({ img: img, isCheckDtl: true });
//  51     
//  52   },
//  53   /**
//  54    * 关闭弹窗
//  55    */
//  56   closeResizeModal:function(){
//  57     this.setData({  isCheckDtl: false })
//  58   },
//  59   /**
//  60    * 加载图片
//  61    */
//  62   imageOnload:function(e){
//  63     var id = e.currentTarget.id
//  64     this.imgIdList[id] = {
//  65       width:e.detail.width,
//  66       height:e.detail.height
//  67     }
//  68     
//  69   },
//  70   /**
//  71    * bindtouchmove
//  72    */
//  73   bindTouchMove: function (e) {
//  74     if (e.touches.length == 1) {//一指移动当前图片
//  75       this.data.img.left = e.touches[0].clientX - this.disPoint.x
//  76       this.data.img.top = e.touches[0].clientY - this.disPoint.y
//  77 
//  78       this.setData({ img: this.data.img })
//  79     }
//  80   
//  82     if (e.touches.length == 2) {//二指缩放
//  83       var xMove = e.touches[1].clientX - e.touches[0].clientX
//  84       var yMove = e.touches[1].clientY - e.touches[0].clientY
//  85       var distance = Math.sqrt(xMove * xMove + yMove * yMove);//开根号
//  86       this.distanceList.shift()
//  87       this.distanceList.push(distance)
//  88       if (this.distanceList[0] == 0) { return }
//  89       var distanceDiff = this.distanceList[1] - this.distanceList[0]//两次touch之间, distance的变化. >0,放大图片.<0 缩小图片
//  90       // 假设缩放scale基数为1:  newScale = oldScale + 0.005 * distanceDiff
//  91       var baseScale = this.data.img.baseScale + 0.005 * distanceDiff
//  92       if(baseScale>0){
//  93         this.data.img.baseScale = baseScale
//  94         var imgWidth = baseScale * parseInt(this.data.img.imgWidth) 
//  95         var imgHeight = baseScale * parseInt(this.data.img.imgHeight)
//  96         this.setData({ img: this.data.img })
//  97       }else{
//  98         this.data.img.baseScale = 0
//  99         this.setData({ img: this.data.img })
// 100       }
// 101       
// 102     }
// 103 
// 104   },
// 105   /**
// 106    * bindtouchend
// 107    */
// 108   bindTouchEnd: function (e) {
// 109     if (e.touches.length == 2) {//二指缩放
// 110       this.setData({ isCheckDtl: true })
// 111     }
// 112   },
// 113   /**
// 114    * bindtouchstart
// 115    */
// 116   bindTouchStart: function (e) {
// 117     this.distanceList = [0, 0]//回复初始值
// 118     this.disPoint = { x: 0, y: 0 }
// 119     if (e.touches.length == 1) {
// 120       this.disPoint.x = e.touches[0].clientX - this.data.img.left
// 121       this.disPoint.y = e.touches[0].clientY - this.data.img.top
// 122     }
// 123 
// 124   }
// 125 }
// 126 
// 127 function ResizePicModal(){
// 128   let pages = getCurrentPages()
// 129   let curPage = pages[pages.length - 1]
// 130   Object.assign(curPage, modalEvent)//覆盖原生页面事件
// 131   this.page = curPage
// 132   curPage.resizePicModal = this
// 133   return this
// 134 }
// 135 module.exports = {
// 136   ResizePicModal
// 137 }
// 业务页面wxml:引入自定义控件模板

//  1   <view class="flex-wrap flex-pic">
//  2               <view class="picList">            
//  3                   <image  wx:for="{{item.imglist}}" wx:for-item="itemImg" wx:key="*this" id="{{'rfnd_'+index}}" bindload="imageOnload" src="{{ itemImg}}" bindtap="showResizeModal" data-src="{{itemImg}}">image>           
//  4               view>
//  5   view>
//  6 
//  7  <view wx:if="{{isCheckDtl}}">
//  8    <import src="/components/resizePicModal/resizePicModal.wxml"/>
//  9   <template is="resizePic" data="{{img}}">template>
