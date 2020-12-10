import Template1 from '../../assets/data/card';
import Template2 from '../../assets/data/image-example'
import Template3 from '../../assets/data/shadow-example'
import Template4 from '../../assets/data/text-example'
import ColorCardTheme0 from '../../assets/data/colorCardTheme0'
import ColorCardTheme1 from '../../assets/data/colorCardTheme1'
import ColorCardTheme2 from '../../assets/data/colorCardTheme2'
import pixelCardTheme0 from '../../assets/data/pixelCardTheme0'
import pixelCardTheme1 from '../../assets/data/pixelCardTheme1'
import themeText from '../../assets/data/themeText'
import qrcodeTheme from '../../assets/data/qrcodeTheme'
import theme12 from '../../assets/data/workShowTheme'

import { getImagePath, getTempFileURL } from '../../api/image'

const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    template: {},
    image: '',

    id: '12',
  },
  lifetimes: {
    created() {
      console.log("created")
    },
    attached() {
      console.log("attached")
    },
    ready() {
      console.log('flag')
      this.createTemplate(this.data.id)
    },
    moved() {
      console.log('moved')
    },
    detached() {
      console.log('detached')
    },
  },
  methods: {
    onImgOK(e) {
      this.setData({
        image: e.detail.path
      })
      console.log(e);
    },
  
    saveImage() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.image,
      });
    },

    createTemplate(e) {
      const userInfo = wx.getStorageSync('userInfo') || {}
      switch(typeof e === 'string' ? e : e.target.dataset.cur) {
        case '1':
          this.setData({
            template: new Template1().palette(),
          });
          break;
        case '2':
          this.setData({
            template: new Template2().palette(),
          });
          break;
        case '3':
          this.setData({
            template: new Template3().palette(),
          });
          break;
        case '4':
          this.setData({
            template: new Template4().palette(),
          });
          break;
        case '5':
          const data = {
            avatar: userInfo.avatarUrl,
            qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            name: userInfo.nickName,
            title: '色卡分享',
            time: '2020.1.1',
            imgInfo: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            colors: ['red', 'red', 'red', 'red', 'red']
          }
          this.setData({
            template: new ColorCardTheme2().palette(data),
          })
          break;
        case '7':
          const data2 = {
            avatar: userInfo.avatarUrl,
            qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            name: userInfo.nickName,
            title: '色卡分享',
            time: '2020.1.1',
            imgInfo: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            colors: ['red', 'red', 'red', 'red', 'red']
          }
          this.setData({
            template: new ColorCardTheme0().palette(data2),
          })
          break;
        case '8':
          const data3 = {
            avatar: userInfo.avatarUrl,
            qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            name: userInfo.nickName,
            title: '色卡分享',
            time: '2020.1.1',
            imgInfo: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            colors: ['red', 'red', 'red', 'red', 'red']
          }
          this.setData({
            template: new ColorCardTheme1().palette(data3),
          })
          break;
        case '6':
          console.log('userInfo: ', userInfo)
          const data1 = {
            avatar: userInfo.avatarUrl,
            qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            name: userInfo.nickName,
            title: '色卡分享',
            description: 'description',
            time: '2020.1.1',
            imgInfo: {
              tempFilePath: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
              width: 40,
              height: 30,
            },
            bgColor: '#c00',
          }
          this.setData({
            template: new pixelCardTheme0().palette(data1),
          });
        case '9':
          const data4 = {
            avatar: userInfo.avatarUrl,
            qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            name: userInfo.nickName,
            title: '程小元像素画',
            description: 'description',
            time: '2020.1.1',
            imgInfo: {
              tempFilePath: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
              width: 40,
              height: 30,
            },
            bgColor: '#fff',
          }
          this.setData({
            template: new pixelCardTheme1().palette(data4),
          });
          break;
        case '10':
          this.setData({
            template: new themeText().palette()
          })
          break;
        case '11':
          getTempFileURL([
            getImagePath('/home/logo-text.png'),
            getImagePath('/home/gongzhonghao_qrcode.jpeg'),
            getImagePath('/home/IMG_3740.JPG'),
          ]).then((imageRes) => {
            console.log(imageRes.fileList) 

            const aa = {
              logoText: imageRes.fileList[0].tempFileURL,
              logo: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
              avatar: userInfo.avatarUrl,
              name: userInfo.nickName,
              title: '请长按下方二维码',
              subTitle: 'geziabb123',
              qrcode: imageRes.fileList[1].tempFileURL,
              fingerprint: imageRes.fileList[2].tempFileURL,
              description: '添加微信时请说明来意'
            } 
            this.setData({
              template: new qrcodeTheme().palette(aa)
            })
          })
          break;
        case '12':
          getTempFileURL([
            getImagePath('/home/logo-text.png'),
            getImagePath('/home/gongzhonghao_qrcode.jpeg'),
          ]).then((imageRes) => {
            console.log(imageRes.fileList) 

            const a12 = {
              logoText: imageRes.fileList[0].tempFileURL,
              avatar: userInfo.avatarUrl,
              name: '学号：08-2131-Bb',
              title: '名称：线稿临摹',
              subTitle: '主讲老师：走尺',
              time: '时间：2020.07.15',
              imgInfo: [{
                width: 1000,
                height: 1000,
                path: 'https://wx3.sinaimg.cn/mw690/9f7ff7afly1ggrkqk8n3pj20rs0rsn5v.jpg',
                colors: []
              }, {
                width: 1000,
                height: 1000,
                path: 'https://wx4.sinaimg.cn/mw690/9f7ff7afly1ggrkqkb925j20rs0rsgpl.jpg',
                colors: []
              }, {
                width: 1000,
                height: 1000,
                path: 'https://wx3.sinaimg.cn/mw690/9f7ff7afly1ggrkqkbgsjj20rs0rsq91.jpg',
                colors: []
              }],
              description: '加油⛽️'
            } 
            this.setData({
              template: new theme12().palette(a12)
            })
          })
          break;
        default:
          break;
      }
    },
  }
})