'use strict';
/**
 * 路径分析树状图
 */
angular.module('wreport.app').directive('tdFlowChart', function () {
    return {
        restrict : 'EA',
        scope:{
            data:"=",
            tdChange: "&"
        },
        templateUrl: 'app/directives/td-flow-chart.html',
        link: function(scope, elem, attrs) {
            var callback = function(k){
                scope.tdChange()(k);
            };
            scope.$watch('data',function() {
                if(scope.data&&scope.data.datainfo.length>0){
                    var _datas=angular.copy(scope.data.datainfo);
                    var _params=angular.copy(scope.data.params);
                    render_flow_chart(_datas,_params,false,callback);
                }else{
                    var dataString=[{"name":"暂无数据"}]
                    dataString = JSON.stringify(dataString);
                    render_flow_chart(dataString,null,true,callback);
                }
            },true);
        }
    }
});
