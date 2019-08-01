'use strict';

angular.module('wreport.app').controller('SensorStrengthSetController', function ($scope, $state, $location, NgTableParams, CommonService, Upload, ChartService) {
    $scope.constants = $state.constants;
    //$scope.currentProjectId = $state.projectVM.projectId;

    $scope.sensorId = $state.sensorId;

    $scope.tabType = "all";

    var strLock = localStorage.getItem("lockList");
    if (strLock != undefined && strLock != "") {
        localStorage.removeItem("lockList")
    }

    if ($state.sensor == undefined) {
        $scope.sensor = JSON.parse(localStorage.getItem("sensor"));
    } else {
        $scope.sensor = $state.sensor;
    }

    $scope.minRssi = $scope.sensor.minRssi;
    $scope.onProjectClick = function () {
        if ($location.$$url != "/project/projects/sensorset") {
            $state.sensorType = "2";
            $state.go("MaintenanceManagement");
        }
    };

    // 跳转探针管理界面
    $scope.go_sensorManege = function () {
        $state.sensorType = "2";
        $state.go("MaintenanceManagement");
    };

    // 点击开始测试按钮
    $scope.startTest = function () {
        $scope.flag = false;
        $scope.getMacList();
        $scope.getNowFormatDate();
    };

    // 点击刷新按钮
    $scope.refreshList = function () {
        // 将锁定的list缓存到前端
        localStorage.setItem("lockList", JSON.stringify($scope.macListLock));
        $scope.macListLock = [];
        $scope.macListLockMap = {};
        $scope.getNowFormatDate();
        $scope.getMacList();
    };

    // 获取收到的mac列表
    $scope.getMacList = function () {
        $scope.tabType = "all";
        CommonService.request("SensorStrengthMac", $scope.sensor.id).then(function (response) {
            $scope.data = response.data;
            // 模拟有数据
            $scope.macListAll = [];
            $scope.macList = [];
            $scope.macListLeft = [];
            $scope.macListAll = angular.copy($scope.data);
            $scope.macList = angular.copy($scope.data);
            $scope.macListLeft = angular.copy($scope.data);

            var lockList = JSON.parse(localStorage.getItem("lockList"));
            //console.log("===>lockList", lockList);
            if (lockList != null && lockList != "") {
                for (var k = 0; k < $scope.macListLeft.length; k++) {
                    for (var z = 0; z < lockList.length; z++) {
                        if ($scope.macListLeft[k].id == lockList[z].id) {
                            $scope.macListLeft[k].lock = "1";
                            $scope.macList[k].lock = "1";
                            $scope.macListAll.lock = "1";
                            $scope.macListLock.push($scope.macListLeft[k]);
                            // $scope.macListLock[z].minRssi = $scope.macListLeft[k].minRssi;
                            // $scope.macListLock[z].time = $scope.testTime;
                            //$scope.macListLockMap[$scope.macListLeft[k].id] =  $scope.macListLeft[k];
                        }
                    }
                }
            }

            /*for(var key in  $scope.macListLockMap)
             {
             for(var a = 0 ; a < $scope.macListLock.length; a++)
             {
             if(!$scope.macListLockMap.hasOwnProperty($scope.macListLock[a].id))
             {
             $scope.macListLock.splice(a,1);
             }
             }
             }*/

        });
    };

    // 获取保存的的mac列表
    $scope.getMacListNode = function () {
        // var obj = {
        //     "projectId": $scope.currentProjectId,
        //     "sensorId": $scope.sensor.id
        // };
        // CommonService.request('GetSensorMacListNode', obj).then(function (response) {
        //     var data = response.data;
        //     if (data != undefined) {
        //         $scope.id = data.id;
        //         $scope.dataR = JSON.parse(data.dataJson);
        //     }
        // });

    };

    // 获取当前时间
    $scope.getNowFormatDate = function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes();
        //+ seperator2 + date.getSeconds();
        $scope.testTime = currentdate;
    };

    // 验证探针信号强度是不是负整数
    $scope.reg_ = function (val) {
        var reg = /^-[0-9]*[1-9][0-9]*$/;
        if (Number(val)) {
            return reg.test(val);
        } else {
            return "" == val;
        }
    };

    // 设置探针信号强度
    $scope.saveMinRssi = function () {

        if ($scope.minRssi != undefined && !$scope.reg_($scope.minRssi)) {
            $.Pop.alerts($scope.constants.prompt_sensor_minRssi1 + "(" + $scope.minRssi + ")" + $scope.constants.prompt_sensor_macError2);
            return;
        }
        var _sensor = {
            id: $scope.sensor.id,
            sensorCode: $scope.sensor.sensorCode,
            sensorName: $scope.sensor.sensorName,
            sensorMac: $scope.sensor.sensorMac,
            status: $scope.sensor.status,
            description: $scope.sensor.description,

            projectId: $scope.sensor.projectId || $scope.currentProjectId,
            minRssi: $scope.minRssi,

            roomId: $scope.sensor.roomId,
            roomName: $scope.sensor.roomName,

            positionDescription: $scope.sensor.positionDescription,
            distance: $scope.sensor.distance,

            isOutside: $scope.sensor.isOutside,
            sensorType: $scope.sensor.sensorType,
            sensorVersion: $scope.sensor.sensorVersion,
        };
        CommonService.create('CreatetNewSensor', _sensor).then(function (sensor) {
            $state.sensorType = "2";
            $state.go("MaintenanceManagement");
        }, function (response) {
            if (response.data != null && !response.data.success) {
                var error = decodeURI(response.headers()['x-wreport-error']);
                $.Pop.alerts(error);
            }
        });
    };

    // 探针信号强度取消按钮
    $scope.cancelMinRssi = function () {
        $scope.minRssi = "";
    };

    // 显示全部和现实锁定切换
    $scope.changeType = function (type) {
        $scope.tabType = type;
        if (type == "all") {
            $scope.macListLeft = $scope.macList;
        } else {
            $scope.macListLeft = $scope.macListLock;
        }
    };

    // 实现锁定功能
    $scope.toBeLock = function (sensor, $event) {
        sensor["lock"] = "1";
        CommonService.refreshAngular($scope);
        $scope.macListLock.push(sensor);
    };

    // 实现解锁功能
    $scope.toBeNotLock = function (sensor, $event) {
        sensor["lock"] = "0";
        for (var i = 0; i < $scope.macListLock.length; i++) {
            if ($scope.macListLock[i].id == sensor.id) {
                $scope.macListLock.splice(i, 1);
            }
        }
    };

    // 勾选到右侧
    $scope.goNote = function (sensor, $event) {
        if (sensor.time == "" || sensor.time == null) {
            sensor.time = $scope.testTime;
        }
        var data = angular.copy(sensor);
        $scope.dataR.push(data);
    };

    // 删除右侧测试报告中的某项
    $scope.removeOne = function ($index, $event) {
        for (var i = 0; i < $scope.dataR.length; i++) {
            if ($index == i) {
                $scope.dataR.splice(i, 1);
            }
        }
    };

    // 修改和新增备注功能
    $scope.updateRemark = function (sensor, $event) {
        $($event.target).parent().find(".remarkInput").show();
        $($event.target).parent().find(".sensorRemarks").hide();
        $($event.target).parent().find(".remarksbtn").hide();
        $($event.target).parent().find(".remarkInput").focus();

        $($event.target).parent().find(".remarkInput").blur(function (e) {
            e.stopPropagation();
            if ($($event.target).parent().find(".remarkInput").val() != "") {
                sensor["remark"] = $($event.target).parent().find(".remarkInput").val();
                $($event.target).parent().find(".remarkInput").hide();
                $($event.target).parent().find(".sensorRemarks").show();
            }else {
                sensor["remark"] = null;
                $($event.target).parent().find(".remarkInput").hide();
                $($event.target).parent().find(".sensorRemarks").show();
                $($event.target).parent().find(".remarksbtn").show();
            }
        });
    };

    setTimeout(function(){
        $(".remarkInput").focus(function (e) {
            e.stopPropagation();
        });
    },500);

    // 保存右侧测试报告功能
    $scope.saveMacNode = function () {
        var dataJson = JSON.stringify($scope.dataR);
        var queryObj = {
            "sensorId": $scope.sensor.id,
            "projectId": $scope.currentProjectId,
            "dataJson": dataJson,
            "status": 1,
            "id": $scope.id
        };

        CommonService.create('saveSensorNode', queryObj).then(function (sensor) {
            $.Pop.alerts($scope.constants.prompt_analysis_NewSaveSuccess);
        }, function (response) {
            if (response.data != null && !response.data.success) {
                var error = decodeURI(response.headers()['x-wreport-error']);
                $.Pop.alerts(error);
            }
        });
    };

    $scope.init = function () {
        $scope.flag = true; // 控制开始测试还是刷新按钮显示问题
        $scope.testTime = ""; // 测试时间
        $scope.macList = [];  // 探针采集到的mac列表
        $scope.macListAll = [];  // 探针采集到的全部mac列表
        $scope.macListLock = []; // 探针采集到的锁定mac列表
        $scope.macListLeft = []; // 探针采集到的全部mac列表
        $scope.macListLockMap = {};   // 判断刷新之后哪些mac是没收到的

        $scope.getMacListNode();

        // 模拟右侧数据
        $scope.dataR = [];  // 右侧列表

    };

    $scope.init();

});
