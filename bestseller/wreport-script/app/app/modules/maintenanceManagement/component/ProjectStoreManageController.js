'use strict';

angular.module('wreport.app').controller('ProjectStoreManageController', function ($scope, $state, $location, CommonService, NgTableParams) {
    $scope.constants = $state.constants;
    $scope.$on("constantsCallback", function (event) {
        $scope.constants = $state.constants;
    });
    // 初始化搜索变量
    $scope.storesearchvalue = "";
    $scope.projectMap = {};
    $scope.storeselect = "";
    $scope.storetype = "";
    $scope.flag = false;

    // 回车搜索
    $scope.myKeyupstore = function(e){

        $scope.storesearchvalue = $("#setVal2").val();
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.storeTableParams.filter({"q":encodeURI($scope.storesearchvalue)})
        }

        if($scope.storesearchvalue==""){
            $scope.storeTableParams.filter({"q":encodeURI($scope.storesearchvalue)})
        }
    };


    // 按照无日志时长排序
    $scope.log_sort = function(type){
        if(type != $scope.storetype){
            $scope.flag = false;
            $scope.storetype = type;
        }
        $scope.flag = !$scope.flag;
        if($scope.flag == true)
        {
            $scope.storeselect = "logsup";
            $scope.storeSort("noLogDuration",'desc');
        }else {
            $scope.storeselect = "logsdown";
            $scope.storeSort("noLogDuration",'asc');
        }
    };

    // 按照健康度排序
    $scope.heath_sort = function(type){
        if(type != $scope.storetype){
            $scope.flag = false;
            $scope.storetype = type;
        }
        $scope.flag = !$scope.flag;
        if($scope.flag == true)
        {
            $scope.storeselect = "heathup";
            $scope.storeSort("healthRate",'desc');
        }else {
            $scope.storeselect = "heathdown";
            $scope.storeSort("healthRate",'asc');
        }
    };

    // 排序功能模拟
    $scope.storeSort = function(name,type){
        if(name == 'healthRate')
        {
            $scope.paramsStore.$params['sorting'] = {"healthRate":type};
        }else if(name == 'noLogDuration'){
            $scope.paramsStore.$params['sorting'] = {"noLogDuration":type};
        }
    };


    // 查看责任人详情
    $scope.seeDetail = function(person,event){
        $scope.obj = person;
        var left = 300;
        var top = event.clientY -240;
        if(top > 156)
        {
            top = top - 186
        }
        $scope.seeDetailDiv = { 'left' : left + 'px', 'top' : top + 'px' };
        $("#detailDiv").show();

        // var targetelement = "link";
        // var targetattr = "href";
        // var filename = "changeColor.css";
        // var allsuspects = document.getElementsByTagName(targetelement);
        // for (var i = allsuspects.length; i >= 0; i--) {
        //     if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
        //     {
        //         $(event.target).css({"color":"#02aea2"});
        //         return;
        //     }else {
        //         $(event.target).css({"color":"#12B4FD"});
        //     }
        //
        // }



    };

    $scope.closeDetail = function(event){
        $(event.target).css({"color":"#333f51"});
        $("#detailDiv").hide();
    };

    // 查看店铺内探针详情
    $scope.seeProject2 = function(project){
        $state.sensorType = "1";
        localStorage.setItem("OneProjectMana",JSON.stringify(project));
        $state.go("projects_store_detial");
    };



    $scope.storeInit = function(){
        $scope.storeTableParams = new NgTableParams(angular.extend({
            page: 1,
            count: 10,
            sort: {
                name: 'asc'
            },
            filter :{
                "q" : encodeURI($scope.storesearchvalue)
            }
        }, $location.search()), {
            counts: [10, 20, 50],
            paginationMaxBlocks: 9,
            total: 0,
            getData: function ($defer, params) {
                // 排序功能前端代码
                var sort = params.sorting();
                var page = params.url();
                params.paging = {offset: (page.page - 1) * page.count, limit: page.count};
                for (var p in sort) {
                    if (!sort.hasOwnProperty(p)) {
                        continue;
                    }
                    params.sort = {sort: p, order: sort[p]};
                }

                $scope.paramsStore = params;
                $scope.deferStore = $defer;

                var queryobj = CommonService.buildQueryParams(params);
                CommonService.request("GetProjectStoreList",queryobj).then(function(response){
                    var total = response.headers()['x-total-count'];
                    params.total(total);
                    $scope.sensorsCount = total;
                    $defer.resolve(response.data);

                });
            }
        });
    }


    $scope.storeInit();

    $scope.getStoreTable = function(){
        $scope.storeTableParams.reload();
    };

    var window = parent.window || window;
    var winHg = $(window).height();
    var winWd = $(window).width();

    var table_width = (winWd - 180 - 40);
    $scope.table_width_1 = { 'width' : table_width / 6 + 'px' };
    $scope.table_width_2 = { 'width' : table_width / 6 + 'px' };
    $scope.table_width_3 = { 'width' : table_width / 6 + 'px' };
    $scope.table_width_4 = { 'width' : table_width / 6 + 'px' };
    $scope.table_width_5 = { 'width' : table_width / 6 + 'px' };
    $scope.table_width_6 = { 'width' : table_width / 6 + 'px' };
    $scope.table_max_height = { 'max-height' : winHg - 255 + "px" ,"overflow-y": "auto","display": "block"};

});
angular.module('wreport.app').directive('projectStoreManage', function () {
    return {
        restrict: 'A',
        controller: 'ProjectStoreManageController',
        templateUrl: 'app/modules/maintenanceManagement/component/ProjectStoreManage.html',
        link: function (scope, element, attrs) {
        }
    };
});