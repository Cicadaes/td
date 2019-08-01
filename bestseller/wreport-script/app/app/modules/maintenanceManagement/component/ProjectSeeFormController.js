'use strict';

angular.module('wreport.app').controller('ProjectSeeFormController', function ($scope, $state, $location, NgTableParams, CommonService, Upload, ChartService) {
    $scope.constants = $state.constants;

    // 跳转至店铺列表
    $scope.go_project_shop = function () {
        $state.sensorType == "1";
        $state.go('MaintenanceManagement');
    };

    $scope.onProjectClick = function () {

    };

    // 切换mac和日志
    $scope.changeType = function (sensorId, type, $event) {
        if (type == 1) {
            $scope.effectiveName = $scope.constants.echart_btn_sensor_effective;
            $scope.totalName = $scope.constants.echart_btn_sensor_all;
            $($event.target).addClass("sensor_select");
            $($event.target).parent().find(".logs").removeClass("sensor_select");
            $($event.target).parent().parent().parent().find(".macTotal").addClass("total_block");
            $($event.target).parent().parent().parent().find(".logTotal").removeClass("total_block");
            var option = ChartService.prepareChartStroeSensor($scope.constants, $scope.x_name, $scope.MacEffectiveMap[sensorId], $scope.MacTotalMap[sensorId], $scope.effectiveName, $scope.totalName, $state.theme_color_value);
            var myChart = echarts.init($('#chart_detail_' + sensorId)[0]);
            myChart.setOption(option);
        } else {
            $scope.effectiveName = $scope.constants.echart_btn_logs_effective;
            $scope.totalName =  $scope.constants.echart_btn_logs_all;
            $($event.target).addClass("sensor_select");
            $($event.target).parent().find(".macs").removeClass("sensor_select");
            $($event.target).parent().parent().parent().find(".logTotal").addClass("total_block");
            $($event.target).parent().parent().parent().find(".macTotal").removeClass("total_block");
            var option = ChartService.prepareChartStroeSensor($scope.constants, $scope.x_name, $scope.LogEffectiveMap[sensorId], $scope.LogTotalMap[sensorId], $scope.effectiveName, $scope.totalName, $state.theme_color_value);
            var myChart = echarts.init($('#chart_detail_' + sensorId)[0]);
            myChart.setOption(option);
        }
    };

    // 初始化近七天时间
    var date = new Date();
    $scope.dateInTop = {
        tagDataTimeStart: date.getTime() - 86400000 * 6,
        tagDataTimeEnd: date.getTime(),
    };

    // 下载表格
    $scope.exportReport = function () {
        var queryObj = {
            startDate: CommonService.formatDateLocal($scope.dateInTop.tagDataTimeStart),
            endDate: CommonService.formatDateLocal($scope.dateInTop.tagDataTimeEnd),
            projectId: $scope.oneProjectId,
            exportType: "ProjectDetailSensors"
        };

        CommonService.request('export2excel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };

    $scope.init = function () {
        $scope.oneProjectId = JSON.parse(localStorage.getItem("OneProjectMana")).projectId;
        $scope.stroeName = JSON.parse(localStorage.getItem("OneProjectMana")).projectName;
        $scope.sensorList = [];
        $scope.MacEffectiveMap = {};
        $scope.MacTotalMap = {};
        $scope.LogEffectiveMap = {};
        $scope.LogTotalMap = {};
        $scope.x_name = [];
        $scope.effectiveName = $scope.constants.echart_btn_sensor_effective;
        $scope.totalName = $scope.constants.echart_btn_sensor_all;
        CommonService.request('GetStroeSensorDetail', $scope.oneProjectId).then(function (response) {
            $scope.sensorList = [];
            $scope.data = response.data;
            if ($scope.data.sensorDetailVMS == null) {
                return
            }
            for (var i = 0; i < $scope.data.sensorDetailVMS.length; i++) {
                var obj = $scope.data.sensorDetailVMS[i];
                $scope.sensorList.push(obj);
                setTimeout((function (obj) {
                    return function () {
                        $scope.initChartMacDetail(obj);
                        $scope.initChartLogDetail(obj);
                    }
                })(obj), 500);
                CommonService.refreshAngular($scope);
            }
        });

        // 初始化mac图表
        $scope.initChartMacDetail = function (data) {
            var sensorId = data.id;
            // 整理数据
            var x_name = [];
            var seriesData_1 = [];
            var seriesData_2 = [];
                $scope.x_name = [];

            for (var i = 0; i < data.macs.length; i++) {
                var self = data.macs[i];
                x_name.push(self.date.substr(5, 5));
                $scope.x_name.push(self.date.substr(5, 5))
                var total_p = 0;
                var effective_p = 0;

                if ('total' in self) {
                    total_p = self.total;
                }
                if ('effective' in self) {
                    effective_p = self.effective;
                }
                seriesData_1.push(effective_p);
                seriesData_2.push(total_p);
                $scope.MacEffectiveMap[sensorId] = seriesData_1;
                $scope.MacTotalMap[sensorId] = seriesData_2;
            }
            var option = ChartService.prepareChartStroeSensor($scope.constants, x_name, seriesData_1, seriesData_2, $scope.effectiveName, $scope.totalName, $state.theme_color_value);
            var myChart = echarts.init($('#chart_detail_' + sensorId)[0]);
            myChart.setOption(option);
        };

        // 初始化Log图表
        $scope.initChartLogDetail = function (data) {
            var sensorId = data.id;
            // 整理数据
            var x_name = [];
            var seriesData_1 = [];
            var seriesData_2 = [];

            for (var i = 0; i < data.logs.length; i++) {
                var self = data.logs[i];
                x_name.push(self.date.substr(5, 5));
                var total_p = 0;
                var effective_p = 0;

                if ('total' in self) {
                    total_p = self.total;
                }
                if ('effective' in self) {
                    effective_p = self.effective;
                }
                seriesData_1.push(effective_p);
                seriesData_2.push(total_p);
                $scope.LogEffectiveMap[sensorId] = seriesData_1;
                $scope.LogTotalMap[sensorId] = seriesData_2;
            }

        }

    };

    $scope.init();

});
