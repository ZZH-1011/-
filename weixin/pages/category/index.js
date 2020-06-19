import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //点击左侧菜单
    currentIndex:0,
    scrollTop:0
    
  },
  Cates:[],

  onLoad: function (options) {
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },

  //获取分类数据
  getCates(){
    request({
      url:"/categories"
    })
    .then(res =>{
      this.Cates=res;

      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
      
      //构造左侧菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧的商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    const {index}=e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
    
  }
})