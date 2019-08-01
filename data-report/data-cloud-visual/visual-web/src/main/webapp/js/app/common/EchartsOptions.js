var EchartsOptions = {
	line : function(chart) {
		var option = {
			backgroundColor : chart.bgColor != undefined ? chart.bgColor : '#FFF',
			tooltip : {
				trigger : 'axis'
			},
			legend : {
				show : chart.legend.show != undefined ? chart.legend.show
						: true,
				data : chart.legend.data,
				left : chart.legend.location != undefined ? chart.legend.location : 'center',
				top : 20,
				textStyle : {
					fontFamily : chart.legend.fontFamily != undefined ? chart.legend.fontFamily : 'sans-serif',
	            	fontSize : chart.legend.fontSize != undefined ? chart.legend.fontSize : 12,
        			color: chart.legend.color != undefined ? chart.legend.color : '#333'
				}
			},
			grid : {
				left : '3%',
				right : '4%',
				bottom : '3%',
				containLabel : true
			},
		    color: chart.color != undefined ? chart.color : ['#8ec8fd','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
//			toolbox : {
//				feature : {
//					saveAsImage : {}
//				}
//			},
			xAxis : {
				show : chart.xAxis.show != undefined ? chart.xAxis.show : true,
				splitLine : {
					show : chart.xAxis.splitLine != undefined ? chart.xAxis.splitLine
							: false
				},
		        axisTick :{
		            show : false
		        },
		        axisLine :{
		            show : false,
		        },
		        axisLabel:{
		        	textStyle:{
		            	fontFamily : chart.xAxis.fontFamily != undefined ? chart.xAxis.fontFamily : 'sans-serif',
		            	fontSize : chart.xAxis.fontSize != undefined ? chart.xAxis.fontSize : 12,
            			color: chart.xAxis.color != undefined ? chart.xAxis.color : '#333'
		            }
	            },
				type : 'category',
				data : chart.xAxis.data
			},
			yAxis : {
				show : chart.yAxis.show != undefined ? chart.yAxis.show : true,
				splitLine : {
					show : chart.yAxis.splitLine != undefined ? chart.yAxis.splitLine
							: true
				},
		        axisTick :{
		            show : false
		        },
		        axisLine :{
		            show : false,
		        },
		        axisLabel:{
		        	textStyle:{
		            	fontFamily : chart.yAxis.fontFamily != undefined ? chart.yAxis.fontFamily : 'sans-serif',
		            	fontSize : chart.yAxis.fontSize != undefined ? chart.yAxis.fontSize : 12,
            			color: chart.yAxis.color != undefined ? chart.yAxis.color : '#333'
		            }
	            },
				type : 'value'
			},
			series : chart.series
		};
		return option;
	},
	bar : function(chart) {
		var option = {
			backgroundColor : chart.bgColor != undefined ? chart.bgColor : '#FFF',
			tooltip : {
				trigger : 'axis',
			},
			legend : {
				show : chart.legend.show != undefined ? chart.legend.show
						: true,
				data : chart.legend.data,
				left : chart.legend.location != undefined ? chart.legend.location : 'center',
				top : 20,
				textStyle : {
					fontFamily : chart.legend.fontFamily != undefined ? chart.legend.fontFamily : 'sans-serif',
	            	fontSize : chart.legend.fontSize != undefined ? chart.legend.fontSize : 12,
        			color: chart.legend.color != undefined ? chart.legend.color : '#333'
				}
			},
			grid : {
				left : '3%',
				right : '4%',
				bottom : '3%',
				containLabel : true
			},
			color: chart.color != undefined ? chart.color : ['#8ec8fd','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
			xAxis : chart.xAxis,
			yAxis : chart.yAxis,
			series : chart.series
		};
		return option;
	},
	pie : function(chart) {
		var option = {
			backgroundColor : chart.bgColor != undefined ? chart.bgColor : '#FFF',
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			color: chart.color != undefined ? chart.color : ['#8ec8fd','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
			legend : {
				orient : 'vertical',
				left : chart.legend.location != undefined ? chart.legend.location : 'left',
				show : chart.legend.show != undefined ? chart.legend.show : true,
				data : chart.legend.data,
				top : 20				
			},
			series : chart.series
		};
		return option;
	},
	map : function(chart) {
		var option = {
			backgroundColor : chart.bgColor != undefined ? chart.bgColor : '#FFF',
			tooltip : {
				trigger : 'item'
			},
			legend : {
				left : chart.legend.location != undefined ? chart.legend.location : 'left',
				show : chart.legend.show != undefined ? chart.legend.show : true,
				data : chart.legend.data,
				top : 10
			},
			color: chart.color != undefined ? chart.color : ['#8ec8fd','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
			dataRange : {
				show : false,
				min : 0,
				max : (chart.maxData != undefined && chart.maxData != 0) ? chart.maxData : 2500,
				x : 'left',
				y : 'bottom',
				text : [ '高', '低' ], // 文本，默认为数值文本
				calculable : true
			},
			series : chart.series
		};
		return option;
	}
    
}
