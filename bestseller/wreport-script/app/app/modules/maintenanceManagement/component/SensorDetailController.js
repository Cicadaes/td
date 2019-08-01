'use strict';

angular.module('wreport.app').controller('SensorDetailController', function ($scope, $state, $location, NgTableParams, CommonService, Upload, ChartService) {
    $scope.constants = $state.constants;

    $scope.sensorId = $state.sensorId;

    $scope.onProjectClick = function () {
        if ($location.$$url != "/project/projects/see") {
            $state.sensorType = "2";
            $state.go("MaintenanceManagement");
        }
        $scope.tabType = '1';
        $scope.sensorEquInit();
    };

    if ($state.sensor == undefined) {
        $scope.sensor = JSON.parse(localStorage.getItem("sensor"));
    } else {
        $scope.sensor = $state.sensor;
    }

    // 跳转探针管理界面
    $scope.go_sensorManege = function () {
        $state.sensorType = "2";
        $state.go("MaintenanceManagement");
    };

    // 初始化近七天时间
    var date = new Date();
    $scope.dateInTop = {
        tagDataTimeStart: date.getTime() - 86400000 * 6,
        tagDataTimeEnd: date.getTime(),
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
            var option = ChartService.prepareChartStroeSensor($scope.constants, $scope.x_name, $scope.MacEffectiveMap[$scope.id], $scope.MacTotalMap[$scope.id], $scope.effectiveName, $scope.totalName, $state.theme_color_value);
            var myChart = echarts.init($('#chart_detail')[0]);
            myChart.setOption(option);
        } else {
            $scope.effectiveName = $scope.constants.echart_btn_logs_effective;
            $scope.totalName = $scope.constants.echart_btn_logs_all;
            $($event.target).addClass("sensor_select");
            $($event.target).parent().find(".macs").removeClass("sensor_select");
            $($event.target).parent().parent().parent().find(".logTotal").addClass("total_block");
            $($event.target).parent().parent().parent().find(".macTotal").removeClass("total_block");
            var option = ChartService.prepareChartStroeSensor($scope.constants, $scope.x_name, $scope.LogEffectiveMap[$scope.id], $scope.LogTotalMap[$scope.id], $scope.effectiveName, $scope.totalName, $state.theme_color_value);
            var myChart = echarts.init($('#chart_detail')[0]);
            myChart.setOption(option);
        }
    };

    // 回车搜索
    $scope.myKeyupsensor = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        $scope.sensorsearchvalue = $("#searchSensor").val();
        if (keycode == 13) {
            $scope.tableParams.filter({"q": encodeURI($scope.sensorsearchvalue), "projectId": $state.projectVM.projectId})
        }
        if ($scope.sensorsearchvalue == "") {
            $scope.tableParams.filter({"q": encodeURI($scope.sensorsearchvalue), "projectId": $state.projectVM.projectId})
        }
    };

    // 下载表格
    $scope.exportReportSensorDetail = function () {
        var queryObj = {
            sensorId: $scope.sensor.id,
            exportType: "SensorDetail"
        };

        CommonService.request('download2excel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };

    $scope.init = function () {
        $scope.sensorList = [];
        $scope.MacEffectiveMap = {};
        $scope.MacTotalMap = {};
        $scope.LogEffectiveMap = {};
        $scope.LogTotalMap = {};
        $scope.x_name = [];
        $scope.effectiveName = $scope.constants.echart_btn_sensor_effective;
        $scope.totalName = $scope.constants.echart_btn_sensor_all;

        // 查看探针详情
        CommonService.request("sensorDetail", $scope.sensor.id).then(function (response) {
            $scope.data = response.data;
            $scope.initChartMacDetail($scope.data);
            $scope.initChartLogDetail($scope.data);
            CommonService.refreshAngular($scope);
        });

        // 查看编辑记录
        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sort: {
                name: 'asc'
            },
            filter: {
                "id": $scope.sensor.id,
            }
        }, {
            counts: [10, 20, 50],
            paginationMaxBlocks: 9,
            total: 0,
            getData: function ($defer, params) {
                var queryObj = CommonService.buildQueryParams(params);
                //queryObj.sensorId = $scope.sensor.id;
                CommonService.request("SensorUpdataHistroy", queryObj).then(function (response) {
                    $scope.sensorList = response.data;
                    var total = response.headers()['x-total-count'];
                    $scope.sensorTotal = total;
                    params.total(total);
                    $defer.resolve(response.data);

                })

            }
        });

    };

    // 初始化mac图表
    $scope.initChartMacDetail = function (data) {
        var sensorId = data.id;
        // 整理数据
        var x_name = [];
        var seriesData_1 = [];
        var seriesData_2 = [];

        for (var i = 0; i < data.macs.length; i++) {
            var self = data.macs[i];
            x_name.push(self.date.substr(5, 5));
            $scope.x_name.push(self.date.substr(5, 5));
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
            $scope.MacEffectiveMap[$scope.id] = seriesData_1;
            $scope.MacTotalMap[$scope.id] = seriesData_2;
        }
        var option = ChartService.prepareChartStroeSensor($scope.constants, x_name, seriesData_1, seriesData_2, $scope.effectiveName, $scope.totalName, $state.theme_color_value);
        var myChart = echarts.init($('#chart_detail')[0]);
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
            $scope.LogEffectiveMap[$scope.id] = seriesData_1;
            $scope.LogTotalMap[$scope.id] = seriesData_2;
        }

    };

    $scope.init();

});
