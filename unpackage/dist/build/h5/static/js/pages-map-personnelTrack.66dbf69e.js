(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-map-personnelTrack"],{"0119":function(n,t,e){var a=e("24fb");t=a(!1),t.push([n.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 页面左右间距 */\r\n/* 颜色变量 */\r\n/*文字颜色*/\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.server-place[data-v-24a383f6]{position:fixed;left:0;top:0;height:100vh;width:100%;background:#fff}.server-place .icon-img[data-v-24a383f6]{width:36px;height:36px;display:block;position:fixed;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);margin-top:-70px}',""]),n.exports=t},"48b6":function(n,t,e){var a=e("0119");"string"===typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);var r=e("4f06").default;r("025bf616",a,!0,{sourceMap:!1,shadowMode:!1})},"54f8":function(n,t,e){"use strict";e.r(t);e("a4d3"),e("e01a"),e("d28b"),e("e260"),e("d3b7"),e("3ca3"),e("ddb0"),e("a630"),e("fb6a"),e("25f0");function a(n,t){(null==t||t>n.length)&&(t=n.length);for(var e=0,a=new Array(t);e<t;e++)a[e]=n[e];return a}function r(n,t){if(n){if("string"===typeof n)return a(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);return"Object"===e&&n.constructor&&(e=n.constructor.name),"Map"===e||"Set"===e?Array.from(e):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?a(n,t):void 0}}function i(n){if("undefined"===typeof Symbol||null==n[Symbol.iterator]){if(Array.isArray(n)||(n=r(n))){var t=0,e=function(){};return{s:e,n:function(){return t>=n.length?{done:!0}:{done:!1,value:n[t++]}},e:function(n){throw n},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i,o=!0,l=!1;return{s:function(){a=n[Symbol.iterator]()},n:function(){var n=a.next();return o=n.done,n},e:function(n){l=!0,i=n},f:function(){try{o||null==a["return"]||a["return"]()}finally{if(l)throw i}}}}e.d(t,"default",(function(){return i}))},"64de":function(n,t,e){"use strict";var a=e("ee27");e("d81d"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(e("54f8")),i={props:{tipText:{type:String,default:"选择位置"},descText:{type:String,default:"使用当前定位或在地图上标记位置"}},data:function(){return{center:{lng:109.45744048529967,lat:36.49771311230842},zoom:6,pointList:[{lng:"108.49926175379778",lat:"36.60449676862417",name:"张三",uid:"1"},{lng:"107.59926175379778",lat:"36.40449676862417",name:"李四",uid:"2"},{lng:"109.79926175379778",lat:"36.50449676862417",name:"王五",uid:"3"},{lng:"109.63926175379778",lat:"36.52449676862417",name:"王五",uid:"3"},{lng:"109.55926175379778",lat:"36.53449676862417",name:"王五",uid:"3"},{lng:"109.74926175379778",lat:"36.65449676862417",name:"王五",uid:"3"}],pointTrackList:[],personnelList:[{name:"张三",id:"1"},{name:"李四",id:"3"},{name:"王五",id:"5"}],modalName:null,radio:"",itemName:"",date:"",personnelName:"",personnelId:""}},mounted:function(){},onLoad:function(){var n=new Date;this.date=n.getFullYear()+"-"+(n.getMonth()+1)+"-"+n.getDate(),uni.setNavigationBarColor({frontColor:"#000000",backgroundColor:"#ffffff"}),uni.setNavigationBarTitle({title:"人员轨迹"});var t=uni.getStorageSync("userInfo");t||uni.navigateTo({url:"../../pages/login/login"})},methods:{handler:function(n){n.BMap,n.map},showModal:function(n){this.modalName=n.currentTarget.dataset.target},hideModal:function(n){this.modalName=null},RadioChange:function(n){this.radio=n.detail.value,this.personnelName=this.personnelList[n.detail.value].name,this.personnelId=this.personnelList[n.detail.value].id},DateChange:function(n){this.date=n.detail.value},getPersonnelTrack:function(){var n=this;uni.request({url:this.websiteUrl+"api/getPersonnelTrackData",method:"POST",data:{personnelId:this.personnelId,date:this.date},header:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"},success:function(t){console.log(t.data),n.pointList=t.data.data;var e,a=new BMap.Icon("../../static/img/map/mark.png",new BMap.Size(32,32)),i=(0,r.default)(n.pointList);try{for(i.s();!(e=i.n()).done;){var o=e.value,l=new BMap.Point(o.lng,o.lat);n.pointTrackList.push(l)}}catch(d){i.e(d)}finally{i.f()}var s=new BMap.Marker(n.pointTrackList[0],{icon:a});map.addOverlay(s);var u=new BMap.Marker(n.pointTrackList[n.pointTrackList.length-1],{icon:a});map.addOverlay(u);var c=new BMap.Polyline(n.pointTrackList,{strokeColor:"blue",strokeWeight:6,strokeOpacity:.5});map.addOverlay(c)},fail:function(){},complete:function(){}})}}};t.default=i},"6a6d":function(n,t,e){"use strict";var a=e("48b6"),r=e.n(a);r.a},d0f5:function(n,t,e){"use strict";e.r(t);var a=e("64de"),r=e.n(a);for(var i in a)"default"!==i&&function(n){e.d(t,n,(function(){return a[n]}))}(i);t["default"]=r.a},f5b3:function(n,t,e){"use strict";var a,r=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",{staticClass:"server-place"},[e("v-uni-form",[e("v-uni-view",{staticClass:"cu-form-group margin-top"},[e("v-uni-view",{staticClass:"title"},[n._v("姓名")]),e("v-uni-input",{attrs:{placeholder:"输入姓名",name:"personnelName","data-target":"RadioModal"},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.showModal.apply(void 0,arguments)}},model:{value:n.personnelName,callback:function(t){n.personnelName=t},expression:"personnelName"}}),e("v-uni-view",{staticClass:"title"},[n._v("日期")]),e("v-uni-picker",{attrs:{mode:"date",value:n.date,start:"2015-09-01",end:"2020-09-01"},on:{change:function(t){arguments[0]=t=n.$handleEvent(t),n.DateChange.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"picker"},[n._v(n._s(n.date))])],1),e("v-uni-button",{staticClass:"cu-btn bg-green shadow",on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.getPersonnelTrack.apply(void 0,arguments)}}},[n._v("确定")])],1)],1),e("v-uni-view",{staticClass:"server-place"},[e("baidu-map",{staticStyle:{height:"100%"},attrs:{center:n.center,zoom:n.zoom,"scroll-wheel-zoom":!0},on:{ready:function(t){arguments[0]=t=n.$handleEvent(t),n.handler.apply(void 0,arguments)}}})],1)],1)},i=[];e.d(t,"b",(function(){return r})),e.d(t,"c",(function(){return i})),e.d(t,"a",(function(){return a}))},f823:function(n,t,e){"use strict";e.r(t);var a=e("f5b3"),r=e("d0f5");for(var i in r)"default"!==i&&function(n){e.d(t,n,(function(){return r[n]}))}(i);e("6a6d");var o,l=e("f0c5"),s=Object(l["a"])(r["default"],a["b"],a["c"],!1,null,"24a383f6",null,!1,a["a"],o);t["default"]=s.exports}}]);