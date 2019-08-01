'use strict';

angular.module('wreport.app').controller('ComPeopleExpenseController', function ($scope, $state, $location, CommonService) {

    // 消费能力
    $scope.requestDataAll_1 = function (opraDom, comp_side) {

        if (true && comp_side != 2) {
            // 请求对比1
            var projectId = $scope.currentProjectId;
            var crowdId = $scope.firstid;
            if ($scope.comparePanelType == 'multi') {
                projectId = $scope.firstid;
                crowdId = $scope.crowd_map[$scope.firstid];
            }
            var param = {
                "startDate": $scope.comp_date_1_start,
                "endDate": $scope.comp_date_1_end,
                "limit": 20,
                "projectId": projectId,
                crowdId: crowdId
            };

            if (!$scope.urlType) {
                CommonService.request('queryPhoneBrandList', param).then(function (response) {
                    $scope.expenseAbility1(opraDom, response.data, 0);
                });
                CommonService.request('queryPhonePriceList', param).then(function (response) {
                    $scope.expenseAbility2(opraDom, response.data, 0);
                });
                // CommonService.request('queryShopCenterList', param).then(function (response) {
                //     $scope.expenseAbility3(opraDom, response.data, 0);
                // });
                // CommonService.request('queryShopBrandList', param).then(function (response) {
                //     $scope.expenseAbility4(opraDom, response.data, 0);
                // });
                // CommonService.request('queryRestaurantBrandList', param).then(function (response) {
                //     $scope.expenseAbility5(opraDom, response.data, 0);
                // });
            } else {

                var execId = $scope.execId;
                var obj = {
                    projectId: projectId,
                    execId: execId
                };
                CommonService.request('BehaviorCrowdPhoneBrandList', obj).then(function (response) {
                    $scope.expenseAbility1(opraDom, response.data, 0);
                });
                CommonService.request('BehaviorCrowdPhonePriceList', obj).then(function (response) {
                    $scope.expenseAbility2(opraDom, response.data, 0);
                });
            }

        }

        if ($scope.status == 'compare_double' && comp_side != 1) {
            // 请求对比2
            var projectId2 = $scope.currentProjectId;
            var crowdId2 = $scope.secondid;
            if ($scope.comparePanelType == 'multi') {
                projectId2 = $scope.secondid;
                crowdId2 = $scope.crowd_map[$scope.secondid];
            }
            var param2 = {
                "startDate": $scope.comp_date_2_start,
                "endDate": $scope.comp_date_2_end,
                "limit": 20,
                "projectId": projectId2,
                crowdId: crowdId2
            };

            CommonService.request('queryPhoneBrandList', param2).then(function (response) {
                $scope.expenseAbility1(opraDom, response.data, 1);
            });
            CommonService.request('queryPhonePriceList', param2).then(function (response) {
                $scope.expenseAbility2(opraDom, response.data, 1);
            });
            // CommonService.request('queryShopCenterList', param).then(function (response) {
            //     $scope.expenseAbility3(opraDom, response.data, 1);
            // });
            // CommonService.request('queryShopBrandList', param).then(function (response) {
            //     $scope.expenseAbility4(opraDom, response.data, 1);
            // });
            // CommonService.request('queryRestaurantBrandList', param).then(function (response) {
            //     $scope.expenseAbility5(opraDom, response.data, 1);
            // });
        }
    };

    if ($scope.$parent) {
        $scope.$parent.requestDataAll_1 = $scope.requestDataAll_1;
    }

    $scope.expenseAbility1 = function (picpar, arr, compIndex) {
        var use_chart_01 = $('.use_chart_01')[compIndex];
        $scope.drawiphonecircleimg(use_chart_01, arr, $scope.constants.label_phoneBrand);
    };
    $scope.expenseAbility2 = function (picpar, arr, compIndex) {
        var use_chart_02 = $('.use_chart_02')[compIndex];
        $scope.drawiphonecircleimg(use_chart_02, arr, $scope.constants.label_phonePrice);
    };
    $scope.expenseAbility3 = function (picpar, arr, compIndex) {
        if (compIndex == 0) {
            $scope.shopcenter = arr;
        } else {
            $scope.shopcenter_2 = arr;
        }
    };
    $scope.expenseAbility4 = function (picpar, arr, compIndex) {
        if (compIndex == 0) {
            $scope.shopbrand = arr;
        } else {
            $scope.shopbrand_2 = arr;
        }
    };
    $scope.expenseAbility5 = function (picpar, arr, compIndex) {
        if (compIndex == 0) {
            $scope.restaurantbrand = arr;
        } else {
            $scope.restaurantbrand_2 = arr;
        }
    };

    $scope.drawiphonecircleimg = function (main, arr, title) {
        if (!arr || arr.length == 0) {
            arr = [{
                sta_value: 0,
                tag_name: 'unknow'
            }];
        }

        var namearr = [];
        var rarr = [];
        var len = arr.length;
        var sum = 0;
        var i = 0;

        // 遍历所有的name
        for (; i < len; i++) {
            namearr.push(arr[i].tag_name);
            sum += parseFloat(arr[i].sta_value);
            rarr.push({
                name: arr[i].tag_name,
                value: parseFloat(arr[i].sta_value)
            });
        }
        //客群画像，消费能力饼图
        var option = chartOptionUtil.getPeopleExpenseOption(title, rarr, sum, $state.theme_color_value);

        var myChart = echarts.init(main);
        myChart.setOption(option);
    };

    $scope.pct = function (count, float) {
        float = float || 1;
        var res = '';
        count = parseFloat(count);
        if (Math.abs(count) > 100) {
            res = '100%+';
        } else {
            var _count = Math.abs(count);
            res = _count.toFixed(float) + '%';
        }
        return res;
    }
});

angular.module('wreport.app').directive('comPeopleExpense', function () {
    return {
        restrict: 'A',
        controller: 'ComPeopleExpenseController',
        templateUrl: 'app/modules/passengerPortrait/component/comPeopleExpense.html'
    };
});
