'use strict';

angular.module('wreport.app').controller('ComPeopleCompareController', function ($scope, $state, $location, CommonService, CommonFunc) {

    $scope.CommonFunc = CommonFunc;

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

    var now = new Date();
    var month = now.getMonth();
    var date = (1900 + now.getYear()) + '-' + (month < 10 ? '0' + month : month);
    $scope.dateList = yugi(date);
    var date2 = $scope.dateList[1];
    $scope.comp_time_1 = date;
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
        $('.compare').show(150);
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
        $('.compare').hide(150);
        tdCheck.animate({
            right: "60px"
        });

        // 清除对比客群
        $scope.secondid = null;
        $scope.status = 'compare_single';
        $scope.compare_obj_2 = null;
        if(type == true)
        {
            $scope.checkCompareAll();
        }
    };

    $scope.comparePanelType = "single";
    $scope.initCrowd();
});

angular.module('wreport.app').directive('comPeopleCompare', function () {
    return {
        restrict: 'A',
        controller: 'ComPeopleCompareController',
        templateUrl: 'app/modules/passengerPortrait/component/comPeopleCompare.html'
    };
});
