'use strict';

angular.module('wreport.app').controller('storeThresholdSettingController', function ($scope, $state, $location, NgTableParams, CommonService, Upload) {
    $scope.constants = $state.constants;

    $scope.goThresholdSet = function () {
        $state.go('thresholdSet');
    };
    if ($state.thresholdSetIds == undefined) {
        $state.thresholdSetIds = JSON.parse(localStorage.getItem('thresholdSetIds'));
    }
    var queryObj = {
        projectId: $state.thresholdSetIds
    };
    CommonService.request('GetThresholdSetProjectList', queryObj).then(function (response) {
        var data = JSON.parse(localStorage.getItem('thresholdSetProjectList'));
        $scope.data = data;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].constructor == Object) {
                $scope.id.push($scope.data[i]);
                $scope.ids.push($scope.data[i].id)
            }
        }

        //var data = response.data;
        $scope.chooseProjectCount = $scope.ids.length;
        $scope.olddata = response.data[0];
        CommonService.refreshAngular($scope);
    });

    $scope.id = [];  // 设置项;
    $scope.ids = []; // 存放设置项id;
    $scope.project = {}; // 初始化对象;
    $scope.salesListId = null;  // 店员上传文件id;
    $scope.blackListId = null; // 黑名单上传文件id;

    $scope.editPassenger = function (event) {
        $(event.target).parent().find(".edit_frame").addClass("closeSetShow");
        $(event.target).parent().find(".closeSet").addClass("closeSetShow");
    };


    $scope.makeTrue = function (event, type) {
        if (type == "incoming") {
            $scope.incoming_passenger = "";
        }
        if (type == "jump") {
            $scope.jump_passenger = "";
        }
        if (type == "stay") {
            $scope.stay_passenger = "";
        }
        if (type == "highActive") {
            $scope.high_active1 = "";
            $scope.high_active2 = "";
        }
        if (type == "middleActive") {
            $scope.middle_active1 = "";
            $scope.middle_active2 = "";
        }
        if (type == "lowActive") {
            $scope.low_active1 = "";
            $scope.low_active2 = "";
        }
        if (type == "sleepActive") {
            $scope.sleep_active = "";
        }
        if (type == "beforeStore") {
            $scope.before_store = "";
        }
        if (type == "enterStore") {
            $scope.enter_store = "";
        }
        if (type == "intervalCount") {
            $scope.interval_count = "";
        }
        // if (type == "clerkDay") {
        //     $scope.clerk_day1 = "";
        //     $scope.clerk_day2 = "";
        // }
        // if (type == "moreThanDay") {
        //     $scope.moreThan_day = "";
        // }
        if (type == "blackDay") {
            $scope.black_day1 = "";
            $scope.black_day2 = "";
        }
        if (type == "blackMoreThanDay") {
            $scope.blackMoreThan_day = "";
        }
        if (type == "businessHours") {
            $scope.open_time1 = "";
            $scope.open_time2 = "";
            $scope.close_time1 = "";
            $scope.close_time2 = "";
        }
        $(event.target).parent().removeClass("closeSetShow");
        $(event.target).removeClass("closeSetShow");
    };


    // 数据上传
    $scope.import_file = function (file, type) {
        var file_type = 0;
        // if (type == 'clerk') {
        //     file_type = 5;
        // } else {
        //     file_type = 0;
        // }
        $scope.file = file;
        if (file && !file.$error) {
            file.upload = Upload.upload({
                url: 'api/thresholds/upload',
                fields: {
                    projectId: $scope.ids.join(","),
                    type: file_type
                },
                file: file
            });
            file.upload.then(function (response) {
                if (response.data != null && response.data.length != 0) {
                    // if (type == 'clerk') {
                    //     $scope.salesListId = response.data[0].id;
                    //     $scope.salesFileName = response.data[0].attr1;
                    // } else {
                        $scope.blackListId = response.data[0].id;
                        $scope.blackFileName = response.data[0].attr1;
                   // }
                } else {
                    $.Pop.alerts($scope.constants.prompt_success);
                }
            }, function (response) {
                $.Pop.alerts(response);
            });
        }
    };


    // 删除已经选择的设置项目
    $scope.removeOne = function (project) {
        for (var i = 0; i < $scope.id.length; i++) {
            if (project.id == $scope.id[i].id) {
                $scope.id.splice(i, 1);
                $scope.ids.splice(i, 1);
            }
        }
        $scope.chooseProjectCount = $scope.ids.length;
    };



    // 过滤保存的数据
    $scope.filterData = function (project) {
        for (var key in project) {
            if (project[key] == null || project[key] == "" || project[key] == undefined) {
                delete project[key];
            }
        }
        return project;
    };

    // 验证两个信息必填项
    $scope.setProject = function () {
        // 客流阈值
        $scope.project.crowdCome = $scope.incoming_passenger;  // 入店客流
        $scope.project.crowdBounce = $scope.jump_passenger;  // 跳出客流
        $scope.project.crowdStay = $scope.stay_passenger;  // 停留客流
        $scope.project.crowdActiveHighBegin = $scope.high_active1;  // 高活跃客流start
        $scope.project.crowdActiveHighEnd = $scope.high_active2;  // 高活跃客流end
        $scope.project.crowdActiveMediumBegin = $scope.middle_active1;  // 中活跃客流start
        $scope.project.crowdActiveMediumEnd = $scope.middle_active2;  // 中活跃客流end
        $scope.project.crowdActiveLowBegin = $scope.low_active1;  // 低活跃客流start
        $scope.project.crowdActiveLowEnd = $scope.low_active2;  // 低活跃客流end
        $scope.project.crowdSleep = $scope.sleep_active;  // 沉睡客流

        // 强度阈值
        $scope.project.strengthCrowdBefore = $scope.before_store;  // 周边客流
        $scope.project.strengthCrowdCome = $scope.enter_store;  // 入店客流
        // 次数阈值
        $scope.project.frequencyIntervalTime = $scope.interval_count;  // 次数间隔时间
        // 店员
        //$scope.project.salesConsecutive_day = $scope.clerk_day1;  // 店员连续天数
        //$scope.project.salesComeDay = $scope.clerk_day2;  // 店员入店天数
       // $scope.project.salesStayTime = $scope.moreThan_day;  // 店员一天内入店停留时间累计小时
        // 黑名单
        $scope.project.blackConsecutiveDay = $scope.black_day1;  // 黑名单连续天数
        $scope.project.blackComeDay = $scope.black_day2;  // 黑名单连续天数
        $scope.project.blackStayTime = $scope.blackMoreThan_day;  // 黑名单一天内入店停留时间

        $scope.project.salesListId = $scope.salesListId;
        $scope.project.blackListId = $scope.blackListId;


        // 营业时间
        $scope.project.openingTime1 =$.trim($scope.open_time1);
        $scope.project.openingTime2 =$.trim($scope.open_time2);
        $scope.project.closingTime1 =$.trim($scope.close_time1);
        $scope.project.closingTime2 =$.trim($scope.close_time2);


        var ids = $scope.ids.join(",");
        $scope.project.projectIds = ids;

    };

    $scope.filterProject = function (project) {
        if (project.hasOwnProperty("openingTime1")) {
            delete project["openingTime1"];
        }
        if (project.hasOwnProperty("openingTime2")) {
            delete project["openingTime2"];
        }
        if (project.hasOwnProperty("closingTime1")) {
            delete project["closingTime1"];
        }
        if (project.hasOwnProperty("closingTime2")) {
            delete project["closingTime2"];
        }
        return project;
    };


    // 保存结果
    $scope.saveProject = function () {
        $scope.setProject();
        $scope.project = $scope.filterData($scope.project);
        // 客流阈值设置
        if (($scope.project.hasOwnProperty("crowdActiveHighBegin") && !$scope.project.hasOwnProperty("crowdActiveHighEnd")) || (!$scope.project.hasOwnProperty("crowdActiveHighBegin") && $scope.project.hasOwnProperty("crowdActiveHighEnd"))) {
            $.Pop.alerts("请将高活跃客流阈值补充完整。");
            return;
        } else {
            if(parseInt($scope.project.crowdActiveHighBegin) > parseInt($scope.project.crowdActiveHighEnd)) {
                $.Pop.alerts("高活跃客流阈值填写错误。");
                return;
            }
        }
        if (($scope.project.hasOwnProperty("crowdActiveMediumBegin") && !$scope.project.hasOwnProperty("crowdActiveMediumEnd")) || (!$scope.project.hasOwnProperty("crowdActiveMediumBegin") && $scope.project.hasOwnProperty("crowdActiveMediumEnd"))) {
            $.Pop.alerts("请将中活跃客流阈值补充完整。");
            return;
        } else {
            if (parseInt($scope.project.crowdActiveMediumBegin) > parseInt($scope.project.crowdActiveMediumEnd)) {
                $.Pop.alerts("中活跃客流阈值填写错误。");
                return;
            }
        }
        if (($scope.project.hasOwnProperty("crowdActiveLowBegin") && !$scope.project.hasOwnProperty("crowdActiveLowEnd")) || (!$scope.project.hasOwnProperty("crowdActiveLowBegin") && $scope.project.hasOwnProperty("crowdActiveLowEnd"))) {
            $.Pop.alerts("请将低活跃客流阈值补充完整。");
            return;
        } else {
            if (parseInt($scope.project.crowdActiveLowBegin) > parseInt($scope.project.crowdActiveLowEnd)) {
                $.Pop.alerts("低活跃客流阈值填写错误。");
                return;
            }
        }
        // 店员阈值设置
        if (($scope.project.hasOwnProperty("salesConsecutive_day") && !$scope.project.hasOwnProperty("salesComeDay")) || (!$scope.project.hasOwnProperty("salesConsecutive_day") && $scope.project.hasOwnProperty("salesComeDay"))) {
            $.Pop.alerts("请将店员流阈值补充完整。");
            return;
        } else {
            if (parseInt($scope.project.salesConsecutive_day) < parseInt($scope.project.salesComeDay)) {
                $.Pop.alerts("入店员流阈值填写错误。");
                return;
            }
        }
        // 黑名单阈值设置
        if (($scope.project.hasOwnProperty("blackConsecutiveDay") && !$scope.project.hasOwnProperty("blackComeDay")) || (!$scope.project.hasOwnProperty("blackConsecutiveDay") && $scope.project.hasOwnProperty("blackComeDay"))) {
            $.Pop.alerts("请将黑名单阈值补充完整。");
            return;
        } else {
            if (parseInt($scope.project.blackConsecutiveDay) < parseInt($scope.project.blackComeDay)) {
                $.Pop.alerts("黑名单阈值填写错误。");
                return;
            }
        }
        // 营业时间
        if (($scope.project.hasOwnProperty("openingTime1") && !$scope.project.hasOwnProperty("openingTime2")) || (!$scope.project.hasOwnProperty("openingTime1") && $scope.project.hasOwnProperty("openingTime2"))) {
            $.Pop.alerts("请将营业时间阈值补充完整。");
            return;
        }
        if ($scope.project.hasOwnProperty("openingTime1") || $scope.project.hasOwnProperty("openingTime2")) {
            if(!$scope.project.hasOwnProperty("closingTime1")){
                $.Pop.alerts("请将营业时间阈值补充完整。");
                return;
            }
        }
        if (($scope.project.hasOwnProperty("closingTime1") && !$scope.project.hasOwnProperty("closingTime2")) || (!$scope.project.hasOwnProperty("closingTime1") && $scope.project.hasOwnProperty("closingTime2"))) {
            $.Pop.alerts("请将营业时间阈值补充完整。");
            return;
        }

        $scope.project.openingTime =  $scope.project.openingTime1 + ":" + $scope.project.openingTime2;
        $scope.project.closingTime = $scope.project.closingTime1 + ":" + $scope.project.closingTime2;
        $scope.project = $scope.filterProject($scope.project);
        // 验证每个值是不是正整数
        var ex = /^[1-9]\d*$/;

        // 验证每个值是不是负整数
        var exf = /^0|-[0-9]\d*$/;

        // 验证时间格式
        var regexp = /^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/;
        for (var key in $scope.project) {
            if (key != "closingTime" && key != "openingTime" && key != "salesListId" && key != "blackListId" && key != "projectIds" && key != "strengthCrowdBefore" && key != "strengthCrowdCome") {
                if (!(ex.test($scope.project[key]))) {
                    $.Pop.alerts("阈值格式填写错误。");
                    return;
                }
            }

            if(key == "strengthCrowdBefore"){
                if (exf.test($scope.project[key]) == false) {
                    $.Pop.alerts("周边客流格式填写错误，请填写负整数。");
                    return;
                }
            }

            if(key == "strengthCrowdCome"){
                if (exf.test($scope.project[key]) == false) {
                    $.Pop.alerts("入店客流格式填写错误，请填写负整数。");
                    return;
                }
            }

            if(key == "openingTime"){
                if($scope.project[key]=='undefined:undefined'){
                    delete $scope.project[key];
                }else {
                    if(!regexp.test($scope.project[key])){
                        $.Pop.alerts("营业时间格式填写错误。");
                        return
                    }
                }
            }
            if(key == "closingTime"){
                if($scope.project[key]=='undefined:undefined'){
                    delete $scope.project[key];
                }else {
                    if(!regexp.test($scope.project[key])){
                        $.Pop.alerts("营业时间格式填写错误。");
                        return
                    }
                }
            }

        }

        CommonService.create('SaveThresholdSet', $scope.project).then(function (response) {
            $state.go('thresholdSet');
        });
    };

    // 放弃
    $scope.go_project_batchSet = function () {
        $state.go('thresholdSet');
    };

});