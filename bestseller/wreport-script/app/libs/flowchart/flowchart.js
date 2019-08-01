function render_flow_chart(datas,params,flg,callback){

  /***************
   * name：flowchart
   ****************/
  //$("#flowchart").html("");
   if(flg || datas == "[]" || datas == ""||'[{"name":"暂无数据"}]'==datas)
   {
	   var html = '  <canvas id="backline" width="700" height="900"></canvas> <div id="aaa" class="line"> <div id="flowchart_top" class="rec1 rec has_child mainline" level=0 index=0 title="路径分析">  <div class="flowchart_content">暂无数据</div>	</div> </div>';
       $("#flowchart").html(html);
	 return;
   
   }
  // debugger

   var dataString = JSON.stringify(datas);

    window.Flow = function(prop,canvas){
	 	this.prop ={
	 		lineHeight:110,
	 		recGap : [230,380,135,53,12.5],    //[180,380,135,53,12.5]   [180,380,220,135,85,53,28,12.5,7]
	 		width : 700,
	 		recWidth :[240,110,110,110,110,110,110,110,110],//五种分支的主体框宽度     //[240,110,110,110,110]
	 		tipWidth : 44,
	 		tipHeight : 22,
            paddWidth:10
	 	};
	 	this.canvas = null;
	 	this.canvasContext = null;
	 	this.canvasProp = {
			width : 700,
			height : 800,        
	   		lineWidth : 2,//线宽
	   		mainLineWidth : 3,//线宽
	   		activeColor:'#6987c4',
	   		mainColor:'#1BE106',
	   		inactiveColor :'#C8C8C8'
	 	};
	 	 $.extend(this.prop,prop||{});
	 	 $.extend(this.canvasProp,canvas||{});
	 };
   window.Flow.prototype = {
     initUI : function(data){
       this.changeCanvasSize();
       $('div.rec1 .flowchart_content').html(String(data[0].projectName)).attr('title',"显示名 : "+data[0].projectName).attr("keyid",data[0].projectId);
       this.createChart($('div.rec1'),data[0].updownList);
       var level1 = $('.rec[level=1]').filter('.has_child').eq(0);
       this.createChart(level1,this.getData(data,level1.find("div").attr("keyid")));
       var	level2 = $('.rec[level=2]').filter('.has_child').eq(0);
       this.createChart(level2,this.getData(data,level2.find("div").attr("keyid")));
       var	level3 = $('.rec[level=3]').filter('.has_child').eq(0);
       this.createChart(level3,this.getData(data,level3.find("div").attr("keyid")));
     },
            //生成分支主体框
           createChart : function(parent,data){
            	if(data&&parent){
                    var count=data.length;
                    if(count>6){
                        count=6;
                    }
            		var level = parseInt(parent.attr("level"));
            		var top = (level+0.5)*this.prop.lineHeight,
            		left = parent.position().left+(parent.width()+this.prop.paddWidth)/2,
            		dotData = [],
            		charts = '<div class="clear line">';
            		dotData[0]={x:left,y:top,level:level};
            		dotData[1]=[];
            		//获得主线
            		for (var i = 0;i<count;i++){
            			if (data[i][3]&&parent.hasClass('mainline')){
            				dotData[0].mainLine = i;
            				break;
            			}
            		}

                    //todo 修改title用来显示详细信息
            		for ( i = 0; i<count;i++){
                        var str="";
						charts +='<div class="'+ (data[i]["flag"]?"has_child ":"no_active ") + 'rec' + count+'-'+ (i+1) + ((parent.hasClass('mainline')&&dotData[0].mainLine == i)?' mainline ':'')
							+  (level==3?' no_active ':'') +' rec  rec'+ count +'" level='+(level+1)+
							' index='+ i +' title=" 显示名：'+(data[i]["projectName"]==null?0:data[i]["projectName"])+'"  type="'+params.type+ '"><div class="flowchart_content" keyid="'+data[i]["projectId"]+'">'
							+data[i]["projectName"]+'</div></div>';

            			dotData[1][i]={};
            			if(count == 1){
            				dotData[1][i].x = this.prop.recGap[count-1]+this.prop.recWidth[count-1]*0.5;
            			}else{
                            if(count>5){
                                dotData[1][i].x = this.prop.recWidth[4]*(i+0.5)+i*this.prop.recGap[4];
                            } else{
                                dotData[1][i].x = this.prop.recWidth[count-1]*(i+0.5)+i*this.prop.recGap[count-1];
                            }
            			}
            			dotData[1][i].y = (level+1.5)*this.prop.lineHeight;
            			dotData[1][i].data = data[i]["percent"];
            			dotData[1][i].active = data[i]["flag"]&&level!=3;
            		}

            		parent.parent().nextAll('div.line').remove();
            		$('#flowchart').append(charts+'</div>');
            		this.drawDataBody(parent,dotData);
            		this.height = $('#flowchart').height();
            		this.drawLine(dotData);
            	}
            },
            //生产数据框
             drawDataBody : function(parent,dotData){
            	var nowLine = parent.parent(),tips='',data,parentIndex,parentData,parentCount;
            	nowLine.nextAll("div.datatip").remove();
            	parentIndex = parent.attr('index');
            	parentCount = parent.siblings().size();
        		parentData = parseFloat($('#flowchart .level'+(dotData[0].level-1)).eq(parentIndex).text());
            	for(var i = 0 ,count = dotData[1].length;i<count;i++){
            		y = (dotData[0].y+dotData[1][i].y-this.prop.tipHeight)/2;
            		x = (dotData[0].x+dotData[1][i].x-this.prop.tipWidth)/2;
        			data = dotData[1][i].data;
              		tips +='<div class="datatip level'+ dotData[0].level +(dotData[1][i].active?" ":" no_active") +'" title="'+  data +'%" style="top:'+ y +'px;left:'+ x +'px;">'+ data +'%</div>'
            	}
            	nowLine.after(tips);
            },
            //画背景线
            drawLine : function(dotData){
            	  startX = dotData[0].x;
            	  startY = dotData[0].y;
            	  this.clearCanvas(0,startY);
            	  for(var i = 0 ,count = dotData[1].length;i<count;i++){
				 	  endY = dotData[1][i].y;
                      endX = dotData[1][i].x;
				 	  if(dotData[0].mainLine!=undefined&&i == dotData[0].mainLine){
					     this.canvasContext.lineWidth = this.canvasProp.mainLineWidth;
				 	  	 this.canvasContext.strokeStyle = this.canvasProp.mainColor;
				 	  }else{
					     this.canvasContext.lineWidth = this.canvasProp.lineWidth;
				 	  	 this.canvasContext.strokeStyle = dotData[1][i].active?this.canvasProp.activeColor:this.canvasProp.inactiveColor;
				 	  }
					  this.canvasContext.beginPath();
					  this.canvasContext.moveTo(startX,startY);
					  this.canvasContext.lineTo(endX,endY);
					  this.canvasContext.stroke();
				  }
            },
            getData : function(data,id){
	    		   for(var i = 0 ,count = data.length;i<count;i++){
	    				if( data[i].projectId == id){
	    					return data[i].updownList;
	    				}
	    			}
            },
            
            clearCanvas : function(x,y){
            	this.canvasContext.clearRect(x,y,this.canvasProp.width,this.canvasProp.height);
            },
            changeCanvasSize : function(){
				this.canvas = document.getElementById('backline');
				this.canvas.width = this.canvasProp.width;
				this.canvas.height = this.canvasProp.height;
				this.canvasContext=this.canvas.getContext('2d');
			}
        };

        // 应用举例 这里是随机 最大支持5个子分支 --begin
        var myFlow = new Flow(),
        data = $.parseJSON(dataString);
        myFlow.initUI(data);

        // 点击查看下一级
        $("#flowchart").on("click", ".rec", function(event){
        	var passengerFlow = $(this).attr("type");
            event.stopPropagation();  //只阻止了冒泡事件， 默认默认行为没有阻止
            event.preventDefault();

            if ($(this).hasClass('no_active')){
    			return false;
    		}else{
    			var keyids=$(this).find("div").attr("keyid");
    			if(keyids == null || keyids == ''){
    				return false;
    			}
    			callback(1);
    			var _this=$(this);
    			var _thisPrev=$(this).find("div").parent();
    			var keyidarr=keyids;
				/*for(var dataOutIndex=0;dataOutIndex<datas.length;dataOutIndex++){
					   var dataOut=datas[dataOutIndex];
					   var oldkeyaArr=dataOut["projectId"];
					   if(oldkeyaArr == keyidarr){
						   myFlow.createChart(_this,myFlow.getData(datas,dataOut["projectId"]));
						   callback(2);
						   return false;
					   }
				}*/

				if(passengerFlow != params.type)
				{
                    callback(2);
					return;
				}
                params.projectId = keyidarr;
    			var pa = angular.copy(params);
    			$.ajax({
                    url : 'api/relevancy-analysisss/updown/'+ pa["analysissId"],
                    type : "GET",
                    dataType : 'json',
                    data : pa ,
                    contentType :"application/json",
					success : function(response) {
                        var data = {};
                        data.datainfo = [];
                        data.datainfo.push(response);
						if(data.datainfo[0] == null){
							_thisPrev.addClass("no_active");
							//_thisSpan.hide();
							callback(2);
							return false;
						}
						var incharIds = data.datainfo[0]["projectId"];
						var incharArr = incharIds;
						var addtrue = true;
						for(var dataOutIndex = 0;dataOutIndex < datas.length; dataOutIndex++){
							   var dataOut = datas[dataOutIndex];
							   var oldkeyaArr = dataOut["projectId"];
							   if(oldkeyaArr == incharArr){
								   addtrue = false;
							   }
						}  
						for(var dataOutIndex=0;dataOutIndex<datas.length;dataOutIndex++){
						   var dataOut = datas[dataOutIndex];
						   var dataOutChar = dataOut.updownList;
						   for(var i=0;i<dataOutChar.length;i++){
						     var outChar=dataOutChar[i];
						     var outCharid=outChar["projectId"];
						     var _outCharid = outCharid;
						     if(_outCharid == incharArr){
						       data.datainfo[0]["projectId"] = outCharid;
						       if(addtrue){
						    	   datas.push(data.datainfo[0]);   
						       }
						       myFlow.createChart(_this,myFlow.getData(datas,outCharid)); //.find("div").attr("keyid")
						       callback(2);
						       return false;
						     }
						   }
						}
						callback(2);
						return false;
					},
				});
    		}
        });



}
jQuery.fn.extend({

    on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
        var type, origFn;

        // Types can be a map of types/handlers
        if ( typeof types === "object" ) {
            // ( types-Object, selector, data )
            if ( typeof selector !== "string" ) {
                // ( types-Object, data )
                data = data || selector;
                selector = undefined;
            }
            for ( type in types ) {
                this.on( type, selector, data, types[ type ], one );
            }
            return this;
        }

        if ( data == null && fn == null ) {
            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if ( fn == null ) {
            if ( typeof selector === "string" ) {
                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {
                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if ( fn === false ) {
            fn = returnFalse;
        } else if ( !fn ) {
            return this;
        }

        if ( one === 1 ) {
            origFn = fn;
            fn = function( event ) {
                // Can use an empty set, since event contains the info
                jQuery().off( event );
                return origFn.apply( this, arguments );
            };
            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
        }
        return this.each( function() {
            jQuery.event.add( this, types, fn, data, selector );
        });
    },
    one: function( types, selector, data, fn ) {
        return this.on( types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
        var handleObj, type;
        if ( types && types.preventDefault && types.handleObj ) {
            // ( event )  dispatched jQuery.Event
            handleObj = types.handleObj;
            jQuery( types.delegateTarget ).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
            );
            return this;
        }
        if ( typeof types === "object" ) {
            // ( types-object [, selector] )
            for ( type in types ) {
                this.off( type, selector, types[ type ] );
            }
            return this;
        }
        if ( selector === false || typeof selector === "function" ) {
            // ( types [, fn] )
            fn = selector;
            selector = undefined;
        }
        if ( fn === false ) {
            fn = returnFalse;
        }
        return this.each(function() {
            jQuery.event.remove( this, types, fn, selector );
        });
    },

    trigger: function( type, data ) {
        return this.each(function() {
            jQuery.event.trigger( type, data, this );
        });
    },
    triggerHandler: function( type, data ) {
        var elem = this[0];
        if ( elem ) {
            return jQuery.event.trigger( type, data, elem, true );
        }
    }
});


var seToMinFormat=function(date) {// 100 --> 01:40
	date = parseInt(date);
	var hour=0;
	var minutes=0;
	var second=date;
    if(date >= 60) {
    	minutes = parseInt(date/60);
        second = parseInt(date%60);
            if(minutes >= 60) {
        	hour = parseInt(minutes/60);
            minutes = parseInt(minutes%60);
            }
    }
    if(minutes<10){
    	minutes = "0" + minutes;
    }
    if(second<10){
    	second = "0" + second;
    }
    if(hour>0){
    	if(hour<10){
    		hour = "0" + hour;
    	}
    	return hour+":"+minutes+":"+second;
    }else{
    	return minutes+":"+second;
    }
};
