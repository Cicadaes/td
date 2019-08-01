var TableOptions = {
	defaultTable: function(table,ngTableParams,$filter){//纵向柱状图
		var sort = "1";
		if(table.sort){
			sort =table.sort;
		}
		var defaultTable =new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            sorting: {
            	sort: 'desc'     // initial sorting
            },
            refresh: Math.random()
        }, {
            total: table.datas.length, // length of data
            getData: function ($defer, params) {
            	if(window.parent && window.parent.iFrameHeight){
    				window.setTimeout(window.parent.iFrameHeight,200);
    			}
	            var orderedData = params.sorting() ? $filter('orderBy')(table.datas, params.orderBy()) :table.datas;
	
	            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        return defaultTable; 
    },
    noCountsTable: function(table,ngTableParams,$filter){//纵向柱状图
    	var sort = "1";
    	if(table.sort){
    		sort =table.sort;
    	}
    	var defaultTable =new ngTableParams({
    		page: 1,            // show first page
    		count: 10,           // count per page
    		sorting: {
    			sort: 'desc'     // initial sorting
    		},
    		refresh: Math.random()
    	}, {
    		counts:[],
    		total: table.datas.length, // length of data
    		getData: function ($defer, params) {
    			if(window.parent && window.parent.iFrameHeight){
    				window.setTimeout(window.parent.iFrameHeight,200);
    			}
    			var orderedData = params.sorting() ? $filter('orderBy')(table.datas, params.orderBy()) :table.datas;
    			
    			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    		}
    	});
    	return defaultTable; 
    },
    defaultTableKeep: function(table,ngTableParams,$filter){//纵向柱状图
		var sort = "1";
		if(table.sort){
			sort =table.sort;
		}
		var defaultTable =new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            sorting: {
            	'1': 'desc'     // initial sorting
            },
            refresh: Math.random()
        }, {
            total: table.datas.length, // length of data
            getData: function ($defer, params) {
	            var orderedData = params.sorting() ? $filter('orderBy')(table.datas, params.orderBy()) :table.datas;
	            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        return defaultTable; 
    },
    defaultTableAsc: function(table,ngTableParams,$filter){
    	var defaultTable =new ngTableParams({
    		page: 1,            // show first page
    		count: 10,           // count per page
    		sorting: {
    			'0': 'asc'     // initial sorting
    		},
    		refresh: Math.random()
    	}, {
    		total: table.datas.length, // length of data
    		getData: function ($defer, params) {
    			var orderedData = params.sorting() ? $filter('orderBy')(table.datas, params.orderBy()) :table.datas;
    			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    		}
    	});
    	return defaultTable; 
    },
    defaultTableDesc: function(table,ngTableParams,$filter){
    	var defaultTable =new ngTableParams({
    		page: 1,            // show first page
    		count: 10,           // count per page
    		sorting: {
    			'0': 'desc'     // initial sorting
    		},
    		refresh: Math.random()
    	}, {
    		total: table.datas.length, // length of data
    		getData: function ($defer, params) {
    			var orderedData = params.sorting() ? $filter('orderBy')(table.datas, params.orderBy()) :table.datas;
    			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    		}
    	});
    	return defaultTable; 
    },
    // For Object rather than Array.
    objTableDesc: function(table,ngTableParams,$filter){//纵向柱状图
    	var defaultTable =new ngTableParams({
    		page: 1,            // show first page
    		count: 10,           // count per page
    		sorting: {
    			'id': 'desc'     // initial sorting
    		},
    		refresh: Math.random()
    	}, {
    		total: table.datas.length, // length of data
    		getData: function ($defer, params) {
    			if(window.parent && window.parent.iFrameHeight){
    				window.setTimeout(window.parent.iFrameHeight,200);
    			}
    			var orderedData = params.sorting() ? $filter('orderBy')(table.datas, params.orderBy()) :table.datas;
    			
    			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    		}
    	});
    	return defaultTable; 
    },
	simpleTable: function(datas,ngTableParams){//纵向柱状图
		var simpleTable =new ngTableParams({
        	refresh: Math.random()
        }, {
            counts:[],
            getData: function ($defer, params) {
            $defer.resolve(datas);
            }
        });
        return simpleTable; 
    },
	noSortTable: function(table,ngTableParams,$filter){//纵向柱状图
		var defaultTable =new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            refresh: Math.random()
        }, {
            total: table.datas.length, // length of data
            getData: function ($defer, params) {
            	if(window.parent && window.parent.iFrameHeight){
    				window.setTimeout(window.parent.iFrameHeight,200);
    			}
            	$defer.resolve(table.datas.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        return defaultTable; 
    },
    
}
