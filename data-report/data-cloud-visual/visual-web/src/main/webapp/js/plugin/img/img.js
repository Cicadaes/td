define(['app','angularAMD','app/directive/EChart'], function (app,angularAMD) {
    'use strict';
    angularAMD.directive('pluginImg',['$compile','Upload','$location',
        function($compile,Upload,$location) {
    	return {
    		require: '?ngModel',
    		restrict : 'EA',
    		transclude : true,
            scope:{
            	tdChange: "&",
            	pluginReportCallback : "&",
            	data : "=",
            	showflag : "="
    		},
            replace: false,
            template: '<div class="imgc"><div class="img fl"></div><div class="uploadImgBtn fr" ng-click="initImport();" data-template="html/common/fileDialog.html" bs-modal="modal" data-backdrop="false" style="display:none;">上传图片</div></div>',
            link: function(scope,elem,ngModel) {
            	var path = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;
            	scope.createReportLineChartData = function(report){
        			var id = report.id,
        				reportProperty = report.reportProperty,
        				imgPath = reportProperty.propertyMap.imgPath,
        				$reportHtml = $('#' +id),
        				height = $reportHtml.height(),
        				width = $reportHtml.width();
        			$($reportHtml.find('.img')).css({
        				'height' : height + 'px',
        				'width' : width + 'px'
        			});
        			if (imgPath != null && imgPath != '') {
        				$($reportHtml.find('.img')).css({
        					'background': 'url("'+ path + imgPath +'") no-repeat',
        					'background-size' : '100% 100%'
        				});
        			}
        			if (scope.showflag) {
        				var $imgc = $reportHtml.find('.imgc'),
        					$imgBtn = $imgc.children('.uploadImgBtn');
        				$($imgc).mouseover(function(e){
        					$imgBtn.show();
        				});
        				$($imgc).mouseout(function(e){
        					$imgBtn.hide();
        				});
        			}
            	}
            	
    			scope.$watch('data', function(event, report) {
    				if (scope.data) {
    					scope.createReportLineChartData(scope.data);
					}
                });
    			
    			scope.initImport=function(){
    				scope.f=null;
    				scope.uploadFile = {};
    				scope.uploadFile.dataFile;
    				scope.uploadFile.description = "";
    				scope.uploadFile.uploadFileName = '请选择文件上传';
    			}
    			
    			scope.selectUploadFile = function(file){
    				scope.f = file;
    		        if (file && !file.$error) {
    		        	if (file[0].type.indexOf('image') < 0) {
    		        		scope.uploadFile.dataFile = null;
    		        		scope.uploadFile.uploadFileName = '上传的文件不是图片格式';
    		        	} else if (file[0].size > 20*1024*1024) {
    		        		scope.uploadFile.dataFile = null;
    		        		scope.uploadFile.uploadFileName = '上传的文件过大';
    		        	} else {
    		        		scope.uploadFile.uploadFileName = file[0].name;
    		        	}
    		        }else{
    		        	scope.uploadFile.uploadFileName = '没有选择任何文件';
    		        }
    			}
    			scope.importUserProfileList = function(callback){
    				var id = elem.parent()[0].id;
    				var file = scope.uploadFile.dataFile;
    				if (file && !file.$error) {
    					file.upload = Upload.upload({
    						url:  'plugin/imguploadImg',
    						file: scope.uploadFile.dataFile,
    						fields: {
    							id: id
    						},
    					});
    					file.upload.then(function (data) {
    						if(data.data.success){
    							callback.call();
    							scope.callback(data.data.data);
    						}
    					});
    					file.upload.progress(function (evt) {
    						file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    					});
    				}
    			}
    			
            	scope.callback = function(report){
            		if(angular.isFunction(scope.pluginReportCallback)){
            			scope.optionloading = true;
	            		scope.pluginReportCallback()(report);
	            	}
            	}
            }
    	}
    }]);
});
