### `允许ipad使用竖屏`
在 app.json 文件中添加
```
resizable: true
```
或者以竖屏的形式，重新打开小程序

### `使用 icon 之后图标大小没有自适应`
使用 iconfont 作为图标库资源
针对每一个图标都需要设置 rpx 的样式，只能使用内联样式
```
<i style="font-size: 32rpx;" class="iconfont icon-icon-test"></i>
style="font-size: 32rpx;"
```

### `个别页面内容长了之后被挡住了，无法下滑查看`
需要添加 scroll-view 组件

### `获取页面元素中样式`
在 Component 中必须传入 this
```
wx.createSelectorQuery().in(this)
```