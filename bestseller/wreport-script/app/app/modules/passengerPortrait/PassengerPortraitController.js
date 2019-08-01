'use strict';

angular.module('wreport.app').controller('PassengerPortraitController', function ($scope, $state, $location, NgTableParams, CommonService) {

    var reportId = "608";

    function msgOut(message) {
        if (message.target == "organization" && message.result) {
            if (message.result && message.result.filter && message.result.filter["0"].field == "project_id") {
                var projectId = message.result.filter["0"].value;
                $.ajax({
                    url: 'api/projects/find/' + projectId,
                    async: false,
                    data: {},
                    type: 'get',
                    success: function (data) {
                        $state.topBarScope.setEnvByProjectVM(data);
                        $scope.onProjectClick();
                    },
                    error: CommonService.errorCallback,
                });
            }
        }
    }

    window.DatWillSDK.getInstance().renderReport('.stage', reportId, msgOut);

    window.DatWillSDK.getInstance().getParameter({
        projectType: $state.projectVM.projectType,//1店铺   4城市  5大区  6品牌  2自定义
        projectId: $state.projectVM.projectId,//6015 // 7194
        projectName: $state.projectVM.projectName,
        group_sign: $state.group_sign,
        getFilterMethod: "old"
    })
    //======================================
    $scope.constants = $state.constants;
    $scope.currentProjectId = $state.projectVM.projectId;

    //=============================

    $scope.changeParam = function (side) {

        $scope.firstid = $scope.crowd_id_1;
        $scope.secondid = $scope.crowd_id_2;
        $scope.checkCompareAll(side);

    }

    var container1 = $('.compare_con_l').first();
    var container2 = $('.compare_con_l').eq(1);
    var copyDom;
    $scope.status = 'compare_single';

    var yugi = function (now) {
        var d = new Date(now.replace(/[^\d]/g, "/") + "/1");
        var result = [now];
        for (var i = 0; i < 11; i++) {
            d.setMonth(d.getMonth() - 1);
            var m = d.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            result.push(d.getFullYear() + "-" + m);
        }
        return result;
    };
    function getPreMonth(date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
       if(String(month2).length==1){
           month2 = '0'+month2
       }

        var t2 = year2 + '-' + month2;
        return t2;
    }
    var now = new Date();
    var month = now.getMonth() + 1;
    var date = (1900 + now.getYear()) + '-' + (month < 10 ? '0' + month : month);
    var preMounth = getPreMonth(date);
    $scope.dateList = yugi(preMounth);
    var date2 = $scope.dateList[1];
    $scope.comp_time_1 = preMounth;
    $scope.comp_time_2 = date2;
    $scope.compare_obj_1_1 = {};
    $scope.compare_obj_2_2 = {};
    // 判断日历选择是的变化，中间变量
    $scope.data_1 = date;
    $scope.data_2 = date2;

    $scope.initCrowd = function () {
        var queryObj = {
            attr1: $scope.currentProjectId,
            status: 1
        };
        CommonService.request('crowdList', queryObj).then(function (response) {

            var res_data = response.data;
            var crowdList = [];

            angular.forEach(res_data, function (obj) {
                if ("AU" == obj.type) {
                    $scope.firstid = obj.id;
                }
                crowdList.push({
                    "id": obj.id,
                    "name": obj.name,
                    "type": obj.type
                });
            });

            $scope.crowdList = crowdList;
            if ($scope.crowdList.length > 0) {
                $scope.crowd_id_1 = $scope.crowdList[0].id;
                $scope.crowd_id_2 = $scope.crowdList[0].id;
                $scope.compare_obj_1 = $scope.crowdList[0];
                $scope.compare_obj_2 = $scope.crowdList[0];
                $scope.compare_obj_1_1 = $scope.crowdList[0];
            }

            $scope.checkCompareAll();
        });
    };

    $scope.panel_open = false;
    $scope.click = function () {
        if ($scope.panel_open) {
            $scope.closePanel(true);
        } else {
            $scope.openPanel();
        }
        CommonService.refreshAngular($scope);
    };

    // 开启按钮操作
    $scope.openPanel = function () {
        $scope.panel_open = true;
        var tdCheck = $('.td-open-check');
        tdCheck.animate({
            right: "0px"
        });

        $scope.status = 'compare_double';
        //$scope.checkCompareAll();
    };

    // 关闭按钮操作
    $scope.closePanel = function (type) {
        $scope.panel_open = false;
        var tdCheck = $('.td-open-check');
        tdCheck.animate({
            right: "60px"
        });

        // 清除对比客群
        $scope.secondid = null;
        $scope.status = 'compare_single';
        $scope.compare_obj_2 = null;
        if (type == true) {
            $scope.checkCompareAll();
        }
    };

    $scope.comparePanelType = "single";
    $scope.initCrowd();

    //==============================
    $state.idOld = $state.projectVM.projectId;

    $scope.onProjectClick = function () {
        $scope.currentProjectId = $state.projectVM.projectId;
        $scope.closePanel(false);
        $scope.initCrowd();
    };

    //初始化状态参数
    $scope.compareOpen = false;
    $scope.status = 'compare_single';
    $scope.listType = 0;

    $scope.crowdList = [];
    $scope.firstid = ''; // 到访客群 AU
    $scope.secondid = null;

    // =====================================控制end============================================

    $scope.checkCompareAll = function (comp_side) {

        var date_1 = new Date($scope.comp_time_1.replace(/[^\d]/g, "/") + "/1");
        $scope.comp_date_1_start = CommonService.formatDateLocal(date_1.getTime());
        var yearEnd1 = date_1.getFullYear();
        var monthEnd1 = date_1.getMonth() + 1;
        var dayCount1 = (new Date(yearEnd1, monthEnd1, 0)).getDate();
        //date_1.setMonth(date_1.getMonth() + 1);
        date_1.setDate((dayCount1));
        $scope.comp_date_1_end = CommonService.formatDateLocal(date_1.getTime());

        var date_2 = new Date($scope.comp_time_2.replace(/[^\d]/g, "/") + "/1");
        $scope.comp_date_2_start = CommonService.formatDateLocal(date_2.getTime());
        var yearEnd2 = date_2.getFullYear();
        var monthEnd2 = date_2.getMonth() + 1;
        var dayCount2 = (new Date(yearEnd2, monthEnd2, 0)).getDate();
        date_2.setDate((dayCount2));
        //date_2.setMonth(date_2.getMonth() + 1);
        $scope.comp_date_2_end = CommonService.formatDateLocal(date_2.getTime());

        $scope.dateLength = 30;

        var picturecon = $('.picturecon');
        var picpar = picturecon.eq(0);
        var picpar1 = picturecon.eq(1);
        var picpar2 = picturecon.eq(2);

        // 显示当前选项卡 存值
        picpar.show();
        picpar.siblings().hide();

        if ($scope.status == 'compare_single') {
            picpar.removeClass('groupscompare');
            picpar1.removeClass('groupscompare');
            picpar2.removeClass('groupscompare');
        } else {
            picpar.addClass('groupscompare');
            picpar1.addClass('groupscompare');
            picpar2.addClass('groupscompare');
        }

        // 人口属性
        $scope.requestDataAll_0(picpar, comp_side);
        // 消费能力
        $scope.requestDataAll_1(picpar1, comp_side);
        //应用偏好
        $scope.requestDataRadar(comp_side);

    };

    // =====================================控制end============================================

    // 初始化近七天时间
    var date = new Date();
    $scope.dateInTop = {
        tagDataTimeStart: date.getTime() - 86400000 * 6,
        tagDataTimeEnd: date.getTime(),
    };

    // 导出人群画像数据
    $scope.exportReport = function () {
        var crowdId2 = $scope.secondid;
        var crowdId = $scope.firstid;
        var queryObj = {
            startDate: CommonService.formatDateLocal($scope.dateInTop.tagDataTimeStart),
            endDate: CommonService.formatDateLocal($scope.dateInTop.tagDataTimeEnd),
            projectId: $scope.currentProjectId,
            exportType: "PassengerPeople", // 人群画像
            crowd1Id: crowdId, //$scope.firstid,
            crowd2Id: crowdId2 == "" ? -1 : (crowdId2 == null ? -1 : crowdId2) //$scope.secondid == "" ? -1 : ($scope.secondid == null ? -1 : $scope.secondid)
        };
        CommonService.request('export2excel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };

});
