var data=[['数理科学部','教育部',4830,15],['化学科学部','教育部',4200,12],
['生命科学部','教育部',2800,8],['地球科学部','教育部',2800,8],
['工程与材料科学部','教育部',7700,22],['信息科学部','教育部',5950,17],
['管理科学部','教育部',1470,6],['医学科学部','教育部',3850,5],
['数理科学部','中国科学院',2345,7],['化学科学部','中国科学院',3850,11],
['生命科学部','中国科学院',3500,10],['地球科学部','中国科学院',3150,9],
['工程与材料科学部','中国科学院',2450,7],['信息科学部','中国科学院',2100,6],
['管理科学部','中国科学院',245,1],['医学科学部','中国科学院',1750,5],
['数理科学部','工,交,农,医,国防等部门',350,1],['化学科学部','工,交,农,医,国防等部门',0,0],
['生命科学部','工,交,农,医,国防等部门',700,2],['地球科学部','工,交,农,医,国防等部门',1050,3],
['工程与材料科学部','工,交,农,医,国防等部门',2100,6],['信息科学部','工,交,农,医,国防等部门',1050,3],
['管理科学部','工,交,农,医,国防等部门',0,0],['医学科学部','工,交,农,医,国防等部门',1400,4],
['数理科学部','各省,自治区,市(直)',595,2],['化学科学部','各省,自治区,市(直)',2450,7],
['生命科学部','各省,自治区,市(直)',1750,5],['地球科学部','各省,自治区,市(直)',350,1],
['工程与材料科学部','各省,自治区,市(直)',1050,3],['信息科学部','各省,自治区,市(直)',1050,3],
['管理科学部','各省,自治区,市(直)',0,0],['医学科学部','各省,自治区,市(直)',1400,4],
];

var color ={"信息科学部":"#3366CC", "工程与材料科学部":"#DC3912",  "数理科学部":"#FF9900", "生命科学部":"#109618",
			"地球科学部":"#990099", "化学科学部":"#0099C6",'管理科学部':"#000000",'医学科学部':"#CC6633"};
var svg3 = d3.select("#back-facing3").append("svg").attr("width", 1300).attr("height", 800);

var tooltip3 =d3.select("body").append("div").attr("class","tooltip").style("opacity",0.0);

svg3.append("text").attr("x",290).attr("y",60)
	.attr("class","header").text("资助情况-金额");
	
svg3.append("text").attr("x",890).attr("y",60)
	.attr("class","header").text("资助情况-项数");

var g =[svg3.append("g").attr("transform","translate(250,100)")
		,svg3.append("g").attr("transform","translate(850,100)")];

var bp=[ viz.bP()
		.data(data)
		.min(12)
		.pad(1)
		.height(600)
		.width(200)
		.barSize(35)
		.fill(d=>color[d.primary])		
	,viz.bP()
		.data(data)
		.value(d=>d[3])
		.min(12)
		.pad(1)
		.height(600)
		.width(200)
		.barSize(35)
		.fill(d=>color[d.primary])
];
		
[0,1].forEach(function(i){
	g[i].call(bp[i])
	
	g[i].append("text").attr("x",15).attr("y",-8).style("text-anchor","middle").text("教育部");
	g[i].append("text").attr("x", 200).attr("y",-8).style("text-anchor","middle").text("单位隶属关系");
	
	g[i].selectAll(".mainBars")
		.on("mouseover",mouseover)
		.on("mouseout",mouseout);

	g[i].selectAll(".mainBars").append("text").attr("class","label")
		.attr("x",d=>(d.part=="primary"? -30: 30))
		.attr("y",d=>+6)
		.text(d=>d.key)
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
	
	g[i].selectAll(".mainBars").append("text").attr("class","perc")
		.attr("x",d=>(d.part=="primary"? -130: 30))
		.attr("y",d=>(d.part=="primary"? +6:25))
		.text(function(d){ return d3.format("0.0%")(d.percent)})
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
});

function mouseover(d){
	tooltip3.html("资助情况:"+d.value)
		.style("left", (d3.event.pageX) + "px")	
		.style("top", (d3.event.pageY + 20) + "px")
		.style("opacity",1.0);
	[0,1].forEach(function(i){
		bp[i].mouseover(d);
		g[i].selectAll(".mainBars").select(".perc")
		.text(function(d){ return d3.format("0.0%")(d.percent)});
	});
}
function mouseout(d){
	tooltip3.style("opacity",0.0);
	[0,1].forEach(function(i){
		bp[i].mouseout(d);
		g[i].selectAll(".mainBars").select(".perc")
		.text(function(d){ return d3.format("0.0%")(d.percent)});
	});
}
d3.select(self.frameElement).style("height", "800px");
