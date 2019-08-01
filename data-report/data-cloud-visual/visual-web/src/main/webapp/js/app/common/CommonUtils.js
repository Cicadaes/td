function iFrameHeightM() {
	var winHg = $(window).height() - $("#header").height() - 5;
	var ifm = document.getElementById("extern-pages");
	if(ifm){
		var subWeb = document.frames ? document.frames["extern-pages"].document
				: ifm.contentDocument;
		if (subWeb) {
			//if (winHg > subWeb.body.clientHeight) {
			//	ifm.height = winHg;
			//}else{
				ifm.height = subWeb.body.clientHeight;
			//s}
		}
	}
	
	if(window.parent && window.parent.iFrameHeight){
		window.setTimeout(window.parent.iFrameHeight,200);
	}
	
}

function iFrameScrollHeightM() {
	var winHg = $(window).height() - $("#header").height() - 5;
	var ifm = document.getElementById("extern-pages");
	
	if(ifm){
		var subWeb = document.frames ? document.frames["extern-pages"].document
				: ifm.contentDocument;
		if (subWeb) {
			if(winHg > subWeb.body.scrollHeight){
				ifm.height = winHg;
			}else{
				ifm.height = subWeb.body.scrollHeight;
			}
		}
	}
	
	if(window.parent && window.parent.iFrameScrollHeight){
		window.setTimeout(window.parent.iFrameScrollHeight,200);
	}
}
function formatHeight(){
	if(window.parent && window.parent.iFrameHeight){
		window.setTimeout(window.parent.iFrameHeight,200);
	}
	if(window.parent && window.parent.iFrameScrollHeight){
		window.setTimeout(window.parent.iFrameScrollHeight,200);
	}
}
function initIFrameHeight(){
	if(window.parent && window.parent.iFrameHeight){
	 window.setTimeout(window.parent.iFrameHeight,200);
	}
}


var convertStateConfig = {
	"/createAccountFunnel":"/accountFunnel",
	"/editAccountFunnel":"/accountFunnel",
	"/accountCrowd":"/accountFunnel",
	"/createCampaignFunnel":"/campaignFunnel",
	"/editCampaignFunnel":"/campaignFunnel",
	"/campaignCrowd":"/campaignFunnel",
	"/equityfund":"/transactionData",
	"/finance":"/transactionData",
	"/nonfinancial":"/transactionData",
	"/financingtransfer":"/transactionData",
	"/capitalChange":"/transactionData",
	"/partnerDetail" : "/partnerData",
	"/loseCrowd" : "/loseFunel",
};	

function convertState (state){
	if(state.split("/").length > 3){
		state = state.substring(0,state.lastIndexOf("/"));
	}
	var convertedState = convertStateConfig[state];
	if(convertedState){
		return convertedState;
	}
	return state;
};

var CUSTOM = {
		FONTFAMILYS : [
           {key:'SimHei', value:'黑体'},
           {key:'SimSun', value:'宋体'},
           {key:'NSimSun', value:'新宋体'},
           {key:'FangSong', value:'仿宋'},
           {key:'KaiTi', value:'楷体'},
           {key:'FangSong_GB2312', value:'仿宋_GB2312'},
           {key:'KaiTi_GB2312', value:'楷体_GB2312'},
           {key:'Microsoft YaHei', value:'微软雅黑体'},
           {key:'Microsoft JhengHei', value:'微软正黑体'},
           {key:'YouYuan', value:'幼圆'},
           {key:'STXihei', value:'华文细黑'},
           {key:'STKaiti', value:'华文楷体'},
           {key:'STZhongsong', value:'华文宋体'},
           {key:'FZShuTi', value:'方正舒体'},
           {key:'FZYaoti', value:'方正姚体'},
           {key:'STCaiyun', value:'华文彩云'},
           {key:'STHupo', value:'华文琥珀'},
           {key:'STLiti', value:'华文隶书'},
           {key:'STXingkai', value:'华文行楷'},
           {key:'STXinwei', value:'华文新魏'},
        ],
        FONTFAMILYVALUES : function() {
        	var fontFamilys = CUSTOM.FONTFAMILYS,values=[];
        	for (var i = 0,len = fontFamilys.length; i < len; i++) {
        		values.push(fontFamilys[i].value);
        	}
        	return values;
        },         
        getFontFamilyKey : function(value) {
        	var fontFamilys = CUSTOM.FONTFAMILYS;
        	for (var i = 0,len = fontFamilys.length; i < len; i++) {
        		if (fontFamilys[i].value === value) {
        			return fontFamilys[i].key;
    			}
    		}
        	return '';
    	},         
        THEMES : ['default','vintage','dark','infographic','macarons','roma','shine'],
         

}

var PLUGINS =[
	{
		type:"line",
		name:"线图",
		icon:"icon-linet",
		selected : true,
		property : {
			smooth : 'false',
			lineWidth : 2,
			symbol : 'circle',
			legendShow : true,
			xAxisLine : true,
			xAxisLabel : true,
			yAxisLine : true,
			yAxisLabel : true,
			plotLabel : false,
			bgColor : '#FFF',
			xAxisColor : '#333',
			yAxisColor : '#333',
			legendColor : '#333',
			colorGroup : '#43A3FB,#1FCE6D,#96D02F,#F9D24A,#FAA449,#985FDE,#985FDE,#3564EC,#1A63C6,' +
						 '#A0D5FF,#7CC5FE,#BBE958,#FDD3A6,#9D98FD,#BE6BE0,#9EA7B4,#8B96A8,#7F8B9C',
			xAxisFontSize : '12px',
			yAxisFontSize : '12px',
			legendFontSize : '12px',
			xAxisFontFamily : '微软雅黑体',
			yAxisFontFamily : '微软雅黑体',
			legendFontFamily : '微软雅黑体',
			opacity : '100%',
			location : 'center'
		},
	},
	{
		name:"面积图",icon:"icon-area",type:"area",
		property : {
			smooth : 'false',
			fillColor : 1,
			lineWidth : 2,
			symbol : 'circle',
			legendShow : true,
			xAxisLine : true,
			xAxisLabel : true,
			yAxisLine : true,
			yAxisLabel : true,
			plotLabel : false,
			bgColor : '#FFF',
			xAxisColor : '#333',
			yAxisColor : '#333',
			legendColor : '#333',
			colorGroup : '#43A3FB,#1FCE6D,#96D02F,#F9D24A,#FAA449,#985FDE,#985FDE,#3564EC,#1A63C6,' +
			 			 '#A0D5FF,#7CC5FE,#BBE958,#FDD3A6,#9D98FD,#BE6BE0,#9EA7B4,#8B96A8,#7F8B9C',
			xAxisFontSize : '12px',
			yAxisFontSize : '12px',
			legendFontSize : '12px',
			xAxisFontFamily : '微软雅黑体',
			yAxisFontFamily : '微软雅黑体',
			legendFontFamily : '微软雅黑体',
			opacity : '100%',
			location : 'center'
		}
	},
	{
		name:"柱图",icon:"icon-columnt",type:"column",
		property : {
			legendShow : true,
			xAxisLine : true,
			xAxisLabel : true,
			yAxisLine : true,
			yAxisLabel : true,
			plotLabel : false,
			
			bgColor : '#FFF',
			xAxisColor : '#333',
			yAxisColor : '#333',
			legendColor : '#333',
			colorGroup : '#43A3FB,#1FCE6D,#96D02F,#F9D24A,#FAA449,#985FDE,#985FDE,#3564EC,#1A63C6,' +
			 			 '#A0D5FF,#7CC5FE,#BBE958,#FDD3A6,#9D98FD,#BE6BE0,#9EA7B4,#8B96A8,#7F8B9C',			
			xAxisFontSize : '12px',
			yAxisFontSize : '12px',
			legendFontSize : '12px',
			xAxisFontFamily : '微软雅黑体',
			yAxisFontFamily : '微软雅黑体',
			legendFontFamily : '微软雅黑体',
			
			opacity : '100%',
			location : 'center'
		}
	},
    {
		name:"条图",icon:"icon-sum",type:"bar",
		property : {
			legendShow : true,
			xAxisLine : true,
			xAxisLabel : true,
			yAxisLine : true,
			yAxisLabel : true,
			plotLabel : false,
			
			bgColor : '#FFF',
			xAxisColor : '#333',
			yAxisColor : '#333',
			legendColor : '#333',
			colorGroup : '#43A3FB,#1FCE6D,#96D02F,#F9D24A,#FAA449,#985FDE,#985FDE,#3564EC,#1A63C6,' +
						 '#A0D5FF,#7CC5FE,#BBE958,#FDD3A6,#9D98FD,#BE6BE0,#9EA7B4,#8B96A8,#7F8B9C',		
			
			xAxisFontSize : '12px',
			yAxisFontSize : '12px',
			legendFontSize : '12px',
			xAxisFontFamily : '微软雅黑体',
			yAxisFontFamily : '微软雅黑体',
			legendFontFamily : '微软雅黑体',
			
			opacity : '100%',
			location : 'center'
		}
	},
    {
		name:"饼图",icon:"icon-pie",type:"pie",
		property : {
			legendShow : true,
			plotLabel : false,
			bgColor : '#FFF',
			colorGroup : '#43A3FB,#1FCE6D,#96D02F,#F9D24A,#FAA449,#985FDE,#985FDE,#3564EC,#1A63C6,' +
			 			 '#A0D5FF,#7CC5FE,#BBE958,#FDD3A6,#9D98FD,#BE6BE0,#9EA7B4,#8B96A8,#7F8B9C',					
			opacity : '100%',
			radius : 'false',
			location : 'center'
		}
	},
    {
		name:"地图",icon:"icon-map",type:"map",
		property : {
			legendShow : true,
			theme : 'default',
			opacity : '100%',
			bgColor : '#FFF',
			colorGroup : '#43A3FB,#1FCE6D,#96D02F,#F9D24A,#FAA449,#985FDE,#985FDE,#3564EC,#1A63C6,' +
						 '#A0D5FF,#7CC5FE,#BBE958,#FDD3A6,#9D98FD,#BE6BE0,#9EA7B4,#8B96A8,#7F8B9C',		
			location : 'center',
		}
	},
    {
		name:"表格",icon:"icon-table",type:"table",
		property : {
			titleFontSize : '12px',
			titleFontColor : 'gray',
			valueFontSize : '12px',
			valueFontColor : 'gray'
		}
	},
    {
		name:"概览",icon:"icon-overview",type:"overview",
		property : {
			titleFontSize : '12px',
			titleFontColor : 'gray',
			valueFontSize : '12px',
			valueFontColor : 'gray'
		}
	},
    {
		name:"时间",icon:"icon-date",type:"date",
		property : { date : '20170201~20170301'}
	},
    {
		name:"Banner",icon:"icon-banner",type:"banner",
		property : {
			bgColor : '#FFF',
			border : false,
			opacity : '100%',
		}
	},
    {
		name:"文字",icon:"icon-text",type:"text",
		property : {
			textValue : '',
			textFontSize : '12px',
			textFontColor : 'black',
			textFontFamily : '微软雅黑体',
			hyperlink : false,
			href : ''
		}
	},
    {
		name:"图片",icon:"icon-img",type:"img",
		property : {
			imgName : '',
			imgPath : ''
		}
	}
];



