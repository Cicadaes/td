'use strict';

angular.module('wreport.app').controller('ComPeopleAppController', function ($scope, $state, $location, CommonService) {

    $scope.requestDataRadar = function (comp_side) {
        var url_radia = 'selectForRadar'; // 覆盖率
        var url_app = 'selectAppPreference'; // 提升度
        if ($scope.urlType == 'result') {
            url_radia = 'selectForBehaviorRadar';
            url_app = 'selectBehaviorAppPreference';
        }

        if (comp_side != 2) {
            var endDateLong = $scope.comp_date_1_end;
            var endDateVal = new Date(endDateLong).Format('yyyy-MM-dd');

            var projectId = $scope.currentProjectId;
            var crowd1Id = $scope.firstid;
            if ($scope.comparePanelType == 'multi') {
                projectId = $scope.firstid;
                crowd1Id = $scope.crowd_map[$scope.firstid];
            }

            var queryObj;
            if (!$scope.urlType) {
                queryObj = {
                    runDate: endDateVal,
                    cycleStatistics: 30,
                    projectId: projectId,
                    crowdId: crowd1Id
                };
            } else {
                var execId = $scope.execId;
                queryObj = {
                    projectId: projectId,
                    execId: execId
                };
            }

            // 应用偏好覆盖率
            CommonService.request(url_radia, queryObj).then(function (response) {
                var use_chart = $('.radar_chart');
                $scope.drawRadar(use_chart[0], response.data, 'bbb');
            });
            // 应用偏好提升度
            CommonService.request(url_app, queryObj).then(function (response) {
                var chart_pt_app_preference = $('.chart_pt_app_preference');
                $scope.initChart_1(chart_pt_app_preference[0], response.data);
            });

        }

        if ($scope.status == 'compare_double' && comp_side != 1) {
            var endDateLong2 = $scope.comp_date_2_end;
            var endDateVal2 = new Date(endDateLong2).Format('yyyy-MM-dd');

            var projectId2 = $scope.currentProjectId;
            var crowd1Id2 = $scope.secondid;
            if ($scope.comparePanelType == 'multi') {
                projectId2 = $scope.secondid;
                crowd1Id2 = $scope.crowd_map[$scope.secondid];
            }

            var queryObj2 = {
                runDate: endDateVal2,
                cycleStatistics: 30,
                projectId: projectId2,
                crowdId: crowd1Id2
            };
            // 应用偏好覆盖率
            CommonService.request(url_radia, queryObj2).then(function (response) {
                var use_chart = $('.radar_chart');
                $scope.drawRadar(use_chart[1], response.data, 'bbb');
            });
            // 应用偏好提升度
            CommonService.request(url_app, queryObj2).then(function (response) {
                var chart_pt_app_preference = $('.chart_pt_app_preference');
                $scope.initChart_1(chart_pt_app_preference[1], response.data);
            });

            if($scope.chartTmp){
                $scope.chartTmp.resize();
            }
        }
    };

    if ($scope.$parent) {
        $scope.$parent.requestDataRadar = $scope.requestDataRadar;
    }

    $scope.drawRadar = function (main, arr, title) {

        if (arr.length == 0) {
            arr.push({
                tagCode: '000000',
                tagName: '人群总数',
                metricValue: 1
            });
            arr.push({
                tagCode: '000001',
                tagName: '无',
                metricValue: 0
            });
        }
        var x_name = [];
        var legendData = [];
        var max_count = 0;
        var total_count = 0;
        var perMap = {};

        var peopleTag = {};
        var new_arr = [];
        for (var i = 0; i < arr.length; i++) {
            if ("000000" == arr[i].tagCode && "人群总数" == arr[i].tagName) {
                peopleTag = arr[i];
            } else {
                var obj = arr[i];
                if (obj.metricValue > max_count) {
                    max_count = obj.metricValue;
                }
                new_arr.push(arr[i]);
            }
        }
        total_count = peopleTag.metricValue;

        for (var j = 0; j < new_arr.length; j++) {
            var obj2 = new_arr[j];
            x_name.push({
                name: obj2.tagName,
                max: max_count * 1.1
            });
            legendData.push(obj2.metricValue);

            perMap[obj2.tagName] = obj2.metricValue / total_count;
        }

        var option = chartOptionUtil.getPeopleRadarOption(x_name, legendData, perMap, $state.theme_color_value);

        var myChart = echarts.init(main);
        //客群画像，应用偏好覆盖率，雷达图
        myChart.setOption(option);
    };

    // 应用提升度
    $scope.initChart_1 = function (dom, data) {

        var legendName = '应用偏好提升度';

        var x_name = [], legendData = [];
        for (var i = 0; i < data.length; i++) {
            x_name.push(data[i].tagName);
            legendData.push(data[i].cityPreValue);
        }
        var seriesArray = [];
        for (var j = 0; j < x_name.length; j++) {
            seriesArray.push({
                name: x_name[j],
                type: 'line',
                data: legendData[j]
            });
        }
        var _mixValue = 0;
        for (var k = 0; k < legendData.length; k++) {
            if (k == 0) {
                _mixValue = legendData[0];
            } else {
                if (parseFloat(legendData[k]) < _mixValue) {
                    _mixValue = parseFloat(legendData[k]);
                }
            }
        }

        var option = chartOptionUtil.getPeopleAppOption(legendName, x_name, legendData, $state.theme_color_value);

        var myChart = echarts.init(dom);
        //客群画像，应用偏好提升度，折线图
        myChart.setOption(option);

        $scope.chartTmp = myChart;
    };
});

angular.module('wreport.app').directive('comPeopleApp', function () {
    return {
        restrict: 'A',
        controller: 'ComPeopleAppController',
        templateUrl: 'app/modules/passengerPortrait/component/comPeopleApp.html'
    };
});
