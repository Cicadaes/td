define(['app'], function (app) {
  'use strict';
  app.filter('DateFormatDefault',function(){
	    return function(d){
	    	var formatStr = ""; 
	    	if(d != null){
	    		var sign = '-';
		    	var myDate = new Date(parseInt(d));
		    	var fullYear = myDate.getFullYear();
		    	var month = myDate.getMonth()+1; 
		    	var date = myDate.getDate(); 
		    	var hours = myDate.getHours();       //获取当前小时数(0-23)
		    	var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
		    	var seconds = myDate.getSeconds();     //获取当前秒数(0-59)
		    	//myDate.getMilliseconds();    //获取当前毫秒数(0-999)
		    	if(month < 10){
		    		month = '0' + month;
		    	}
		    	if(date < 10){
		    		date = '0' + date;
		    	}
		    	if(hours < 10){
		    		hours = '0' + hours;
		    	}
		    	if(minutes < 10){
		    		minutes = '0' + minutes;
		    	}
		    	if(seconds < 10){
		    		seconds = '0' + seconds;
		    	}
		    	formatStr = fullYear + sign + month + sign + date;
		    	formatStr = formatStr + ' ' + hours + ':' + minutes;
	    	}
	    	return formatStr;
	    }
  });
  app.filter('trusted', ['$sce', function ($sce) {
	  return function(url) {
		  return $sce.trustAsResourceUrl(url);
	  };
  }]);
  app.filter('dateFormat', [ function($rootScope,$http) {
      return function(date){
    	  if(!date){
    		  return;
    	  }
    	  date= date+"";
      	  var dateArr = date.split("-");
      	  if(dateArr.length>1){
      		  return dateArr[0] + "-" +dateArr[1] + "-" +dateArr[2];
      	  }else{
      		  return date.substring(0,4)+"-"+date.substring(4,6)+"-"+date.substring(6,8);
      	  }
      };
  }]);
  app.filter('numberFilter', ['$rootScope',function($rootScope) {
	  return function(s,u,n,d){
		  if(s == undefined){
			  return;
		  }
		  var unit = '';
		  if(u == undefined){
			  u =1;
		  }
		  if(d == undefined){
			  d = true;
		  }
		  if(u == 100000000){
			  unit = '亿';
		  }else if(u == 10000){
			  unit = '万';
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
	  };
  }]);
  
  app.filter('dataStrSubstring', [ function($rootScope) {
      return function(data, length){
    	if(data == undefined){
			  return;
		}
    	length = length > 0 ? length : 5; 
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
              if(len >= 2 * length +1){
              	j=i;
              	break;
              }
			}
  		if(len >= 2 * length +1){
  			data=data.substring(0,j)+"...";
  		}
  		return data; 
      };
  }]);
});





