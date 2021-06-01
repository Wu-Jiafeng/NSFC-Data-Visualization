var data1=[['数理科学部','高等院校',6020,19],['化学科学部','高等院校',7350,21],
['生命科学部','高等院校',5250,15],['地球科学部','高等院校',3500,10],
['工程与材料科学部','高等院校',10850,31],['信息科学部','高等院校',8050,23],
['管理科学部','高等院校',1715,7],['医学科学部','高等院校',5250,15],
['数理科学部','科研单位',2100,6],['化学科学部','科研单位',3150,9],
['生命科学部','科研单位',3500,10],['地球科学部','科研单位',3850,11],
['工程与材料科学部','科研单位',2450,7],['信息科学部','科研单位',2100,6],
['管理科学部','科研单位',0,0],['医学科学部','科研单位',2100,6],
['数理科学部','其他',1050,3],['化学科学部','其他',0,0],
['生命科学部','其他',0,0],['地球科学部','其他',0,0],
['工程与材料科学部','其他',0,0],['信息科学部','其他',0,0],
['管理科学部','其他',0,0],['医学科学部','其他',1050,3],
];

var color ={"信息科学部":"#3366CC", "工程与材料科学部":"#DC3912",  "数理科学部":"#FF9900", "生命科学部":"#109618",
			"地球科学部":"#990099", "化学科学部":"#0099C6",'管理科学部':"#000000",'医学科学部':"#CC6633"};
var svg3 = d3.select("#back-facing2").append("svg").attr("width", 1300).attr("height", 800);

var tooltip2 =d3.select("body").append("div").attr("class","tooltip").style("opacity",0.0);

svg3.append("text").attr("x",290).attr("y",60)
	.attr("class","header").text("资助情况-金额");
	
svg3.append("text").attr("x",890).attr("y",60)
	.attr("class","header").text("资助情况-项数");

var g1 =[svg3.append("g").attr("transform","translate(250,100)")
		,svg3.append("g").attr("transform","translate(850,100)")];

var cp=[ viz.bP()
		.data(data1)
		.min(12)
		.pad(1)
		.height(600)
		.width(200)
		.barSize(35)
		.fill(d=>color[d.primary])		
	,viz.bP()
		.data(data1)
		.value(d=>d[3])
		.min(12)
		.pad(1)
		.height(600)
		.width(200)
		.barSize(35)
		.fill(d=>color[d.primary])
];
		
[0,1].forEach(function(i){
	g1[i].call(cp[i])
	
	g1[i].append("text").attr("x",15).attr("y",-8).style("text-anchor","middle").text("教育部");
	g1[i].append("text").attr("x", 190).attr("y",-8).style("text-anchor","middle").text("单位性质");
	
	g1[i].selectAll(".mainBars")
		.on("mouseover",mouseover)
		.on("mouseout",mouseout);

	g1[i].selectAll(".mainBars").append("text").attr("class","label")
		.attr("x",d=>(d.part=="primary"? -30: 30))
		.attr("y",d=>+6)
		.text(d=>d.key)
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
	
	g1[i].selectAll(".mainBars").append("text").attr("class","perc")
		.attr("x",d=>(d.part=="primary"? -130: 30))
		.attr("y",d=>(d.part=="primary"? +6:25))
		.text(function(d){ return d3.format("0.0%")(d.percent)})
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
});

function mouseover(d){
	tooltip2.html("资助情况:"+d.value)
		.style("left", (d3.event.pageX) + "px")	
		.style("top", (d3.event.pageY + 20) + "px")
		.style("opacity",1.0);
	[0,1].forEach(function(i){
		cp[i].mouseover(d);
		g1[i].selectAll(".mainBars").select(".perc")
		.text(function(d){ return d3.format("0.0%")(d.percent)});
	});
}
function mouseout(d){
	tooltip2.style("opacity",0.0);
	[0,1].forEach(function(i){
		cp[i].mouseout(d);
		g1[i].selectAll(".mainBars").select(".perc")
		.text(function(d){ return d3.format("0.0%")(d.percent)});
	});
}
d3.select(self.frameElement).style("height", "800px");
