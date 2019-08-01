var HighchartsOptions = {
	getDateStr :function(day,month,year,date) {
		var dd;
		if(date){
			dd = new Date(Number(date.substring(0,4)),Number(date.substring(4,6)-1),Number(date.substring(6,8)));
		}else{
			dd= new Date(); 
		}
		dd.setDate(dd.getDate()+(day?day:0));
		dd.setMonth(dd.getMonth()+(month?month:0));
		dd.setFullYear(dd.getFullYear()+(year?year:0));
		var y = dd.getFullYear(); 
		var m = dd.getMonth()+1;
		var d = dd.getDate(); 
		if((m+"").length == 1){
			m  = "0" + m;
		}
		if((d+"").length == 1){
			d = "0" + d;
		}
		return y+"."+m+"."+d; 
	},
	createPieSeriesData : function(par){
		var categories = par.categories;
		var data = par.series[0].data;
		var _data=[];
		for (var i = 0; i < categories.length; i++) {
			var d = [];
			d.push(categories[i]);
			d.push(data[i]);
			_data.push(d);
		}
		var series = [];
		var serie = {
            type: 'pie',
//            name: par.series[0].name,
            data: _data
		}
		series.push(serie);
		return series;
	},
	line : function(par){
		if('pie' === par.type){
			par.series = HighchartsOptions.createPieSeriesData(par);
			return HighchartsOptions.pie(par);
		}
    	var option = {
			chart : {
				backgroundColor: par.backgroundColor ? par.backgroundColor :'#F7F9FB',
				defaultSeriesType : par.type ? par.type : "line",
				marginTop: 50
			},
			random:Math.random(),
	        colors: ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
	        title: {
	            text: ' ',
	            x: -20 //center
	        },
	        xAxis: {
				categories : par.categories,
				tickInterval : par.tickInterval?par.categories.length>9?par.tickInterval:1:1,
				gridLineWidth : par.xAxisLine != undefined ? par.xAxisLine : 1,
				gridLineDashStyle: 'longdash',
				labels: {
					enabled : par.xAxisLabel != undefined ? par.xAxisLabel : true,
	            	formatter: function () {
	            		if(par.xAxisFunction){
	            			return par.xAxisFunction(this.value);
	            		}else{
	            			return this.value;
	            		}
	            	}
	            }
			},
	        yAxis: {
				title : {
					text : par.yAxisTitle,
					align: 'high',
					rotation : 0,
					offset : 0,
					y : -20
				},
				minPadding:0,
				min:0,
				startOnTick:false,
				gridLineWidth : par.yAxisLine != undefined ? par.yAxisLine : 1,
				gridLineDashStyle: 'longdash',
				labels: {
					enabled : par.yAxisLabel != undefined ? par.yAxisLabel : true,
	            	formatter: function () {
	            		if(par.yAxisFunction){
	            			return par.yAxisFunction(this.value);
	            		}else{
	            			return this.value;
	            		}
	            	}
	            }
			},
	        tooltip: {
	        	enabled : false,
                shared: par.tooltipshared!=null?false:true, 
                useHTML: par.tooltipshared!=null?false:true,
                crosshairs:{width:1},
                backgroundColor:"#FFFFFF",
	        	formatter : function() {
					if(par.xAxisFunction){
						this.x = par.xAxisFunction(this.x);
					}
					if(par.yAxisFunction){
						this.y = par.yAxisFunction(this.y);
					}
					if(par.tooltipFunction){
						return par.tooltipFunction(this.x,this.y);
					}else if(par.tooltipshared!=null){
						return "<strong>"+this.series.name + "</strong> "+ this.y;
					}else{
						var title = par.title!=null?par.title:"";
						var points = this.points;
						var content='<table class="tooltipTableData">';
						var compare='<table class="tooltipTableData">';
						content += '<tr class="tooltipTitle"><td>';
						content += title+'</td><td class="ta-r">';
						content += (par.currentdate?par.currentdate+' ':'')+FormartUtils.HighChartDateFormat(points[0].x)+'</td></tr>';
						var conetentnum = 0;
						var comparenum = 0;
						for(var i =0;i<points.length;i++){
							if(points[i].series.name.indexOf("对比:")<0){
								content +='<tr><td><i class="i-record mr-5 mt--3" style="color: '+points[i].series.color+'"></i>'+points[i].series.name;
								content +='</td>' ;
								content	+= '<td style="text-align: right; font-weight: bolder;color:'+points[i].series.color+'"><b>'
								content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
								content	+= '</b></td></tr>';
								conetentnum=1;
							}else{
								var len=0;
								if(points[i].series.name.indexOf("对比:")>=0){
									len=3;
								}else if(points[i].series.name.indexOf("上周同期:")>=0 ||points[i].series.name.indexOf("上月同期:")>=0){
									len=5;
								}else if(points[i].series.name.indexOf("前一天:")>=0){
									len=4;
								}
								if(comparenum == 0){
									compare += '<tr class="tooltipTitle"><td colspan="2" class="ta-r">'+(par.currentdate?HighchartsOptions.comparedate+points[i].x:''+HighchartsOptions.getDateStr(HighchartsOptions.D_value,0,0,points[i].x))+'</td></tr>';
								}
								compare +='<tr><td><i class="i-record mr-5 mt--3" style="color: '+points[i].series.color+'"></i>'+points[i].series.name.substring(len,points[i].series.name.length);+'</td>';
								compare	+='<td style="text-align: right; font-weight: bolder;color:'+points[i].series.color+'"><b>';
								compare	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
								compare	+= '</b></td></tr>';
								comparenum=1;
							}
						}
						content	+='</table>';
						compare	+='</table>';
						if(comparenum>0){
							if(conetentnum==0){
								return compare;
							}else{
								return '<div class="tooltipCom">'+content+compare+'</div>';
							}
						}else{
							return content;
						}
					}
				}
	        },
	        legend : {
				enabled : par.legend != undefined ? par.legend : true,
	            align: 'right',
	            verticalAlign: 'top',
	            floating: true,
	            itemStyle: {
	                color: '#464c5b',
	            }
			},
	        plotOptions: {
	            series: {
	            	lineWidth : par.lineWidth != undefined ? par.lineWidth : 2,
					states : {
						hover : {
							lineWidth : par.lineWidth != undefined ? par.lineWidth : 2
						}
					},
					marker: {
	                    enabled : (par.lineColor != undefined && par.lineColor == 'none') ? false : true,
	                    fillColor: (par.lineColor != undefined && par.lineColor == 'white') ? par.lineColor : null,
	                    lineColor: null,
	                    lineWidth : 2,
	                    states: {
	                        hover: { 
	                        	enabled: (par.lineColor != undefined && par.lineColor == 'none') ? false : true,
	                        }
	                    }
	                },
	                dataLabels: {
	                    enabled: par.plotLabel != undefined ? par.plotLabel : false,
	                }
	            },
				area : {
					fillColor: par.fillColor != undefined && par.fillColor == 1 ? {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
	                    stops: [
	                        [0, Highcharts.getOptions().colors[0]],
	                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                    ]
	                } : undefined,
				},
				areaspline : {
					fillColor: par.fillColor != undefined && par.fillColor == 1 ? {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
						stops: [
						        [0, Highcharts.getOptions().colors[0]],
						        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
						        ]
					} : undefined,
				}
			},
			credits : {
				enabled : false
			},
			series : par.series
    	};
    	return option; 
    },
    
	embedded_line : function(par){
    	var option = {
    			credits: {
    	             enabled:false
    			},
    			chart : {
					backgroundColor: '#ffffff',
					defaultSeriesType :"line",
					marginTop: 5
    			},
    			random:Math.random(),
    	        colors: ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
    	        title: {
    	            text: ' ',
    	            x: -20 //center
    	        },
    	        xAxis: {
					categories : par.categories,
					tickInterval : 1,
					tickmarkPlacement : "on",
					tickWidth:'0',
	            	lineColor:"#FFFFFF",
					labels: {
						enabled : false
		            }
				},
    	        yAxis: {
    				title : {
    					text : ""
    				},
    				minPadding:0,
    				min:0,
    				categories : [0, par.max],
    				max : par.max,
    				startOnTick:false,
    				gridLineDashStyle: 'longdash',
    				gridLineWidth :0,
    				plotLines: [{
    	                value: 0,
    	                width: 1,
    	                color: '#808080'
    	            }],
    				labels: {
    					enabled : false
    	            }
    			},
    			plotOptions: {
                    line : {
    					lineWidth : 2,
    					marker : {
    						enabled : (par.categories && par.categories.length ==1) ? true : false,
    						radius: 5,
    						states : {
    							hover : {
    								enabled : false,
    							}
    						}
    					}
    				},
                },
    	        tooltip: {
    	        	enabled : false
    	        },
    	        legend : {
    				enabled : false
    			},
			series : par.series
    	};
    	return option; 
    },
    lineAndColumn : function(par){
    	var option = {
    			chart : {
					backgroundColor: '#F7F9FB',
					defaultSeriesType : par.type?par.type:"line",
					marginTop: 80
    			},
    			random:Math.random(),
    	        colors: ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
    	        title: {
    	            text: ' ',
    	            x: -20 //center
    	        },
    	        xAxis: [{
					categories : par.categories,
					tickInterval : par.tickInterval?par.categories.length>9?par.tickInterval:1:1,
					tickmarkPlacement : "on",
					labels: {
						enabled : par.xAxisEnabled != null?par.xAxisEnabled:"true",
		            	formatter: function () {
		            		if(par.xAxisFunction){
		            			return par.xAxisFunction(this.value);
		            		}else{
		            			return this.value;
		            		}
		            	}
		            }
					},{
						categories : par.categories,
						tickInterval : par.tickInterval?par.categories.length>9?par.tickInterval:1:1,
						tickmarkPlacement : "on",
						tickWidth:'0',
		            	lineColor:"#F7F9FB",
	    				labels: {
	    				//	enabled : par.xAxisEnabled?par.xAxisEnabled:"true",
	    	            	formatter: function () {
	    	            		if(par.xAxisFunction){
	    	            			return par.xAxisFunction(this.value);
	    	            		}else{
	    	            			return this.value;
	    	            		}
	    	            	}
	    	            }
					}
				],
    	        yAxis: [
					{
						title : {
							text : par.ytitle != undefined ? par.ytitle[0] : "单位：万人",
							align: 'high',
							rotation : 0,
							offset : 0,
							y : -20
						},
						minPadding:0,
						min:0,
						startOnTick:false,
						gridLineDashStyle: 'longdash',
						plotLines: [{
					        value: 0,
					        width: 1,
					        color: '#808080'
					    }],
						labels: {
							enabled : par.yAxisEnabled != null?par.yAxisEnabled:"true",
					    	formatter: function () {
					    		if(par.yAxisFunction){
					    			return par.yAxisFunction(this.value);
					    		}else{
					    			return this.value;
					    		}
					    	}
					    }
					},
					{
						title : {
							text :  par.ytitle != undefined ? par.ytitle[1] : "单位：万元",
							align: 'high',
							rotation : 0,
							offset : 0,
							y : -20
						},
						minPadding:0,
						min:0,
						startOnTick:false,
						gridLineDashStyle: 'longdash',
						plotLines: [{
					        value: 0,
					        width: 1,
					        color: '#808080'
					    }],
						labels: {
							enabled : par.yAxisEnabled != null?par.yAxisEnabled:"true",
					    	formatter: function () {
					    		if(par.yAxisFunction){
					    			return par.yAxisFunction(this.value);
					    		}else{
					    			return this.value;
					    		}
					    	}
					    },
					    opposite : true
					}
    	        ],
    	        tooltip: { 
	                shared: par.tooltipshared!=null?false:true, 
	                useHTML: par.tooltipshared!=null?false:true,
	                crosshairs:{width:1},
	                backgroundColor:"#FFFFFF",
    	        	formatter : function() {
    					if(par.xAxisFunction){
    						this.x = par.xAxisFunction(this.x);
    					}
    					if(par.yAxisFunction){
    						this.y = par.yAxisFunction(this.y);
    					}
    					if(par.tooltipFunction){
    						return par.tooltipFunction(this.x,this.y);
    					}else if(par.tooltipshared!=null){
    						return "<strong>"+this.series.name + "</strong> "+ this.y;
    					}else{
    						var title = par.title!=null?par.title:"时间";
    						var points = this.points;
    						var content='<table class="tooltipTableData">';
    						var compare='<table class="tooltipTableData">';
    						content += '<tr class="tooltipTitle"><td>';
    						content += title+'</td><td class="ta-r">';
    						content += (par.currentdate?par.currentdate+' ':'')+FormartUtils.HighChartDateFormat(points[0].x)+'</td></tr>';
    						var conetentnum = 0;
    						var comparenum = 0;
							for(var i =0;i<points.length;i++){
								if(points[i].series.name.indexOf("对比:")<0){
									content +='<tr><td><i class="i-record mr-5 mt--3" style="color: '+points[i].series.color+'"></i>'+points[i].series.name;
									content +='</td>' ;
									content	+= '<td style="text-align: right; font-weight: bolder;color:'+points[i].series.color+'"><b>'
									content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
									content	+= '</b></td></tr>';
									conetentnum=1;
								}else{
									var len=0;
									if(points[i].series.name.indexOf("对比:")>=0){
										len=3;
									}else if(points[i].series.name.indexOf("上周同期:")>=0 ||points[i].series.name.indexOf("上月同期:")>=0){
										len=5;
									}else if(points[i].series.name.indexOf("前一天:")>=0){
										len=4;
									}
									if(comparenum == 0){
										compare += '<tr class="tooltipTitle"><td colspan="2" class="ta-r">'+(par.currentdate?HighchartsOptions.comparedate+points[i].x:''+HighchartsOptions.getDateStr(HighchartsOptions.D_value,0,0,points[i].x))+'</td></tr>';
									}
									compare +='<tr><td><i class="i-record mr-5 mt--3" style="color: '+points[i].series.color+'"></i>'+points[i].series.name.substring(len,points[i].series.name.length);+'</td>';
									compare	+='<td style="text-align: right; font-weight: bolder;color:'+points[i].series.color+'"><b>';
									compare	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
									compare	+= '</b></td></tr>';
									comparenum=1;
								}
							}
							content	+='</table>';
							compare	+='</table>';
							if(comparenum>0){
								if(conetentnum==0){
									return compare;
								}else{
									return '<div class="tooltipCom">'+content+compare+'</div>';
								}
							}else{
								return content;
							}
    					}
    				}
    	        },
    	        legend : {
    				enabled : true,
    	            align: 'right',
    	            verticalAlign: 'top',
    	            /*layout: 'vertical',*/
    	            floating: true,
    	            x : -60,
    	            itemStyle: {
    	                color: '#464c5b',
    	            },
    	            symbolHeight: 4,
    	            symbolWidth : 20,
    	            symbolRadius : 2,
    	            lineHeight : 16,
    	            itemMarginTop: 0,
    			},
    	        plotOptions : {
    				series : {
    					fillOpacity : 0.00,
    					dataLabels : {
    						shadow : false
    					},
    					cursor : "pointer",
    					marker : {
    						lineWidth : 1
    					}
    				},
    				area : {
    					lineWidth : 2,
    					states : {
    						hover : {
    							lineWidth : 3
    						}
    					},
    					marker : {
    						enabled : false,
    						states : {
    							hover : {
    								enabled : true,
    								radius : 2,
    								lineWidth : 1
    							}
    						}
    					}
    				}
    			},
    			credits : {
    				enabled : false
    			},
    			series : par.series
    	};
    	return option; 
    },
    simpleColumn : function(par){
    	var option = {
    	        credits: {
    	            enabled: false
    	        },
    			chart : {
    				backgroundColor: '#F7F9FB',
    				defaultSeriesType : 'column',
    						marginTop: 50
    			},
    			random:Math.random(),
    			colors: ['#669DED','#B6C1CF','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
    			title: {
    				text: ' ',
    				x: -20 //center
    			},
    			xAxis: [{
    				categories : par.categories,
    				tickInterval : (par.tickInterval && par.categories.length>9) ? par.tickInterval : 1,
					tickmarkPlacement : "on",
					labels: {
						formatter: function () {
							if(par.xAxisFunction){
								return par.xAxisFunction(this.value);
							}else{
								return this.value;
							}
						}
					}
    			},{
    				categories : par.categories,
					tickmarkPlacement : "on",
					tickWidth:'0',
					lineColor:"#F7F9FB",
					labels: {
						enabled : false,
						formatter: function () {
							if(par.xAxisFunction){
								return par.xAxisFunction(this.value);
							}else{
								return this.value;
							}
						}
					}
    			}],
    			yAxis: {
    				title : {
    					text : par.yAxisTitle == null ? '':par.yAxisTitle,
						align: 'high',
						rotation : 0,
						offset : 0,
						y : -20
    				},
    				max:par.ymax,
    				min:-par.ymax,
    			/*	minPadding:0,
    				startOnTick:false,*/
    				gridLineDashStyle: 'longdash',
    				plotLines: [{
    					value: 0,
    					width: 1,
    					color: '#808080'
    				}],
    				labels: {
    					formatter: function () {
    						if(par.yAxisFunction){
    							return par.yAxisFunction(this.value);
    						}else{
    							return this.value;
    						}
    					}
    				}
    			},
    			tooltip: { 
    				shared: true, 
					useHTML: true,
					crosshairs:{width:1},
					backgroundColor:"#FFFFFF",
					formatter : function() {
						var title = par.title!=null?par.title:'时间';
						var points = this.points;
						var content='<table class="tooltipTableData" style="width:180px;float:left;">';
						content += '<tr class="tooltipTitle"><td>';
						content += title+'</td><td class="ta-r">';
						content += (par.currentdate?par.currentdate+' ':'')+points[0].x+'</td></tr>';
						for(var i =0;i<points.length;i++){
							content +='<tr><td><i class="i-record mr-5 mt--3" style="color: '+points[i].series.color+'"></i>'+points[i].series.name;
							content +='</td>' ;
							content	+= '<td style="text-align: right; font-weight: bolder;color:'+points[i].series.color+'"><b>'
							content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
							content	+= '</b></td></tr>';
						}
						content	+='</table>';
						return content;
					}
    			},
    			legend : {
    				enabled : true,
    				align: 'right',
    				verticalAlign: 'top',
    				/*layout: 'vertical',*/
    				floating: true
    			},
    			plotOptions : {
    				series : {
    					fillOpacity : 0.00,
    					dataLabels : {
    						shadow : false
    					},
    					cursor : "pointer",
    					marker : {
    						lineWidth : 1
    					}
    				},
    				line : {	
    					marker: {
    						enabled : false,
    						symbol:'circle',
    						lineColor: null,
    						states: {
    							hover: { 
    								fillColor:'white',
    								enabled: true,
    								lineWidth:2,
    								
    							}
    						}
    					}
    				},
    				column:{stacking: par.stacking ? par.stacking : ''}
    			},
    			series : par.series
    	};
    	return option; 
    },
    customColumn : function(par){
    	var option = {
    			credits: {enabled: false}, 
    			chart : {
    				backgroundColor: '#F7F9FB',
    				defaultSeriesType : 'column',
    						marginTop: 50
    			},
    			random:Math.random(),
    			colors: ['#669DED','#B6C1CF','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
    			title: {
    				text: ' ',
    				x: -20 //center
    			},
    			xAxis: [{
    				categories : par.categories,
    				tickInterval : (par.tickInterval && par.categories.length>9) ? par.tickInterval : 1,
					tickmarkPlacement : "on",
					labels: {
						formatter: function () {
							if(par.xAxisFunction){
								return par.xAxisFunction(this.value);
							}else{
								return this.value;
							}
						}
					}
    			},{
    				categories : par.categories,
					tickmarkPlacement : "on",
					tickWidth:'0',
					lineColor:"#F7F9FB",
					labels: {
						enabled : false,
						formatter: function () {
							if(par.xAxisFunction){
								return par.xAxisFunction(this.value);
							}else{
								return this.value;
							}
						}
					}
    			}],
    			yAxis: {
    				title : {
    					text : par.yAxisTitle ,
						align: 'high',
						rotation : 0,
						offset : 0,
						y : -20
    				},
    			/*	minPadding:0,
    				startOnTick:false,*/
    				gridLineDashStyle: 'longdash',
    				plotLines: [{
    					value: 0,
    					width: 1,
    					color: '#808080'
    				}],
    				labels: {
    					formatter: function () {
    						if(par.yAxisFunction){
    							return par.yAxisFunction(this.value);
    						}else{
    							return this.value;
    						}
    					}
    				}
    			},
    			tooltip: { 
    				enabled : par.tooltipEnabled != null?par.tooltipEnabled:true,
    				valueDecimals: 2,
    				shared: true, 
					useHTML: true,
					crosshairs:{width:1},
					backgroundColor:"#FFFFFF",
					formatter : function() {
						var title = par.title!=null?par.title:"业务类型";
						var points = this.points;
						var content='<table class="tooltipTableData" style="width:180px;float:left;">';
						content += '<tr class="tooltipTitle"><td>';
						content += title+'</td><td class="ta-r">';
						content += (par.currentdate?par.currentdate+' ':'')+points[0].x+'</td></tr>';
						for(var i =0;i<points.length;i++){
							content +='<tr><td><i class="i-record mr-5 mt--3" style="color: '+points[i].series.color+'"></i>'+points[i].series.name;
							content +='</td>' ;
							content	+= '<td style="text-align: right; font-weight: bolder;color:'+points[i].series.color+'"><b>'
							content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
							content	+= '</b></td></tr>';
						}
						content	+='</table>';
						return content;
					}
    			},
    			legend : {
    				enabled : false,
    				align: 'right',
    				verticalAlign: 'top',
    				/*layout: 'vertical',*/
    				floating: true
    			},
    			plotOptions : {
    				series : {
    					fillOpacity : 0.00,
    					dataLabels : {
                            enabled: par.dataLabelsEnabled == null ? false : true,
                            formatter: function(){
                                 var y = this.point.y;   // 点的y轴值
                                 return Math.round(y*10000) / 100 +'%'
                             }
    					},
    					marker : {
    						lineWidth : 1
    					}, 
    				    cursor : par.cursor == null ? "" : "pointer"
    				},
    				column:{
    					stacking: par.stacking ? par.stacking : '',
    					events : { click : function(e) {
							if(par.click){
								par.click(e.point.category);
							}
						} }		
    						}
    			},
    			series : par.series
    	};
    	return option; 
    },
	column: function(par){//纵向柱状图
		var option ={
				random:Math.random(),
    	        colors: ['#669DED','#7CB5EC','#B6C1CF','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
		        chart: {
		        	defaultSeriesType: 'bar',
	        		marginTop: "20",
	        		backgroundColor: '#F7F9FB'
		        },
		        title: {
		            text: ""
		        },
		        tooltip: { 
	                shared: par.tooltipshared!=null?false:true, 
	                useHTML: par.tooltipshared!=null?false:true,
	                crosshairs:{width:1},
	                backgroundColor:"#FFFFFF",
    	        	formatter : function() {
    					if(par.xAxisFunction){
    						this.x = par.xAxisFunction(this.x);
    					}
    					if(par.yAxisFunction){
    						this.y = par.yAxisFunction(this.y);
    					}
    					if(par.tooltipFunction){
    						return par.tooltipFunction(this.x,this.y);
    					}else if(par.tooltipshared!=null){
    						return "<strong>"+this.series.name + "</strong> "+ this.y;
    					}else{
    						var title = par.title!=null?par.title:"设备";
    						var points = this.points;
    						var content='<table class="tooltipTableData">';
    						content += '<tr class="tooltipTitle"><td>';
    						content += title+'</td><td class="ta-r">';
							content += par.platformForamt?par.platformForamt(points[0].x):points[0].x+'</td></tr>';
							for(var i =0;i<points.length;i++){
								content +='<tr><td style="color: '+points[i].series.color+'">'+points[i].series.name +'</td>';
								content	+= '<td class="ta-r" style="color:'+points[i].series.color+'"><b>'
								content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
								content	+= '</b></td></tr>';
							}
							content	+='</table>';
							return content;
    					}
    				}
    	        },  
		        xAxis: [
	                { 	
	                	categories: par.categories.xArray,
	                	title: {
	                		text: ''
	                	},
						labels: {
							useHTML: true,
			            	formatter: function () {
			            		if(par.xAxisFunction){
			            			return par.xAxisFunction(this.value);
			            		}else{
			            			return this.value;
			            		}
			            	}
			            }
	                },{
	                	categories: par.categories.dataArray_ratio,
	                	title: {
		                text: ''
	                	},labels: {formatter: function () {
	                        return this.value + "%"
	                    }},
	                	opposite: true
		            }
		        ],
		        yAxis: {
		        	min: 0, 
		        	gridLineDashStyle: 'longdash',
		        	title: {text: null}
		        }, 
		        credits: {enabled: false}, 
		        legend: {enabled: false},
		        plotOptions: {
		        	bar: {
//		        		pointPadding: 0.2,
//		                borderWidth: 0,
//		                pointWidth: 30,
		        		dataLabels: {enabled: true, formatter: function () {
		                return"" + this.y
		            }}}, scatter: {marker: {enabled: false}}
		        },
	            series: [
	                     {name:  par.series.name, legendIndex: 0, xAxis: 0, data: par.series.dataArray},
	                     {name:  par.series.name, legendIndex: 0, xAxis: 1,type: "scatter", data: par.series.dataArray}
	                 	]
		    };
        return option; 
    },
    column_stack: function(par){
    	var option ={
    			//random:Math.random(),
    			colors: ['#eeeeee', '#f7a35c', '#7cb5ec', '#f7a35c', '#8085e9', 
    			         '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'] ,
    			chart: {
    				defaultSeriesType: 'column',
    				marginBottom: "37",
    				backgroundColor: '#F7F9FB'
    			},
    			title: {
    				text: par.title
    			},
    			tooltip: { 
    	            formatter: function() {
    	                return '<b>'+ this.x +'</b><br/>'+
    	                    this.series.name +': '+ this.y +'<br/>'+
    	                    'Total: '+ this.point.stackTotal;
    	            }
    							
    			},  
    			xAxis: 
    			        {
    			        	categories: par.categories,
    			        	title: {
    			        		text: ''
    			        	},
    			        	labels: {
    			        		useHTML: false,
    			        		formatter: function () {
    			        			if(par.xAxisFunction){
    			        				return par.xAxisFunction(this.value);
    			        			}else{
    			        				return this.value;
    			        			}
    			        		}
    			        	}
    			        },
    			        yAxis: par.predictor?{
    			        	gridLineWidth : 0,
    			        	min: 0, 
    			        	title: {text: ""},
    			        	labels:{
    			        		enabled : false
    			        	},
    			            stackLabels: {
    			                enabled: true,
    			                style: {
    			                    fontWeight: 'bold',
    			                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
    			                }
    			            },
    			               plotLines: [{
    			                   label:{
    			                           text:'起始量',
    			                           align:'right',            
    			                           x:10        
    			                       },
    			                   dashStyle:'longdashdot',
    			                   value: par.plotLinesValues[0],
    			                   width: 2,
    			                   color: '#808080'
    			               },{
    			                   label:{
			                           text:'预计完成',
			                           align:'right',            
			                           x:10        
			                       },
    			                   dashStyle:'longdashdot',
    			                   value: par.plotLinesValues[1],
    			                   width: 2,
    			                   color: '#808080'
    			               },{
    			                   label:{
			                           text:'总目标量',
			                           align:'right',            
			                           x:10        
			                       },
    			                   dashStyle:'longdashdot',
    			                   value: par.plotLinesValues[2],
    			                   width: 2,
    			                   color: '#808080'
    			               }]
    			        } : {
    			        	gridLineWidth : 0,
    			        	min: 0, 
    			        	title: {text: ""},
    			        	labels:{
    			        		enabled : false
    			        	},
    			            stackLabels: {
    			                enabled: true,
    			                style: {
    			                    fontWeight: 'bold',
    			                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
    			                }
    			            },
    			               plotLines: [{
    			                   label:{
    			                           text:'起始量',
    			                           align:'right',            
    			                           x:10        
    			                       },
    			                   dashStyle:'longdashdot',
    			                   value: par.plotLinesValues[0],
    			                   width: 2,
    			                   color: '#808080'
    			               },{
    			                   label:{
			                           text:'计划完成',
			                           align:'right',            
			                           x:10        
			                       },
    			                   dashStyle:'longdashdot',
    			                   value: par.plotLinesValues[1],
    			                   width: 2,
    			                   color: '#808080'
    			               },{
    			                   label:{
			                           text:'已完成',
			                           align:'right',            
			                           x:10        
			                       },
    			                   dashStyle:'longdashdot',
    			                   value: par.plotLinesValues[2],
    			                   width: 2,
    			                   color: '#808080'
    			               },{
    			                   label:{
			                           text:'总目标量',
			                           align:'right',            
			                           x:10        
			                       },
    			                   dashStyle:'longdashdot',
    			                   value: par.plotLinesValues[3],
    			                   width: 2,
    			                   color: '#808080'
    			               }]
    			        }, 
    			        credits: {enabled: false}, 
    			        legend: {enabled: false},
    			        plotOptions: {
    			            column: {
    			                stacking: 'normal',
    			                dataLabels: {
    			                    enabled: true,
    			                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
    			                }
    			            }
    			        },
    			        series: par.series
    	};
    	return option; 
    },
    column_summarize: function(par){
    	var option ={
    			random:Math.random(),
    			colors: ['#669DED','#7CB5EC','#B6C1CF','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
    			chart: {
    				defaultSeriesType: 'bar',
    				marginTop: "20",
    				backgroundColor: '#F7F9FB'
    			},
    			title: {
    				text: ""
    			},
    			tooltip: { 
    				shared: true, 
					useHTML: true,
    				crosshairs:{width:1},
    				backgroundColor:"#FFFFFF",
    				formatter : function() {
						var title = par.title!=null?par.title:"设备";
						var points = this.points;
						var content='<table class="tooltipTableData">';
						content += '<tr class="tooltipTitle"><td>';
						content += title+'</td><td class="ta-r">';
						content += par.platformForamt?par.platformForamt(points[0].x):points[0].x+'</td></tr>';
						for(var i =0;i<points.length;i++){
							content +='<tr><td style="color: '+points[i].series.color+'">'+points[i].series.name +'</td>';
							content	+= '<td class="ta-r" style="color:'+points[i].series.color+'"><b>'
							content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
							content	+= '</b></td></tr>';
						}
						content	+='</table>';
						return content;
					}
    							
    			},  
    			xAxis: [
    			        { 	
    			        	categories: par.categories.xArray,
    			        	title: {
    			        		text: ''
    			        	},
    			        	labels: {
    			        		useHTML: false,
    			        		formatter: function () {
    			        			if(par.xAxisFunction){
    			        				return par.xAxisFunction(this.value);
    			        			}else{
    			        				return this.value;
    			        			}
    			        		}
    			        	}
    			        },{
    			        	categories: par.categories.dataArray_ratio,
    			        	title: {
    			        		text: ''
    			        	},labels: {formatter: function () {
    			        		return this.value + "%"
    			        	}},
    			        	opposite: true
    			        }
    			        ],
    			        yAxis: {
    			        	min: 0, 
    			        	gridLineDashStyle: 'longdash',
    			        	title: {text: null}
    			        }, 
    			        credits: {enabled: false}, 
    			        legend: {enabled: false},
    			        plotOptions: {
    			        	bar: {
    			        		dataLabels: {enabled: true, formatter: function () {
    			        			return"" + this.y
    			        		}}}, scatter: {marker: {enabled: false}}
    			        },
    			        series: [
    			                 {name:  par.series.name, legendIndex: 0, xAxis: 0, data: par.series.dataArray},
    			                 {name:  par.series.name, legendIndex: 0, xAxis: 1,type: "scatter", data: par.series.dataArray}
    			                 ]
    	};
    	return option; 
    },
    column_double: function(par){//纵向柱状图
		var option ={
			random:Math.random(),
	        colors: ['#669DED','#7CB5EC','#B6C1CF','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
	        chart: {
	        	defaultSeriesType: 'bar',
        		marginTop: "20",
        		backgroundColor: '#F7F9FB'
	        },
	        title: {
	            text: ""
	        },
	        tooltip: {
	        	shared: par.tooltipshared!=null?false:true, 
            	useHTML: par.tooltipshared!=null?false:true,
           		crosshairs:{width:1},
           		backgroundColor:"#FFFFFF",
           		formatter: function () {
					if(par.xAxisFunction){
						this.x = par.xAxisFunction(this.x);
					}
					if(par.yAxisFunction){
						this.y = par.yAxisFunction(this.y);
					}
					if(par.tooltipFunction){
						return par.tooltipFunction(this.x,this.y);
					}else if(par.tooltipshared!=null){
						return "<strong>"+this.series.name + "</strong> "+ this.y;
					}else{
						var title = par.title!=null?par.title:"设备";
						var points = this.points;
						var content='<table class="tooltipTableData">';
						content += '<tr class="tooltipTitle"><td>';
						content += title+'</td><td class="ta-r">';
						content += par.platformForamt?par.platformForamt(points[0].x):points[0].x+'</td></tr>';
						for(var i =0;i<points.length;i++){
							content +='<tr><td style="color: '+points[i].series.color+'">'+points[i].series.name +'</td>';
							content	+= '<td class="ta-r"style="color:'+points[i].series.color+'"><b>'
							content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
							content	+= '</b></td></tr>';
						}
						content	+='</table>';
						return content;
					}
           		}
       		},  
	        xAxis: [
                { 	
                	categories: par.categories.xArray,
                	title: {
                		text: ''
                	},
					labels: {
						useHTML: true,
		            	formatter: function () {
		            		if(par.xAxisFunction){
		            			return par.xAxisFunction(this.value);
		            		}else{
		            			return this.value;
		            		}
		            	}
		            }
                },{
                	categories: par.categories.dataArray_ratio,
                	title: {
	                text: ''
                	},labels: {formatter: function () {
                        return this.value + "%"
                    }},
                	opposite: true
	            }
	        ],
	        yAxis: {
	        	min: 0, 
	        	gridLineDashStyle: 'longdash',
	        	title: {text: null}
	        }, 
	        credits: {enabled: false}, 
	        legend: {enabled: false},
	        plotOptions: {
	        	bar: {
//		        		pointPadding: 0.2,
//		                borderWidth: 0,
//		                pointWidth: 30,
	        		dataLabels: {enabled: true, formatter: function () {
	                return"" + this.y
	            }}}, scatter: {marker: {enabled: false}}
	        },
	        series: [{name: par.series[0].name, legendIndex: 0, xAxis: 0, data: par.series[0].dataArray},
			         {name:  par.series[0].name, legendIndex:1, xAxis: 1,type: "scatter", data: par.series[0].dataArray},
			         {name: "对比:"+par.series[1].name, legendIndex: 2, xAxis: 0, data:  par.series[1].dataArray}
			         ]
		};
        return option; 
    },
    summarize_line: function(par){//summarize 活跃访客使用
    	var option ={
    			random:Math.random(),
    			colors: ['#7CB5EC','#90ED7D','#F7A35C','#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
				chart : {
					backgroundColor: '#F7F9FB',
					defaultSeriesType : "line",
					marginTop: 50
				},
				title : {
					text : ""
				},
				xAxis :[{
					categories : par.categories,
					tickInterval : 2,
					tickmarkPlacement : "on",
					labels: {
		            	formatter: function () {
		            		return FormartUtils.dateFormat(this.value);
		            	}
		            }
				},{
					categories : par.categories,
					tickInterval : 2,
					tickmarkPlacement : "on",
					tickWidth:'0',
	            	lineColor:"#FFFFFF",
					labels: {
						enabled : false,
		            	formatter: function () {
		            		return FormartUtils.dateFormat(this.value);
		            	}
		            }
				}],
				yAxis : {
					min: 0,
					gridLineDashStyle: 'longdash',
					title : {
						text : ""
					}
				},
				legend : {
					enabled : true,
		            align: 'right',
		            verticalAlign: 'top',
				},
				tooltip : {
					shared: true, 
	                useHTML:true,
	                crosshairs:{width:1},
	                backgroundColor:"#FFFFFF",
    	        	formatter : function() {
						var title = par.title!=null?par.title:"时间";
						var points = this.points;
						var content='<table class="tooltipTableData fl wd180">';
						content += '<tr class="tooltipTitle"><td>';
						content += title+'</td><td class="ta-r">';
						content += FormartUtils.HighChartDateFormat(points[0].x)+'</td></tr>';
						var total = 0;
						for(var i =0;i<points.length;i++){
							content +='<tr><td><i class="i-record mr-5 mt--3" style="color: '+points[i].series.color+'"></i>'+points[i].series.name;
							content +='</td>' ;
							content	+= '<td class="ta-r" style="color:'+points[i].series.color+'"><b>'
							content	+= par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
							total += par.yAxisFunction?par.yAxisFunction(points[i].y):points[i].y;
							content	+= '</b></td></tr>';
						}
						content += '<tr><td><i class="i-record mr-5 mt--3"></i>总计</td><td class="ta-r"><b>'+total+'</b></td></tr>';
						content	+='</table>';
						return content;
    	        	}
				},
				plotOptions : {
					line : {
						marker: {
		                    enabled : false,
		                    symbol:'circle',
		                    lineColor: null,
		                    states: {
		                        hover: { 
		                            fillColor:'white',
		                            enabled: true,
		                            lineWidth:2,
		                           
		                        }
		                    }
		                }
					}
				},
				credits : {
					enabled : false
				},
				series : [{
					name : "新访客",
					xAxis : 0,
					data : par.newUser_dataArray
				}, {
					name : "老访客",
					xAxis : 0,
					data : par.activeUser_dataArray
				}]
    		
    	};
    	return option; 
    },
    pie: function(par){
    	var option = {
    		random:Math.random(),
    		colors: ["#5E90DD","#70CB6B","#F7A542" , '#8085E9','#F15C80','#C9BA4A','#8085E8','#8D4653','#91E8E1','#7CB5EC'],
			chart: {
				backgroundColor:  par.backgroundColor ?  par.backgroundColor : '#F7F9FB',
				plotBorderWidth: null,
				plotShadow: false,
			},
	        title: {
                text: ''
	        },
	        tooltip: {
	        	enabled: false,
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        legend : {
				enabled : true,
	            align: 'right',
	            verticalAlign: 'top',
			},
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                },
//	                showInLegend: true
	            }	        	
	        },
	        credits: {
	            enabled: false
	        },
	        series: par.series
	    }
    	return option; 
    },
    line_column : function(par){//柱状图 转化漏斗
    	var option = {
    			random:Math.random(),
				title : {
					text : ""
				},
				xAxis : {
					categories: par.categories,
                	title: {
                		text: ''
                	},
					labels: {
						useHTML: true,
		            	formatter: function () {
		            		if(par.xAxisFunction){
		            			return par.xAxisFunction(this.value);
		            		}else{
		            			return this.value;
		            		}
		            	}
		            }
				},
				yAxis : {
					title : {
						text : ""
					}
				},
				legend : {
					enabled : false
				},
				tooltip : {
					formatter : function() {
						if(this.x.indexOf(",")>0){
							return "" + this.x.split(",")[0] + ": " + this.y;
						}else{
							return "" + this.x + ": " + this.y;
						}
					}
				},
				credits : {
					enabled : false
				},
				plotOptions : {
					column : {
						stacking : "normal",
						dataLabels : {
							enabled : true,
							color : "black"
						}
					},
					area : {
						marker : {
							enabled : false,
							states : {
								hover : {
									enabled : true
								}
							}
						},
						dataLabels : {
							enabled : true,
							color : "black",
							y : 5,
							formatter : function() {
								var a = 0;
								if(this.y != 0){
									a = (this.y/par.series.dataArray[0]*100);
								}
								return parseInt(a) + "%";
							}
						}
					},
					line : {
						dataLabels : {
							enabled : true,
							color : "black",
							x : -60,
							y : 15,
							formatter : function() {
								var a = 0;
								var index = this.point.index;
								if(index !=0){
									if(this.y != 0){
										a = this.y/this.point.series.yData[index-1]*100;
									}
								}else{
									return;
								}
								return parseInt(a) + "%";
							}
						}
					}
				},
				series : [{
					color : "#F3F4F9",
					type : "area",
					data : par.series.dataArray
				},{
					color : "#B0D6FB",
					type : "line",
					data : par.series.dataArray
				},{
					type : "column",
					data : par.series.dataArray
				}]
		    };
    	return option; 
    },
    line_column_useKeepFunnel : function(par){//柱状图 转化漏斗
    	var len = par.len?par.len:-60;
    	var option = {
			chart : {
				backgroundColor: '#F7F9FB',
				marginTop : 50
			},
			title : {
				text : ""
			},
			xAxis : {
				categories : par.categories,
			},
			yAxis : {
				title : {
					text : ""
				},
				min: 0, 
	        	gridLineDashStyle: 'longdash',
			},
			legend : {
				enabled : false
			},
			tooltip : {
				formatter : function() {
					if(par.tooltipFunction && par.tooltipFunction == true){
						return '点击查看人群画像';
					}else{
						return this.x + "：" + this.y;
					}
				}
			},
			credits : {
				enabled : false
			},
			plotOptions : {
				series : {
					cursor : par.cursor == null ? "" : "pointer"
				},
				column : {
					events: {
						click: function(e) {
							if(par.click){
								par.click(e.point.index);
							}
						}
					},
					stacking : "normal",
					dataLabels : {
						allowOverlap : true,
						enabled : true,
						color : "black",
						formatter : function() {
							return this.y;
						}
					}
				},
				area : {
					fillColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
	                    stops: [
	                        [0, Highcharts.getOptions().colors[0]],
	                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                    ]
	                },
	                lineWidth: 1,
					marker : {
						enabled : false,
						states : {
							hover : {
								enabled : true
							}
						}
					},
					dataLabels : {
						enabled : true,
						color : "black",
						y : -5,
						formatter : function() {
							var a = 0;
							if(this.y != 0){
								a = this.y/par.cardinal_number*100;
							}
							return a.toFixed(0) + "%" + (par.tooltipName?par.tooltipName:"用户");
						}
					}
				},
				line : {
					dataLabels : {
						allowOverlap : true,
						enabled : true,
						color : "black",
//						rotation:340,
						x : len,
						y : 5,
						formatter : function() {
							var a = 0;
							var index = this.point.index;
							if(index !=0){
								if(this.y != 0){
									a = this.y/this.point.series.yData[index-1]*100;
								}
							}else{
								return;
							}
							return a.toFixed(0) + "%";
						}
					}
				}
			},
			series : [{
				name : "漏斗",
				color : "#7CB5EC",
				type : "area",
				data : par.dataArray
			},{
				name : "访问次数",
				type : "column",
				data : par.dataArray
			},{	
				name : "线",
				color : "#7CB5EC",
				type : "line",
				data : par.dataArray
			}]
	    };
    	return option; 
    },
    
    Spiderweb : function(par){//蜘蛛图
    	var option = {
			chart : {
				polar: true,
	            type: 'area',
	            backgroundColor: par.backgroundColor ? par.backgroundColor :'#F7F9FB',
			},
			pane: {
	            size: '80%'
	        },
			title : {
				text : ""
			},
			xAxis : {
				categories : par.categories,
				tickmarkPlacement: 'on',
	            lineWidth: 0
			},
			yAxis : {
				title : {
					text : ""
				},
	            gridLineInterpolation: 'polygon',
	            lineWidth: 0,
	            min: 0,
				labels: {
					formatter: function () {
	            		if(this.value == 0){
	            			return false;
	            		}
	            		return this.value;
	            	}
	            }
			},
			legend : {
				enabled : false
			},
			tooltip : {
				backgroundColor: '#606372',
				borderColor: '#606372',
	            style: {
	                color : '#fff'
	            },
	            formatter: function () {
	            	var yData = this.series.yData;
	            	var sum = 0;
	            	for (var i = 0; i < yData.length; i++) {
	            		sum += yData[i]; 
					}
	            	var radio = FormartUtils.toFix(this.y * 100 /sum);
	                return this.x +'<br/>占比：' + radio + '%';
	            }
			},
			plotOptions : {
				series : {
					cursor : "pointer",
					events: {
						click: function(e) {
							if(par.click){
								par.click(e.point.category);
							}
						}
					},
					marker : {
						enabled : false
					}
				}
			},
			credits : {
				enabled : false
			},
			series : par.series
		};
    	return option; 
    }
}
