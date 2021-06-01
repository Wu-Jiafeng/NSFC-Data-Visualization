var width = 700,
	height = 700;
	
var svg = d3.select("#back-facing1").append("svg")
	.attr("width", width)
	.attr("height", height);

var tooltip = d3.select("body")
				.append("div")
				.attr("class","tooltip")
				.style("opacity",0.0);
	
var projection = d3.geoMercator()
						.center([107, 31])
						.scale(600)
    					.translate([width/2, height/2]);
	
var path = d3.geoPath()
				.projection(projection);	

var pro_values = [];
var department_pro=[];
var piepic=svg.append("g").attr('transform', 'translate( 40, 40 )').style("opacity",1.0);
var circle;
var subpiepicid;
			
d3.json("china.topojson",function(error, d){
	if (error) 
		return console.error(error);
	return d
	}).then(function(data) {
	
	//输出china.topojson的对象
	console.log(data);
	
	//将TopoJSON对象转换成GeoJSON，保存在georoot中
	var georoot = topojson.feature(data,data.objects.china);
	
	//输出GeoJSON对象
	console.log(georoot);

	//包含中国各省路径的分组元素
	var china = svg.append("g").style("opacity",1.0);
		
	//添加中国各种的路径元素
	var provinces = china.selectAll("path")
			.data( georoot.features )
			.enter()
			.append("path")
			.attr("class","province")
			.style("fill", "#ccc")
			.attr("d", path )
			.style("opacity",1.0);
	
	d3.json("18杰青资助情况.json",function(d){
		return d
	}).then(function(valuedata){
		//将读取到的数据存到数组pro_values，令其索引号为各省的名称
		for(var i=0; i<valuedata.SumOfProvinces.length; i++){
			var name = valuedata.SumOfProvinces[i].name;
			var item =valuedata.SumOfProvinces[i].SumOfItems;
			var money = valuedata.SumOfProvinces[i].SumOfMoney;
			pro_values[name] = money;
		}

		for(var i=0;i<valuedata.TypeOfDepartment.length;i++){
			var name = valuedata.TypeOfDepartment[i].name;
			var province=valuedata.TypeOfDepartment[i].province;	
			var pprovince=[];
			for(var j=0;j<province.length;j++){
				var pname =province[j].name;
				var pSumOfMoney =province[j].SumOfMoney;
				var pSumOfItems =province[j].SumOfItems;
				pprovince[pname]=pSumOfMoney;
			}
			department_pro[name]=pprovince;
		}

		//求最大值和最小值
		var maxvalue = d3.max(valuedata.SumOfProvinces, function(d){ return d.SumOfMoney; });
		var minvalue = d3.min(valuedata.SumOfProvinces, function(d){ return d.SumOfMoney; });
		//定义一个线性比例尺，将最小值和最大值之间的值映射到[0, 1]
		var linear = d3.scaleLinear()
					.domain([minvalue, maxvalue])
					.range([0, 1]);

		//定义最小值和最大值对应的颜色
		var a = d3.rgb(255,255,0);	//黄色
		var b = d3.rgb(255,0,0);	//红色
	 
		//颜色插值函数
		var computeColor = d3.interpolate(a,b);
		//设定各省份的填充色
		provinces.style("fill", function(d,i){
			var t = linear( pro_values[d.properties.name] );
			var color = computeColor(t);
			if(d.properties.name==="台湾" || d.properties.name==="新疆"|| d.properties.name==="西藏"|| d.properties.name==="青海"||d.properties.name==="云南"||d.properties.name==="贵州" || d.properties.name==="广西"|| d.properties.name==="内蒙古"|| d.properties.name==="宁夏"){
				color="white";
			}
			return color.toString();
		});

		//定义一个线性渐变
		var defs = svg.append("defs");

		var linearGradient = defs.append("linearGradient")
							.attr("id","linearColor")
							.attr("x1","0%")
							.attr("y1","0%")
							.attr("x2","100%")
							.attr("y2","0%");

		var stop1 = linearGradient.append("stop")
					.attr("offset","0%")
					.style("stop-color",a.toString());

		var stop2 = linearGradient.append("stop")
					.attr("offset","100%")
					.style("stop-color",b.toString());

		//添加一个矩形，并应用线性渐变
		var colorRect = china.append("rect")
				.attr("x", 20)
				.attr("y", 490)
				.attr("width", 140)
				.attr("height", 30)
				.style("fill","url(#" + "linearColor" + ")")
				.style("opacity",1.0);

		//添加文字
		var minValueText = china.append("text")
				.attr("class","valueText")
				.attr("x", 20)
				.attr("y", 490)
				.attr("dy", "-0.3em")
				.text(function(){
					return minvalue;
				})
				.style("opacity",1.0);

		var maxValueText = china.append("text")
				.attr("class","valueText")
				.attr("x", 160)
				.attr("y", 490)
				.attr("dy", "-0.3em")
				.text(function(){
					return maxvalue.toString()+"（万元）";
				})
				.style("opacity",1.0);
	
	});

	d3.json("places1.json",function(d){
		return d
	}).then(function(places ) {

		//插入分组元素
		var location = svg.selectAll(".location")
						.data(places.location)
						.enter()
						.append("g")
						.attr("class","location")
						.attr("id",function(d){
							return d.name;
						})
						.attr("transform",function(d){
							//计算标注点的位置
							var coor = projection([d.log, d.lat]);
							return "translate("+ coor[0] + "," + coor[1] +")";
						});

		//插入一个圆
		circle=location.append("circle")
			.data(places.location)
			.attr("r",5)
			.attr("id",function(d){
					return d.name;
				})
			.style("opacity",1.0);
		
		circle.on("mouseover",function(){
			d3.select(this).attr("fill","orange");
			subpiepicid=(this).getAttribute('id');
			tooltip.html(subpiepicid + "的资助总金额为" + "<br />" +   pro_values[subpiepicid] + " 万元")
			.style("left", (d3.event.pageX) + "px")	
			.style("top", (d3.event.pageY + 20) + "px")
			.style("opacity",1.0);
		})
		.on("mousemove",function(d){ 	
			tooltip.style("left", (d3.event.pageX) + "px")			
					.style("top", (d3.event.pageY + 20) + "px");
		})
		.on("mouseout",function(d){
    		tooltip.style("opacity",0.0);
			d3.select(this)
    			.transition()
    			.duration(250)
    			.attr("fill","black");
		})
		.on("click",function(){
			circle.transition().duration(250).style("opacity",0.0).attr("visibility","hidden");
			china.transition().duration(250).style("opacity",0.1);
			subpiepicid=(this).getAttribute('id');
			drawpie(subpiepicid);
		});
	});

	function drawpie(key){
		var dataset=[];
		var i=0;
		for(var dep_key in department_pro){
			dataset[i]={'x':dep_key,'y':department_pro[dep_key][key]};
			i++;
		}
		    //设置饼图的半径
    	let radius = Math.min(width, height) * 0.6 / 2;

    	let arc = d3.arc().innerRadius(70).cornerRadius(10).outerRadius(radius)

    	//饼图与文字相连的曲线起点
    	let pointStart = d3.arc().innerRadius(radius).outerRadius(radius);
    	//饼图与文字相连的曲线终点
    	let pointEnd = d3.arc().innerRadius(radius + 20).outerRadius(radius + 20);

    	let drawData = d3.pie()
    	.value((d)=>d.y)
      	.sort(null)
      	.startAngle(0)
      	.endAngle(Math.PI * 2)
      	.padAngle(0.05)(dataset);

    	let color = d3.scaleOrdinal(d3.schemeCategory10);
    	let subpiepic=piepic.append('g')
    	.attr("id",key)
    	.style("opacity",1.0)
      	.attr('transform', 'translate( ' + radius + ', ' + radius + ' )')
      	.attr('stroke', 'black')
      	.attr('stroke-width', 1)
      	.on("click",function(){
			circle.transition().duration(250).style("opacity",1.0).attr("visibility","visible");
			china.transition().duration(250).style("opacity",1.0);
			let cancelpie=piepic.select("#"+subpiepicid);
			cancelpie.transition().duration(250).style("opacity",0.0);
			cancelpie.remove();
		});
      	
      	let subpiepicpie=subpiepic.selectAll('path')
      	.data(drawData)
      	.enter()
      	.append('path')
		.attr("fill",function(d,i){
			return color(i);
		})
      	.attr('d', function(d) {
        	d.outerRadius = radius;
        	return arc(d);
      	});

      	subpiepicpie.transition()
      	.duration(1000)
      	.attrTween('d', function (d) {
      	//初始加载时的过渡效果
        	let fn = d3.interpolate({endAngle: d.startAngle}, d)
        	return function(t) {
          		return arc(fn(t));
        	}
      	});

    //文字层
    	let sum =pro_values[key];
    	let subpiepictext=subpiepic.selectAll('text')
      	.data(drawData)
      	.enter()
      	.append('text')
      	.attr('transform', function(d) {
      		// arc.centroid(d)将文字平移到弧的中心
        	return 'translate(' + arc.centroid(d) + ') ' +
          	//rotate 使文字旋转扇形夹角一半的位置(也可不旋转)
          	'rotate(' + (-90 + (d.startAngle + (d.endAngle - d.startAngle)/2) * 180 / Math.PI) + ')';
      	})
			//文字开始点在文字中间
      	.attr('text-anchor', 'middle')
			//文字垂直居中
      	.attr('dominant-baseline', 'central')
      	.attr('font-size', '20px')
			//格式化文字显示格式
      	.text(function(d) {
        	return (d.data.y / sum * 100).toFixed(2) + '%';
      	});
      // .attr('rotate', '30') //此设置为设置每个文字中字符的旋转，上面的旋转是以文字为一个整体的旋转

      //图例legend
         let legend=subpiepic
      	.selectAll('g')
      	.data(drawData)
      	.enter()
      	.append('g')
      	.attr('transform', function(d, i) {
        	return 'translate(' + 215 + ',' + (100+(i * 20)) + ')';
      	});

    	legend.append('rect').attr('width', 27).attr('height', 18)
      	.attr("fill",function(d,i){
				return color(i);
			});
    	legend.append('text')
      	.text(function(d) {
        	return (d.data.x)+":"+(d.data.y).toString();
      	})
      	.style('font-size', 12).attr('y', '1em').attr('x', '3em').attr('dy', 3);
	};
});