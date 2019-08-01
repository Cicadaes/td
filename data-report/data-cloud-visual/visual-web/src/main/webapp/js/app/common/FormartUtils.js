var FormartUtils = {
	dateFormat : function(data) {// 20151010 --> 10/10
		if(data.length == 8){
			var m = data.substring(4,6);
			if(m.substring(0,1)==0){
				m = m.substring(1,m.length);
			}
			return m+"/"+data.substring(6,8);
		}
	},
	dateFormat2 : function(data) {// 20151010 --> 2015/10/XX 按周
		if(data.length == 8){
			var y = data.substring(0,4);
			var m = data.substring(4,6);
			var d = data.substring(6,8);
			var date = new Date();
			date.setDate(d);
			date.setMonth(m - 1); 
			date.setFullYear(y);
			var day = date.getDay();
			var date2 = date.setDate(date.getDate() - day)
			return   date.Format("yyyy/MM/dd");  
		}
	},
	dateFormat3 : function(data) {// 20151010 --> 2015/10  按月
		if(data.length == 8){
			var y = data.substring(0,4);
			var m = data.substring(4,6);
			return y+"/"+m;
		}
	},

	seToMinFormat : function(date) {// 100 --> 01:40
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
	},
	seToSignFormat : function(date) {// 100 --> 01:40
	
        	return date+"%";
        
	},
	strArrToNum :function(strArr){// ["1"] -->[1]
		for(var i =0;i<strArr.length;i++){
			strArr[i]=Number(strArr[i]);
		}
		return strArr;
	},
	specialStrArrToNumArr :function(strArr){// [{"jsonid":"0","text":[],"y":"230"}] -->[230]
		for(var i =0;i<strArr.length;i++){
			strArr[i]=Number(strArr[i].y);
		}
		return strArr;
	},
	strArrsToNum :function(strArrs){// [["1"]] -->[[1]]
		for(var i =0;i<strArrs.length;i++){
			for(var j =0;j<strArrs[i].length;j++){
				if(!isNaN(strArrs[i][j])){
					strArrs[i][j] = Number(strArrs[i][j]);
    			}
			}
		}
		return strArrs;
	},
	strArrsToNumNotOne :function(strArrs){// [["1"]] -->[[1]]
		for(var i =0;i<strArrs.length;i++){
			for(var j =0;j<strArrs[i].length;j++){
				if(!isNaN(strArrs[i][j])  && j!=1){
					strArrs[i][j] = Number(strArrs[i][j]);
				}
			}
		}
		return strArrs;
	},
	specialStrArrToNum :function(strArrs){// [["1^0.1"]] -->[[1,0.1]]
		for(var i =0;i<strArrs.length;i++){
			for(var j=strArrs[i].length-1;j>0;j--){
				if(strArrs[i][j]!=null&&strArrs[i][j].indexOf("^")>=0){
					var strArr = strArrs[i][j].split("^");
					strArrs[i].splice(j,1,strArr[0],strArr[1]);
				}
			}
		}
		strArrs = FormartUtils.strArrsToNum(strArrs);
		return strArrs;
	},
	dataToPercent : function(data){
		return data+"%";
	},
	IsBigThanZero : function(strArr){
		var flag =true;
		for(var i =0;i<strArr.length;i++){
			if(strArr[i]>0){
				flag =false;
			}
		}
		return flag;
	},
	getDateStr : function(date){
		date  +="";
		var y = date.substring(0,4);
		var m = date.substring(4,6);
		var d = date.substring(6,8);
		return y+"-"+m+"-"+d; 
	},
	hourFormat : function(date){
		date +="";
		if(date.length<2){
			date = "0"+date;
		}
		return date+":00~"+date+":59";
	},
	getDateCondition:function(day,month,year,date){
		var dd = date?new Date(date):new Date();
		dd.setDate(dd.getDate()+(day?day:0));
		dd.setMonth(dd.getMonth()+(month?month:0));
		dd.setFullYear(dd.getFullYear()+(year?year:0));
		var y = dd.getFullYear(); 
		var m = dd.getMonth()+1;
		if((m+"").length == 1){
			m  = "0" + m;
		}
		var d = dd.getDate(); 
		if((d+"").length == 1){
			d = "0" + d;
		}
		return y+"-"+m+"-"+d; 
	},
	LongToDateStr:function(long){
		Date.prototype.format = function(f){
		    var o ={
		        "M+" : this.getMonth()+1, //month
		        "d+" : this.getDate(),    //day
		        "h+" : this.getHours(),   //hour
		        "m+" : this.getMinutes(), //minute
		        "s+" : this.getSeconds(), //second
		        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		        "S" : this.getMilliseconds() //millisecond
		    }
		    if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
		    for(var k in o)
		        if(new RegExp("("+ k +")").test(f))f = f.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));return f
		};
		var d =  new Date(long);
		return d.format('yyyy-MM-dd~hh:mm:ss');
	},
	LengthLimit:function(x){
		return '<div class="t-o-e wd110" title="'+x+'">'+x+'</div>';
	},
	platformFormat:function(pagename){
		var split=pagename.split(",");
		if(split.length>1){
			if(split[1] == "1"){
				split[1] = "logo_android_min";
			}else if(split[1] == "2"){
				split[1] = "logo_apple_min";
			}else if(split[1] == "4"){
				split[1] = "logo_winp_min";
			}
			var img = '<img style="vertical-align:middle;height: 20px;" src="images/'+split[1]+'.png" class="fl">';
			return '<div class="clrfix wd130">'+img+'<div class="t-o-e wd100 fl ml-5" title="'+split[0]+'">'+split[0]+'</div></div>';
		}else{
			return '<div class="t-o-e wd100 fl ml-5" title="'+split[0]+'">'+split[0]+'</div>';
		}
	},
	eventFormat:function(pagename){
		var split=pagename.split(",");
		if(split.length>1 && split[1] == "1"){
			if(split[1] == "1"){
				split[1] = "Flexible";
			}
			var img = '<img style="vertical-align:middle;height: 20px;" src="images/'+split[1]+'.png" class="fl">';
			return '<div class="clrfix wd130">'+img+'<div class="t-o-e wd100 fl ml-10" title="'+split[0]+'">'+split[0]+'</div></div>';
		}else{
			return '<div class="t-o-e wd100 fl pl-5" title="'+split[0]+'">'+split[0]+'</div>';
		}
	},
	D_valueFormat:function(oneDate,twoDate){
		var _oneDate = new Date(Number(oneDate.substring(0,4)),Number(oneDate.substring(4,6)-1),Number(oneDate.substring(6,8)));
		var _twoDate = new Date(Number(twoDate.substring(0,4)),Number(twoDate.substring(4,6)-1),Number(twoDate.substring(6,8)));
		return parseInt((_oneDate - _twoDate) / 1000 / 60 / 60 /24);
	},
	longToDateStr :function(long){
		Date.prototype.format = function(f){
		    var o ={
		        "M+" : this.getMonth()+1, //month
		        "d+" : this.getDate(),    //day
		        "h+" : this.getHours(),   //hour
		        "m+" : this.getMinutes(), //minute
		        "s+" : this.getSeconds(), //second
		        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		        "S" : this.getMilliseconds() //millisecond
		    }
		    if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
		    for(var k in o)
		        if(new RegExp("("+ k +")").test(f))f = f.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));return f
		};
		var d =  new Date(long);
		return d.format('yyyy-MM-dd hh:mm:ss');
	},
	formatPercent :function(data){
		data+="";
		var split=data.split(".");
		if(split.length<2){
			return data+".00";
		}
		if(split[1].length==1){
			return data+"0";
		}else{
			return data;
		}
	},
	formatPercentPer :function(data){
		data+="";
		var split=data.split(".");
		if(split.length<2){
			return data+".00%";
		}
		if(split[1].length==1){
			return data+"0%";
		}else{
			return data+"%";
		}
	},
	initHeight :function(){
		if(window.parent && window.parent.iFrameHeight){
			window.setTimeout(window.parent.iFrameHeight,200);
		}
	},
	numFormat :function(data){
		data+="";
		var split=data.split(".");
		if(split.length<2){
			return data+".00";
		}
		if(split[1].length==1){
			return data+"0";
		}else{
			return data;
		}
	},
	HighChartDateFormat :function(date) {
		var sign = ".";
		if(date.length == 8){
			var y = date.substring(0,4);
			var m = date.substring(4,6);
			var d = date.substring(6,8);
			return y + sign + m + sign + d;
		}
		return date;
	},
	HighChartPlatformForamt :function(name) {
		if(name.indexOf(",")>0){
			var na="";
			if(name.split(",")[1]==1){
				na+="Android";
			}else if(name.split(",")[1]==2){
				na+="iOS";
			}else{
				na+="WP7";
			}
			return name.split(",")[0]+"("+na+")";
		}
		return name;
	},
	ExportFormat :function(category) {
		if("0"==category){
			return "nativepage";
	    }else if ("3"==category){
	    	return "crosspage";
	    }else{
	    	return "webpage";
	    }
	},
	dataDivisionFomart :function(dataArr,num) {
		if(num > 0){
			for (var i = 0; i < dataArr.length; i++) {
				dataArr[i] = parseFloat((dataArr[i] / num).toFixed(2));
			}
		}
		return dataArr;
	},
	maxMetricsData : function(dataArr) {
		var datas = [];
		for (var i = 0; i < dataArr.length; i++) {
			datas = datas.concat(dataArr[i].data);
		}
		return datas.length > 0 ? Math.max.apply(null, datas) : 0;
	},
	dataStrSubstring : function(data, length) {
    	if(data == undefined){
			  return;
		}
    	length = length > 0 ? length : 6; 
    	if(!data){
    		return;
    	}
    	if(length >= data.length){
    		return data;
    	}
    	var len=0;
    	var j=0;
    	for (var i = 0; i < data.length; i++) {
    		var c = data.charCodeAt(i);
            //单字节加1 
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
            if(len> 2 * length +1){
            	j=i;
            	break;
            }
			}
		if(len > 2 * length +1){
			data=data.substring(0,j)+"...";
		}
		return data; 
    },
    numberFormart : function(s,u,n,d) {
		if(s == undefined){
			return;
		}
		var unit = '';
		if(u == undefined){
			u =1;
			if(s >= 1000000000){
				u = 100000000;
				unit = '亿';
			}else if(s >= 100000){
				u = 10000;
				unit = '万';
			}
		}else{
			if(u == 100000000){
				unit = '亿';
			}else if(u == 10000){
				unit = '万';
			}
		}
		if(d == undefined){
			d = true;
		}
		if(n == undefined){
			n=0;
		}
		n = n > 0 && n <= 20 ? n : 0;
		s = (s/u).toFixed(n);
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
		var l = s.split(".")[0].split("").reverse(),   
		r = s.split(".")[1],t = "";   
		for(var i = 0; i < l.length; i ++ ){   
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
		}   
		t = t.split("").reverse().join("");
		if(r != undefined && parseInt(r) !=0){
			t += "." + r;   
		}
		if(d){
			t += unit;
		}
		return t;
	},
    toFix : function(num, n){
    	if(num == undefined){
    		return;
    	}
    	if(n == undefined){
    		n = 2;
    	}
    	var _num = String(num);
        var dian = _num.indexOf('.');
        var result = "";    
        if(dian == -1){    
            result =  num.toFixed(n);
        }else{
        	var cc = _num.substring(dian+1, _num.length);
        	if(cc.length >= n){
        		result = _num.substring(0, dian + n + 1);
        	}else{
        		result =  num.toFixed(n); 
        	}
        }
        return result;
    }
}





