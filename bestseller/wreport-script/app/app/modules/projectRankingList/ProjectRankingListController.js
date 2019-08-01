'use strict';

angular.module('wreport.app').controller('ProjectRankingListController', function ($scope, $state, $location, NgTableParams, CommonService) {

    var reportId = "607";

    function msgOut(message) {
        if (message.target == "date" && message.result) {
            $scope.dateFlag = 0;
            if (message.result.dateType == "week") {
                $scope.dateFlag = 1;
            } else if (message.result.dateType == "month") {
                $scope.dateFlag = 2;
            }

            var dateObjList = message.result.date;
            var startDate = "";
            var endDate = "";
            for (var i = 0; i < dateObjList.length; i++) {
                var obj = dateObjList[i];
                if (obj.field == "date" && obj.operator == ">=") {
                    startDate = obj.value;
                    
                    
                    
                } else if (obj.field == "date" && obj.operator == "<=") {
                    endDate = obj.value;
                   
                }
            }

            $scope.changeDateFromStage(startDate, endDate, $scope.dateFlag);
        }
    }

    window.DatWillSDK.getInstance().renderReport('.stage', reportId, msgOut);
    //======================================
    $scope.constants = $state.constants;
    $scope.onProjectClick = function () {

    };

    $scope.group_sign = $state.group_sign;

    $state.weekMonthFlag = "day";
    // $scope.favoriteFlag = 0;  // 显示收藏标志
    // $scope.dateFlag = 0;  // 按天、月、周查看标志

    $scope.initTime = function () {
        $scope.dateInForm = {
            tagDataTimeStart: 1501516800000,
            tagDataTimeEnd: 1511526800000
        };

        // 初始化日期控件的默认值
        var date = new Date();
        $scope.dateInTop = {
            tagDataTimeStart: date.getTime() - 86400000 * 30,
            tagDataTimeEnd: date.getTime() - 86400000
        };

        $scope.fastSelectDays = [{
            key: '-1',
            label: $scope.constants.prompt_date_yestoday
        }, {
            key: '-7',
            label: $scope.constants.prompt_date_days7
        }, {
            key: '-30',
            label: $scope.constants.prompt_date_days30
        }, {
            key: '-60',
            label: "近60日"
        }];

        $scope.fastSelectDays1 = [{
            key: '-1',
            label: "上月"
        }, {
            key: '-3',
            label: "近3个月"
        }, {
            key: '-6',
            label: "近6个月"
        }, {
            key: '-12',
            label: "近12个月"
        }];

        //近六个月
        var data = function () {
            //创建现在的时间
            var data = new Date();
            //获取年
            var year = data.getFullYear();
            //获取月
            var mon = data.getMonth() + 1;
            var arry = new Array();
            for (var i = 0; i < 6; i++) {

                if (mon <= 0) {
                    year = year - 1;
                    mon = mon + 12;
                }
                if (mon < 10) {
                    mon = "0" + mon;
                }

                arry[i] = year + "-" + mon + '-01';
                mon--;
            }

            return arry;
        };
        $scope.monthArr = data();

    };

    $scope.initTime();

    $scope.filterDateFlage = false;
    $scope.filterDateDay = true;
    $scope.filterDateText = "按天查看";
    $scope.filterDate = function (event, one) {
        $scope.weekFlag = one.type;
        $state.weekMonthFlag = one.type;
        event.stopPropagation();
        $scope.filterDateText = one.name;
        $scope.filterDateFlage = false;
        if (one.type == "day") {
            $scope.filterDateDay = true;
            $scope.dateFlag = 0;
        } else {
            $scope.filterDateDay = false;
            (one.type == "week") ? $scope.aaa = "week" : $scope.aaa = "month";
            (one.type == "week") ? $scope.dateFlag = 1 : $scope.dateFlag = 2;
            // 初始化日期控件的默认值
            var date = new Date();
            if (one.type == "week") {
                $scope.dateInForm.tagDataTimeStart = 1501516800000;
                $scope.dateInForm.tagDataTimeEnd = 1511526800000;
                $scope.fastSelectDays1 = [{
                    key: '-1',
                    label: "上周"
                }, {
                    key: '-4',
                    label: "近4周"
                }, {
                    key: '-8',
                    label: "近8周"
                }, {
                    key: '-16',
                    label: "近16周"
                }];
            } else {
                $scope.fastSelectDays1 = [{
                    key: '-1',
                    label: "上月"
                }, {
                    key: '-3',
                    label: "近3个月"
                }, {
                    key: '-6',
                    label: "近6个月"
                }, {
                    key: '-12',
                    label: "近12个月"
                }];
                $scope.dateInForm.tagDataTimeStart = $scope.monthArr[5];
                $scope.dateInForm.tagDataTimeEnd = $scope.monthArr[0];
            }
        }

        // if($scope.tabType == 'mechanism'){  // 机构排名
        //     $state.filterMechanismList();
        // }else if($scope.tabType == 'province'){  // 省市排名
        //     $state.filterProvinceList();
        // }else { // 合作商排名
        //     $state.filterOperativeList();
        // }
    };

    // 日历 -- 天
    $scope.changeTagDataTime = function (start, end) {
        $scope.dateInTop.tagDataTimeStart = start;
        $scope.dateInTop.tagDataTimeEnd = end;
        $scope.startStr_day = new Date(start).Format('yyyy-MM-dd');
        $scope.endStr_day = new Date(end).Format('yyyy-MM-dd');
        if ($scope.tabType == 'mechanism') {  // 机构排名
            $state.filterMechanismList($scope.startStr_day, $scope.endStr_day);
        } else if ($scope.tabType == 'province') {  // 省市排名
            $state.filterProvinceList($scope.startStr_day, $scope.endStr_day);
        } else { // 合作商排名
            $state.filterOperativeList($scope.startStr_day, $scope.endStr_day);
        }
    };

    // 日历 -- 周月
    $scope.changeTagDataWeekMonth = function (start, end) {
        $scope.dateInForm.tagDataTimeStart = start;
        $scope.dateInForm.tagDataTimeEnd = end;
        if ($scope.weekFlag == "week") {
            $scope.startStr_wm = new Date(start).Format('yyyy-MM-dd');
            $scope.endStr_wm = new Date(end).Format('yyyy-MM-dd');
        } else {
            $scope.startStr_wm = new Date(start).Format('yyyy-MM-dd');
            $scope.endStr_wm = new Date(end).Format('yyyy-MM-dd');
        }

        if ($scope.tabType == 'mechanism') {  // 机构排名
            $state.filterMechanismList();
        } else if ($scope.tabType == 'province') {  // 省市排名
            $state.filterProvinceList();
        } else { // 合作商排名
            $state.filterOperativeList();
        }
    };

    $scope.changeDateFromStage = function (start, end, rangeQuery) {

        if ($scope.tabType == 'mechanism') {  // 机构排名
            $state.filterMechanismList(start, end, rangeQuery);
        } else if ($scope.tabType == 'province') {  // 省市排名
            $state.filterProvinceList(start, end, rangeQuery);
        } else { // 合作商排名
            $state.filterOperativeList(start, end, rangeQuery);
        }
    };

    $scope.dateList = [
        {"name": "按天查看", "type": "day"},
        {"name": "按周查看", "type": "week"},
        {"name": "按月查看", "type": "month"}
    ];

    $scope.makeStar = function (project, $event) {
        var queryobj = {};
        if (project.favorite > 0) {
            // 取消收藏
            queryobj = {
                favorite: project.projectId
            };
            $event.stopPropagation();
            // 请求星标（取消收藏）接口
            $.ajax({
                type: 'DELETE',
                url: "api/projectUserRelations/" + project.projectId,
                data: queryobj,
                success: function () {
                    project.favorite = 0;
                    CommonService.refreshAngular($scope);
                }, error: function (data) {
                }
            });
        } else if (project.favorite <= 0) {
            // 收藏
            queryobj = {
                projectId: project.projectId,
                type: 1,
                status: 1
            };
            $event.stopPropagation();
            // 请求星标（收藏）接口
            CommonService.create('CollectOne', queryobj).then(function (response) {
                var data = response.data;
                project.favorite = data.id;
                CommonService.refreshAngular($scope);
            });
        }
    };

    $scope.tabType = "mechanism";
    $scope.changTab = function (type) {
        $scope.tabType = type;
        $scope.filterDateFlage = false;
        $scope.filterDateDay = true;
        $scope.filterDateText = "按天查看";
        $scope.initTime();
    };

    // 日历类型过滤框
    $scope.filterDateShow = function (event) {
        event.stopPropagation();
        $scope.initTime();
        $scope.filterDateFlage = !$scope.filterDateFlage;
    };

    var viewType = $location.search()['viewType'];
    if (viewType && viewType == "city") {
        $scope.changTab("province");
    } else if (viewType && viewType == "partner") {
        $scope.changTab("operative");
    }
});