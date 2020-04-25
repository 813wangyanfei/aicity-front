/**
 * 百度地图工具类
 * 必须在地图实例化之后调用
 * @author
 */
map_tool = {
		settings:{
			map:{},
			data_status:true,
			datas:[],//原始数据集合
			filter_datas:[],//过滤后的轨迹集合
			section_datas:[],//速度数据区间,二维数组
			trajectory_load:true,
			trajectory_list_element:"trajectory_list",
			base_path:"",
			play_speed:10,
			icons:{icon_car:"/img/personnel/person_map.png",icon_start:"/img/track/map_start.png",icon_end:"/img/track/map_end.png"},
			info_window_template:"",
			info_window_options:{width:400,height:180,enableMessage:true},
			_car_id_string:"",//车牌号
			_current_marker:{},//当前标注
			_current_info_window:{},//当前窗口
			_current_label:{},//当前label
			_play_datas:{  //播放相关参数
				_timeout_timmer:{},
				_current_index:0,
				_play_state:1,// 1.播放0.停止播放
			},
		},
		sendLog:function(t, v){//前台，控制台输入打印数据
	        console.log(t, v);
	    },
		/**
		 * 初始化方法,传入settings参数，绘制轨迹路线，加载轨迹信息
		 * @param options
		 */
		init:function(options){
			$.extend(this.settings,options);//补充替换值
			if (this.settings.trajectory_load) {
				this.init_trajectory_list();//将轨迹信息，加载到查看数据层上
			}
			if (this.settings.datas!=undefined&&this.settings.datas.length>=2) {
				this._filter_datas();//轨迹点数据过滤
				if(this.settings.filter_datas.length<1){//如果轨迹点过滤之后的长度小于10，则提示车辆未移动
					this.settings.data_status=false;
					return;
				}else{
					this.settings.data_status=true;
				}
				this._smooth_trajectory();//平滑处理轨迹
				this._disconnect_speed_array();//把数组拆分成不同的区间
				this._draw_Line();//根据不同的速度区间绘制不同颜色线条
				this._create_start_end_icon();//创建起点终点坐标图片,和起始点车辆信息查看窗口
			}
		},//重新点击按钮查询轨迹信息时，将过滤后的轨迹集合和速度区间集合制空，重新填充数据
		destroy:function(){
			this.settings.filter_datas=[];
			this.settings.section_datas=[];
		},
		/**
		 * 开始播放轨迹
		 */
		start:function(){
			this.sendLog("%o","----- 开始播放轨迹 -----");
			this.settings._play_datas._play_state=1;//播放状态改为1，播放
			this.settings._play_datas._timeout_timmer = setTimeout("startPlay()",getPlaySpeed());
		},
		/**
		 * 暂停播放轨迹
		 */
		pause:function(){
			this.sendLog("%o","----- 暂停播放轨迹 -----");
			clearTimeout(this.settings._play_datas._timeout_timmer);
			this.settings._play_datas._play_state=0;//播放状态改为0,停止播放
		},
		/**
		 * 停止播放轨迹
		 */
		stop:function(){
			this.sendLog("%o","----- 停止播放轨迹 -----");
			clearTimeout(this.settings._play_datas._timeout_timmer);
			// 索引清零
			this.settings._play_datas._current_index=0;
			this.settings._play_datas._play_state=0;//播放状态改为0,停止播放
			// 清除marker和infoWindow
			// 重新创建起点的marker和infoWindow
		},
		//将轨迹信息加载到轨迹数据层上
		init_trajectory_list:function(){
			$("#tarckData").html("");//先将层上数据清空
			var table = $("<table class=\"table table-hover\"></table>");
			table.append("<tr><th style=\"vertical-align: middle !important;text-align: center;\">时间</th><th style=\"vertical-align: middle !important;text-align: center;\">速度</th><th style=\"vertical-align: middle !important;text-align: center;\">位置</th></tr>");
			for(var i=0;i<this.settings.datas.length;i++){
				var tr = $("<tr></tr>");
				var time = $("<td nowrap='nowrap'></td>").html(this.settings.datas[i].reciveTime);
				var speed = $("<td></td>").html(this.settings.datas[i].speed+"KM/H");
				var position = $("<td></td>").html(this.settings.datas[i].position);
				
				table.append(tr.append(time).append(speed).append(position));
			}
			$(".trajectory_list").append(table);
		},
		/**
		 * 获取当前展示的信息窗口
		 */
		getCurrentInfoWindow:function(){},
		/**
		 * 获取当前显示的标注
		 */
		getCurrentMarker:function(){},
		/**
		 * 设置播放速度
		 * @param speed
		 */
		setPlaySpeed:function(speed){
			this.settings.play_speed=speed;
		},
		/**
		 * 根据不同的速度区间绘制不同颜色线条
		 */
		_draw_Line:function(){
			this._map_clear_overlays();//清除所有的覆盖物
			var _map = this.settings.map;
			var _speed_array = this.settings.section_datas;//速度区间数据集合
			console.log("speedArray:"+_speed_array)
			for(var i=0;i<_speed_array.length;i++){
				var points = new Array();
				var speeds = _speed_array[i];
				for(var j=0;j<speeds.length;j++){
					if(speeds[j].bdLng.length < 8 ){
						continue;
					}
					points[points.length] = new BMap.Point(speeds[j].bdLng,speeds[j].bdLat);
				}
				var polyline = new BMap.Polyline(points, {strokeColor:this._get_speed_section_color(speeds[0].speed), strokeWeight:5, strokeOpacity:0.7});
				_map.addOverlay(polyline);//添加绘制好的速度区间线
			}
		},
		/**
		 * 创建marker
		 */
		_create_marker:function(lng,lat,data,icon){
			this.sendLog("%o","----- 开始创建marker -----");
			var _map = this.settings.map;
			var _base_path = this.settings.base_path;
			var pt = new BMap.Point(lng, lat);
			var myIcon = new BMap.Icon(icon,new BMap.Size(42, 64));
			var marker = new BMap.Marker(pt, {
				icon : myIcon
			});
			marker.setRotation(data.degree);
			_map.addOverlay(marker); // 将标注添加到地图中
			
			return marker;
		},//加载车辆或人员信息窗口
		_create_info_window:function(lng,lat,data){
			this.sendLog("%o","----- 开始创建infoWindow -----");
			var _template = this.settings.info_window_template;
			var point = new BMap.Point(data.bdLng, data.bdLat);
			var content = content_template.format(this.settings._car_id_string, data.deviceId, data.speed, '',
					data.reciveTime, data.position, parseFloat(data.bdLng).toFixed(4), parseFloat(data.bdLat).toFixed(4));
			var infoWindow = new BMap.InfoWindow(content,this.settings.info_window_options);  // 创建信息窗口对象 
			map.openInfoWindow(infoWindow,point); //开启信息窗口
			
			return infoWindow;
		},//创建label
		_create_label:function(data){
			this.sendLog("%o","----- 开始创建车辆信息提示框label -----");
			var position;
			if( data.position.length>30){
				position=data.position.substring(0,30)+"<br/>&nbsp;&nbsp;&nbsp;&nbsp;"+data.position.substring(30);
			}else{
				position=data.position;
			}
			var content = content_template.format(this.settings._car_id_string, data.deviceId, data.speed, '',
				data.reciveTime, position, parseFloat(data.bdLng).toFixed(4), parseFloat(data.bdLat).toFixed(4));
			var label = new BMap.Label(content, {offset: new BMap.Size(-200, -240)});  // 创建信息窗口对象
			var temp_marker=this.settings._current_marker;
			temp_marker.setLabel(label);
			return label;
		},
		/**
		 * 创建起点终点坐标图片以及信息窗口
		 */
		_create_start_end_icon:function(){
			this.sendLog("%o","----- 开始创建起始点坐标图 -----");
			var _datas = this.settings.filter_datas;
			var _map = this.settings.map;
			var icon_start = this.settings.base_path+this.settings.icons.icon_start;//得到轨迹起点图片
			var icon_end = this.settings.base_path+this.settings.icons.icon_end;//得到轨迹终点图片
			
			if (_datas==undefined||_datas.length<=2) {
				return;
			}
			var startNode = _datas[0];
			var endNode = _datas[_datas.length-1];
			//_map.addOverlay(new BMap.Marker(new BMap.Point(startNode.bdLng, startNode.bdLat),{icon:new BMap.Icon(icon_start,new BMap.Size(32, 50))}));//起点图片
			_map.addOverlay(new BMap.Marker(new BMap.Point(endNode.bdLng, endNode.bdLat),{icon:new BMap.Icon(icon_end,new BMap.Size(32, 50))}));// 终点图片
			
			// 创建起点小车
			this.settings._current_marker = this._create_marker(startNode.bdLng, startNode.bdLat, startNode, this.settings.base_path+this.settings.icons.icon_car);
			//--------------------窗口跟着车辆走，修改此地方
			//this.settings._current_info_window = this._create_info_window(startNode.bdLng, startNode.bdLat, startNode);//轨迹信息窗口
			//创建label信息窗口
			this.settings._current_label=this._create_label(startNode);
			this.sendLog("%o","----- 创建起始点坐标图完成 -----");
		},
		/**
		 * 轨迹点数据过滤
		 */
		_filter_datas:function(){
			this.sendLog("%o","----- 开始过滤轨迹点数据 数据长度:"+this.settings.datas.length);
			var datas = this.settings.datas;//传递过来的后台查询出来的，未过滤的轨迹数据集合
			this.settings.filter_datas.length = 0;
			var filter_datas = this.settings.filter_datas;//过滤后的数据集合变量
			for(var i=0;i<datas.length;i++){
				var data = datas[i];
				if(i+2>=datas.length)continue;
				// 过滤距离太近的数据
				if(this._get_disance(datas[i].bdLng,datas[i].bdLat,datas[i+1].bdLng,datas[i+1].bdLat)<5){
					continue;
				}
				// 过滤距离太远的数据(2KM)
				if(this._get_disance(datas[i].bdLng,datas[i].bdLat,datas[i+1].bdLng,datas[i+1].bdLat)>2000){
					continue;
				}
				
				filter_datas[filter_datas.length] = data;//将过滤后的数据，存储到filter_datas中
			}
			this.sendLog("%o","----- 过滤轨迹点数据完成 剩余轨迹长度:"+this.settings.filter_datas.length);
		},
		/**
		 * 平滑处理轨迹
		 */
		_smooth_trajectory:function(){
			this.sendLog("%o","----- 开始平滑处理轨迹 数据长度:"+this.settings.filter_datas.length);
			var _filter_datas = this.settings.filter_datas;//过滤后的数据集合
			var _smooth_datas = new Array();
			for(var i=0;i<_filter_datas.length;i++){
				var data = _filter_datas[i];
				var data1 = _filter_datas[i+1];
				
				_smooth_datas[_smooth_datas.length]=data;
				
				if(i+2>=_filter_datas.length)continue;
				
				var _disance = this._get_disance(data.bdLng,data.bdLat,data1.bdLng,data1.bdLat);//两点之间的距离
				if(_disance>10){//两个经纬度之间的距离大于10m时，进行两点之间轨迹处理（插入多个轨迹点）
					var temps = this._get_middle_points({lng:data.bdLng,lat:data.bdLat},{lng:data1.bdLng,lat:data1.bdLat},Math.floor(_disance/5));//Math.floor() 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数。
					
					for(var j=0;j<temps.length;j++){
						if(temps[j].lng>0&&temps[j].lat>0){
							//ljh 添加position 
							var temp = {bdLng:temps[j].lng,bdLat:temps[j].lat,degree:data1.degree,speed:data1.speed,position:data1.position,oill:'',reciveTime:data1.reciveTime,deviceId:data1.deviceId};
							_smooth_datas[_smooth_datas.length]=temp;
						}
					}
				}
			}
			this.settings.filter_datas = _smooth_datas;
			this.sendLog("%o","----- 结束平滑处理轨迹 数据长度:"+this.settings.filter_datas.length);
		},
		/**
		 * 把数组拆分成不同的速度区间
		 */
		_disconnect_speed_array:function(){
			this.sendLog("%o","----- 开始拆分不同的速度区间 原始数据长度:"+this.settings.filter_datas.length);
			var _cache = new Array();
			var speed_array = this.settings.section_datas;//拆分好的速度区间数据
			var _datas = this.settings.filter_datas;//过滤好的数据赋值给datas
			for(var i=0;i<_datas.length;i++){// 长度 671 
				var _data = _datas[i];
				if(_cache.length<=0)
					_cache[_cache.length]=_datas[i];
				else{
					// 判断是否在一个区间内
					if(this._get_speed_section(_data.speed)==this._get_speed_section(_cache[_cache.length-1].speed))
						_cache[_cache.length]=_datas[i];
					else{
						speed_array[speed_array.length] = _cache;
						_cache = new Array();
						//_cache[0]=_datas[i-1];
						_cache[0]=_data;
					}
				}
			}
			speed_array[speed_array.length] = _cache;
			this.sendLog("%o","----- 拆分速度区间完成 拆分数组长度:"+this.settings.section_datas.length);
			console.log("%o",this.settings.section_datas);
		},
		/**
		 * 获取速度区间
		 * @param speed
		 * @returns {Number}
		 */
		_get_speed_section:function(speed){
			if(speed>=0&&speed<60)
				return 0;
			if(speed>=60&&speed<90)
				return 1;
			if(speed>=90&&speed<120)
				return 2;
			if(speed>=120)
				return 3;
		},
		/**
		 * 获取速度区间对应的颜色
		 * @param speed
		 * @returns {String}
		 */
		_get_speed_section_color:function(speed){
			//return getColorSpeed(speed);

			switch(getSpeedSection(speed)){
				case 0:
					return "#0101FF";
					break;
				case 1:
					return "#007E00";
					break;
				case 2:
					return "#FFFF00";
					break;
				case 3:
					return "#FF0101";
					break;
				default:
					return "blue";
			}
		},
		_get_disance_to_rad:function(d){
			return d * Math.PI / 180;
		},
		/**
		 * 计算两点间距离（计算两个经纬度之间的距离）
		 * @author
		 * @param lng 经度
		 * @param lat 纬度
		 * @return Number 单位米
		 */
		_get_disance:function(lng1,lat1,lng2,lat2) {
		    var dis = 0;
		    var radLat1 = this._get_disance_to_rad(lat1);
		    var radLat2 = this._get_disance_to_rad(lat2);
		    var deltaLat = radLat1 - radLat2;//经度间距离
		    var deltaLng = this._get_disance_to_rad(lng1) - this._get_disance_to_rad(lng2);//纬度间距离
		    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
		    return dis * 6378137;
		},
		/**
		 * 计算两点之间所有的坐标点
		 * @param start 开始点坐标
		 * @param end 结束点坐标
		 * @param count 分成多少份
		 */
		_get_middle_points:function(p1,p2,count){
			var points = new Array();
			var lngs = new Array();
			var lats = new Array();
			for(var i=0;i<=count;i++){
				lngs[lngs.length] = Math.abs((p1.lng-p2.lng)/count*i);
				lats[lats.length] = Math.abs((p1.lat-p2.lat)/count*i);
			}
			
			for(var i=0;i<=count;i++){
				var point = {};
				if(p1.lng>=p2.lng&&p1.lat<=p2.lat){
					point.lng=+p1.lng-lngs[i];
					point.lat=+p1.lat+lats[i];
				}
				if(p1.lng<p2.lng&&p1.lat>p2.lat){
					point.lng=p1.lng+lngs[i];
					point.lat=p1.lat-lats[i];
				}
				if(p1.lng>=p2.lng&&p1.lat>=p2.lat){
					point.lng = +p2.lng+lngs[i];
					point.lat = +p2.lat+lats[i];
				}
				if(p1.lng<p2.lng&&p1.lat<p2.lat){
					point.lng = +p2.lng-lngs[i];
					point.lat = +p2.lat-lats[i];
				}
				if(p2.lng>=p1.lng&&p2.lat>=p1.lat){
					point.lng = +p1.lng+lngs[i];
					point.lat = +p1.lat+lats[i];
				}
				if(p2.lng<p1.lng&&p2.lat<p1.lat){
					point.lng = +p1.lng-lngs[i];
					point.lat = +p1.lat-lats[i];
				}
				points[points.length] = point;
			}
			return points;
		},
		/**
		 * 清除地图上全部的覆盖物
		 */
		_map_clear_overlays:function(){
			this.settings.map.clearOverlays();
		},
		/**
		 * 移除指定的覆盖物
		 * @param node
		 */
		_map_remove_overlays:function(node){
			this.settings.map.removeOverlay(node);
		}
};

/**
 * 创建小人图标
 * @author
 */
function createMarker(lng,lat,data){
	var pt = new BMap.Point(lng, lat);
	var myIcon = new BMap.Icon("/img/personnel/person_map.png",
			new BMap.Size(42, 64));
	var marker = new BMap.Marker(pt, {
		icon : myIcon
	});
	marker.setRotation(data.degree);
	return marker;
}

function createPoint(lng, lat, map, data) {
	// 创建小人
	var pt = new BMap.Point(lng, lat);
	var myIcon = new BMap.Icon("/img/personnel/person_map.png",
			new BMap.Size(42, 64));
	var marker = new BMap.Marker(pt, {
		icon : myIcon
	});
	marker.setRotation(data.degree);
	map.addOverlay(marker); // 将标注添加到地图中
	var content = content_template.format(data.name, data.deviceId, data.speed, '',
			data.updateTime, data.position, data.bdlng, data.bdlat);
	// 添加click事件监听
	marker.addEventListener("click",function(e){
		createInfoWindow(map, lng, lat,content);
	});
	createInfoWindow(map, lng, lat,content);
	
	return marker;
}

/**
 * 创建infoWindow窗口
 * @param map
 * @param lng
 * @param lat
 */
function createInfoWindow(map,lng,lat,content){
	var opts = {width:400,height:180,enableMessage:true};
	var point = new BMap.Point(lng, lat);
	var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
	map.openInfoWindow(infoWindow,point); //开启信息窗口
	
	return infoWindow;
}

function getInfoWindow(content){
	return new BMap.InfoWindow(content,{width:400,height:180,enableMessage:true});
}

function getColorSpeed(speed){
	//var 百分之一 = (单色值范围) / 50;  单颜色的变化范围只在50%之内
	var one = (255+255) / 100;
	var r=0;
	var g=0;
	var b=0;

	if ( speed <= 60 ) {  //蓝色渐变  速度小于60
		// 比例小于50的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.
		r = 0;
		g = 0;
		b = speed * 4.25;
	}
	if ( speed > 60 && speed <= 90 ) {  //蓝色到绿色渐变
		// 比例大于50的时候绿色是越来越少的,直到0 变为纯红
		b =  255 - 255/90*speed;
		g = speed * 2.8;
		r = 0;
	}
	if ( speed > 90 && speed <= 120 ) {  //绿色到黄色渐变
		// 比例大于50的时候绿色是越来越少的,直到0 变为纯红
		b =  0;
		g = 255 - ( (speed - 70 ) * one);
		r = 255 - 255/120*speed;
	}
	if ( speed > 120 ) {  //蓝色到绿色渐变
		// 比例大于50的时候绿色是越来越少的,直到0 变为纯红
		b =  0;
		g = 0;
		r = 255;
	}
	r = parseInt(r);// 取整
	g = parseInt(g);// 取整
	b = parseInt(b);// 取整

	//console.log("#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2));
	//return "#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2);
	//console.log("rgb("+r+","+g+","+b+")" );
	return "rgb("+r+","+g+","+b+")";
}