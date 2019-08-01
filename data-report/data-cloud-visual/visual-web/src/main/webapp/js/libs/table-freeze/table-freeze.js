$.fn.getBrowser = function(){
	var browser = "";
	var explorer =navigator.userAgent;
	if (explorer.indexOf("MSIE") >= 0) {
		browser = "IE";
	}else if (explorer.indexOf("Firefox") >= 0) {
		browser = "Firefox";
	}else if(explorer.indexOf("Chrome") >= 0){
		browser = "Chrome";
	}else if(explorer.indexOf("Opera") >= 0){
		browser = "Opera";
	}else if(explorer.indexOf("Safari") >= 0){
		browser = "Safari";
	}else if(explorer.indexOf("Netscape")>= 0) { 
		browser = "Netscape";
	} 	
	return browser;
}
$.fn.mergeAttributes = function(src){
	var browser = $(this).getBrowser();
	if(browser == 'IE') {
		$(this).get(0).mergeAttributes(src.get(0));
	}else{
		attrs = src.get(0).attributes;
		i = attrs.length - 1;
		for(;i>=0;i--){
			var name = attrs[i].name;
			if(name.toLowerCase() === 'id' || name.toLowerCase() === 'ng-table' || attrs[i].value=="" || attrs[i].value==null ||attrs[i].value=="null"){
				continue;
			}
			try{
				$(this).attr(name,attrs[i].value);
			}catch(e){
			}
		}
	}
}
$.fn.FrozenTable = function(iRowHead,iRowFoot,iColLeft){
	var oTable = $(this);
	var oTableId = oTable.attr("id");
	var oDiv = $(this).parent();
	if(oDiv.length > 0 && oDiv.get(0).tagName != "DIV") return;
	//oTable.find("td").attr("noWrap","nowrap");
	//oTable.css("table-layout","fixed");
	
	var ngTableAttr = $("#"+oTableId).attr("ng-table");
	if(ngTableAttr){
		var nDivId = 'oDivH_' + oTableId;
		oDiv.siblings(".clone-div").remove();
		
		var $thead = oTable.find("thead");
		//$thead.css({"visibility":"visible"});
		//$thead.removeClass("ng-hide");
		//oDiv.css({"margin-top":"0px"});
		
		setTimeout(function(){
			oDiv.siblings(".clone-div").remove();
			var oCloneDiv = $("<div id='"+nDivId+"' style='position:absolute;' class='clone-div'><table></table></div>");
			oDiv.parent().append(oCloneDiv);
			oCloneDiv.find("table").CloneNgTable(oTable,0,iRowHead,-1);
			$(this).resetNgTable(oTable,oCloneDiv,oDiv);
		},50);
		
	}else{
		if(oTable.width()>oDiv.width() && oTable.height()>oDiv.height()){
			if(iRowHead>0 && iColLeft>0){
				var nTableId = 'oTableLH_' + oTableId;
				$("#"+nTableId).remove();
				var oCloneTable = $("<table id='"+nTableId+"'></table>");
				oDiv.parent().append(oCloneTable);
				oCloneTable.CloneTable(oTable,0,iRowHead,iColLeft);
				oCloneTable.css("position","absolute");
				oCloneTable.css("z-index","1004");
				oCloneTable.css("left",oDiv.offset().left);
				oCloneTable.css("top",oDiv.offset().top);
			}
			if(iRowFoot>0 && iColLeft>0){
				var nTableId = 'oTableLF_' + oTableId;
				$("#"+nTableId).remove();
				var oCloneTable = $("<table id='"+nTableId+"'></table>");							
				oDiv.parent().append(oCloneTable);
				oCloneTable.CloneTable(oTable,oTable.find("tr").length-iRowFoot,oTable.find("tr").length,iColLeft);
				oCloneTable.css("position","absolute");
				oCloneTable.css("z-index","1003");
				oCloneTable.css("left",oDiv.offset().left);
				oCloneTable.css("top",(oDiv.offset().top+oDiv.outerHeight(true)-oCloneTable.outerHeight(true)-17));
			}
		}
		if(iRowHead>0 && oTable.height()>oDiv.height()){
			var nDivId = 'oDivH_' + oTableId;
			$("#"+nDivId).remove();
			var oCloneDiv = $("<div id='"+nDivId+"'><table></table></div>");
			oDiv.parent().append(oCloneDiv);
			oCloneDiv.find("table").CloneTable(oTable,0,iRowHead,-1);
			oCloneDiv.css("overflow","hidden");
			oCloneDiv.css("width",oDiv.outerWidth(true)-17);
			oCloneDiv.css("position","absolute");
			oCloneDiv.css("z-index","1002");
			oCloneDiv.css("left",oDiv.offset().left);
			oCloneDiv.css("top",oDiv.offset().top);
		}
		if(iRowFoot>0 && oTable.height()>oDiv.height()){
			var nDivId = 'oDivF_' + oTableId;
			$("#"+nDivId).remove();
			var oCloneDiv = $("<div id='"+nDivId+"'><table></table></div>");
			oDiv.parent().append(oCloneDiv);
			oCloneDiv.find("table").CloneTable(oTable,oTable.find("tr").length-iRowFoot,oTable.find("tr").length,-1);
			oCloneDiv.css("overflow","hidden");
			oCloneDiv.css("width",oDiv.outerWidth(true)-17);
			oCloneDiv.css("position","absolute");
			oCloneDiv.css("z-index","1001");
			oCloneDiv.css("left",oDiv.offset().left);
			oCloneDiv.css("top",oDiv.offset().top+oDiv.outerHeight(true)-oCloneTable.outerHeight(true)-17);
		}
		if(iColLeft>0 && oTable.width()>oDiv.width()){
			var nDivId = 'oDivL_' + oTableId;
			$("#"+nDivId).remove();
			var oCloneDiv = $("<div id='"+nDivId+"'><table></table></div>");
			oDiv.parent().append(oCloneDiv);
			oCloneDiv.find("table").CloneTable(oTable,0,oTable.find("tr").length,iColLeft);
			oCloneDiv.css("overflow","hidden");
			oCloneDiv.css("height",oDiv.outerHeight(true)-17);
			oCloneDiv.css("position","absolute");
			oCloneDiv.css("z-index","1000");
			oCloneDiv.css("left",oDiv.offset().left);
			oCloneDiv.css("top",oDiv.offset().top);
		}
	}
	
	oDiv.scroll(function(){
		if(typeof($("#oDivH_"+oTableId).get(0))!='undefined'){
			$("#oDivH_"+oTableId).scrollLeft($(this).scrollLeft());
		}
		if(typeof($("#oDivF_"+oTableId).get(0))!='undefined'){
			$("#oDivF_"+oTableId).scrollLeft($(this).scrollLeft());
		}
		if(typeof($("#oDivL_"+oTableId).get(0))!='undefined'){
			$("#oDivL_"+oTableId).scrollTop($(this).scrollTop());
		}
	});
};

$.fn.calNgTableBody = function($ngTableBody){
	
}

$.fn.resetNgTable = function(oTable,oCloneDiv,oDiv){
	var $thead = oTable.find("thead").last();
	var $ngTableContainer = oTable.parentsUntil(".ng-table-container").parent();
	var $ngTableHead = $ngTableContainer.find(".ng-table-head");
	var $moreSearchBox = $ngTableContainer.find(".more-search-box");
	var $formHorizontalTag = $ngTableContainer.find(".form-horizontal-tag");
	var $ngTableBody = $ngTableContainer.find(".ng-table-body");
	var theadHg = $thead.outerHeight();
	var ngTableHeadHg = $ngTableHead.outerHeight();
	var moreSearchBoxHg = $moreSearchBox.outerHeight();
	var formHorizontalTagHg = $formHorizontalTag.height();
	var top = ngTableHeadHg ;
	if(moreSearchBoxHg){
		top = ngTableHeadHg + moreSearchBoxHg;
	}else if(formHorizontalTagHg){
		top = ngTableHeadHg + formHorizontalTagHg;
	}
	top = 0;
	//setTimeout(function(){
		oCloneDiv.css({
			"overflow":"hidden",
			//"width":oDiv.outerWidth(true) ,
			"width":"calc(100% + 1px)",
			"position":"absolute",
			"z-index":"1",
			"left":"0",
			"top":top,
			//"border-right":"1px solid #e7ebef"
		});
		$ngTableBody.scrollTop(0);
		//$thead.css({"visibility":"hidden"});
		//$thead.addClass("ng-hide");
		//oDiv.css({"margin-top":theadHg+"px"});
	//},100);
};

$.fn.CloneNgTable = function(oSrcTable,iRowStart,iRowEnd,iColumnEnd){
	var iWidth = 0,iHeight = 0;
	$(this).mergeAttributes(oSrcTable);
	var Log="";
	var rowspanValue = 0;
	var rowNumber = 0;
	var rowIndex;
	for(var i=iRowStart;i<iRowEnd;i++){
		var thead = oSrcTable.children("thead").last();
		var oldTr = thead.find("tr").eq(i);
		//var oldTr = oSrcTable.find("thead tr").eq(i);
		var isSingleRowspan = false;
		var rowspanCount = 0;
		var colCount = 0;
		var colNumber = 0;
		for(var j=0; j<(iColumnEnd==-1?oldTr.find("th").length:iColumnEnd); j++){
			var oidTd = oldTr.find("th").eq(j);
			colNumber++;
			var colspan = oidTd.attr("colspan");
			if (typeof(colspan)=="undefined" || colspan==1) { 
			   colCount += 1;
			}else{
			   colCount += colspan;
			}  
			var rowspan = oidTd.attr("rowspan");
			if(typeof(rowspan)!="undefined" && rowspan!=1){
				rowspanCount++;
				rowIndex = i;
				rowspanValue = rowspan;
				rowNumber = rowspanCount;
			}
			if(colCount>=iColumnEnd && iColumnEnd!=-1){
				break;
			}
		} 
		Log +=i+"=="+rowIndex+"="+rowspanCount+"="+rowNumber+"="+rowspanValue+"<br>";
		if(i>rowIndex && i<=(rowIndex+rowspanValue-1) && iColumnEnd!=-1){
			if(rowNumber!=0 && iColumnEnd==rowNumber){
				isSingleRowspan = true;
			}else{
				colNumber -= 1;
				if(rowspanCount==0){
					colNumber -= (rowNumber-1);
				}
			}
		}
		if(colNumber!=0){
			var newThead = $("<thead></thead>");
			var newTr = $("<tr></tr>");
			newTr.mergeAttributes(oldTr);
			var jWidth = 0;
			iHeight += oldTr.outerHeight(true);
			for(var j=0; j<colNumber;j++){
				if(isSingleRowspan){
					continue;
				}
				var oidTd = oldTr.find("th").eq(j);
				var newTd = oidTd.clone();
				
				/*IE 一行多列合并时
				if(iColumnEnd==-1 && iRowStart!=0 && $.browser.msie){
					if (typeof(newTd.attr("colspan"))!="undefined" && newTd.attr("colspan")!=1) { 
						alert(newTd.text()+"==2=="+newTd.attr("colspan")+"---"+colCount);
					}  
				}
				if(iColumnEnd==-1 && iRowStart!=0 && j==1){
				    newTd.width(oidTd.outerWidth(true)-1);
					jWidth += (oidTd.outerWidth(true)-1);
				}else{
					newTd.width(oidTd.outerWidth(true));
					jWidth += oidTd.outerWidth(true);
				}*/

				newTd.height(oidTd.outerHeight(true));
				newTd.width(oidTd.outerWidth(true));
				jWidth += oidTd.outerWidth(true);
				iWidth = Math.max(iWidth,jWidth);
				newTr.append(newTd);
			}
			newThead.append(newTr);
			$(this).append(newThead);
		}
	}
	//$(this).width(iWidth);
	$(this).width("100%");
	$(this).height(iHeight);
}

$.fn.CloneTable = function(oSrcTable,iRowStart,iRowEnd,iColumnEnd){
	var iWidth = 0,iHeight = 0;
	$(this).mergeAttributes(oSrcTable);
	var Log="";
	var rowspanValue = 0;
	var rowNumber = 0;
	var rowIndex;
	for(var i=iRowStart;i<iRowEnd;i++){
		var oldTr = oSrcTable.find("tr").eq(i);
		var isSingleRowspan = false;
		var rowspanCount = 0;
		var colCount = 0;
		var colNumber = 0;
		for(var j=0; j<(iColumnEnd==-1?oldTr.find("td").length:iColumnEnd); j++){
			var oidTd = oldTr.find("td").eq(j);
			colNumber++;
			var colspan = oidTd.attr("colspan");
			if (typeof(colspan)=="undefined" || colspan==1) { 
			   colCount += 1;
			}else{
			   colCount += colspan;
			}  
			var rowspan = oidTd.attr("rowspan");
			if(typeof(rowspan)!="undefined" && rowspan!=1){
				rowspanCount++;
				rowIndex = i;
				rowspanValue = rowspan;
				rowNumber = rowspanCount;
			}
			if(colCount>=iColumnEnd && iColumnEnd!=-1){
				break;
			}
		} 
		Log +=i+"=="+rowIndex+"="+rowspanCount+"="+rowNumber+"="+rowspanValue+"<br>";
		if(i>rowIndex && i<=(rowIndex+rowspanValue-1) && iColumnEnd!=-1){
			if(rowNumber!=0 && iColumnEnd==rowNumber){
				isSingleRowspan = true;
			}else{
				colNumber -= 1;
				if(rowspanCount==0){
					colNumber -= (rowNumber-1);
				}
			}
		}
		if(colNumber!=0){
			var newTr = $("<tr></tr>");
			newTr.mergeAttributes(oldTr);
			var jWidth = 0;
			iHeight += oldTr.outerHeight(true);
			for(var j=0; j<colNumber;j++){
				if(isSingleRowspan){
					continue;
				}
				var oidTd = oldTr.find("td").eq(j);
				var newTd = oidTd.clone();
				
				/*IE 一行多列合并时
				if(iColumnEnd==-1 && iRowStart!=0 && $.browser.msie){
					if (typeof(newTd.attr("colspan"))!="undefined" && newTd.attr("colspan")!=1) { 
						alert(newTd.text()+"==2=="+newTd.attr("colspan")+"---"+colCount);
					}  
				}
				if(iColumnEnd==-1 && iRowStart!=0 && j==1){
				    newTd.width(oidTd.outerWidth(true)-1);
					jWidth += (oidTd.outerWidth(true)-1);
				}else{
					newTd.width(oidTd.outerWidth(true));
					jWidth += oidTd.outerWidth(true);
				}*/

				newTd.height(oidTd.outerHeight(true));
				newTd.width(oidTd.outerWidth(true));
				jWidth += oidTd.outerWidth(true);
				iWidth = Math.max(iWidth,jWidth);
				newTr.append(newTd);
			}
			$(this).append(newTr);
		}
	}
	$(this).width(iWidth);
	$(this).height(iHeight);
}