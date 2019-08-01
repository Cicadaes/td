'use strict';

angular.module('wreport.app').controller('ComPeoplePropertyController', function ($scope, $state, $location, CommonService) {


    // 人口属性
    $scope.requestDataAll_0 = function (opraDom, comp_side) {
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
                "sexscalelimit": 2,
                "agedistributelimit": 6,
                "projectId": projectId,
                "crowdId": crowdId
            };

            if (!$scope.urlType) {
                // 客群画像数据
                CommonService.request('querySexRate', param).then(function (response) {
                    $scope.personProperty1(opraDom, response.data, 0);
                });
                CommonService.request('queryAgeDistribution', param).then(function (response) {
                    $scope.personProperty2(opraDom, response.data, 0);
                });
                CommonService.request('queryMarryCarChild', param).then(function (response) {
                    $scope.personProperty3(opraDom, response.data, 0);
                });
            } else {
                // 客户围群  --  行为详情进入
                var execId = $scope.execId;
                var obj = {
                    projectId: projectId,
                    execId: execId
                };

                CommonService.request('BehaviorCrowdSexRate', obj).then(function (response) {
                    $scope.personProperty1(opraDom, response.data, 0);
                });
                CommonService.request('BehaviorCrowdAgeDistribution', obj).then(function (response) {
                    $scope.personProperty2(opraDom, response.data, 0);
                });
                CommonService.request('BehaviorCrowdMarryCarChild', obj).then(function (response) {
                    $scope.personProperty3(opraDom, response.data, 0);
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
                "sexscalelimit": 2,
                "agedistributelimit": 6,
                "projectId": projectId2,
                crowdId: crowdId2
            };

            CommonService.request('querySexRate', param2).then(function (response) {
                $scope.personProperty1(opraDom, response.data, 1);
            });
            CommonService.request('queryAgeDistribution', param2).then(function (response) {
                $scope.personProperty2(opraDom, response.data, 1);
            });
            CommonService.request('queryMarryCarChild', param2).then(function (response) {
                $scope.personProperty3(opraDom, response.data, 1);
            });

            $scope.personProperty1(opraDom, $scope.genderDataCache, 0);
        }
    };

    if ($scope.$parent) {
        $scope.$parent.requestDataAll_0 = $scope.requestDataAll_0;
    }

    $scope.personProperty1 = function (picpar, arr, compIndex) {
        if (!arr) {
            arr = {
                maleRate: 0,
                femaleRate: 0
            }
        }
        if(compIndex == 0){
            $scope.genderDataCache = arr;
        }

        var properties = picpar.find('.properties');

        var p = compIndex;
        var prop = properties.eq(p),
            men = prop.find('dl').eq(0),
            women = prop.find('dl').eq(1),
            unknown = prop.find('dl').eq(2),
            compare_boy = prop.find('.compare_boy'),
            compare_girl = prop.find('.compare_girl'),
            compare_unknown = prop.find('.compare_unknown'),
            gwidth = 0,
            bwidth = 0,
            uwidth = 0,
            boyover = 0,
            grilover = 0,
            uover = 0;

        // 性别比例
        men.find('strong').text(arr.maleRate + '%');
        compare_boy.css('width', arr.maleRate + '%');

        women.find('strong').text(arr.femaleRate + '%');
        compare_girl.css('width', arr.femaleRate + '%');

        unknown.find('strong').text(0 + '%');
        compare_unknown.css('width', 0 + '%');

        // 去除多余的边角
        gwidth = compare_girl.width();
        bwidth = compare_boy.width();
        uwidth = compare_unknown.width();

        boyover = bwidth % 15;
        grilover = gwidth % 15;
        uover = uwidth % 15;
        compare_boy.css('width', bwidth - boyover + 'px');
        compare_girl.css('width', gwidth - grilover + 'px');
        compare_unknown.css('width', uwidth - uover + 'px');
    };

    $scope.personProperty2 = function (picpar, arr, compIndex) {
        if (!arr) {
            arr = {
                age19Percent: 0,
                age25Percent: 0,
                age35Percent: 0,
                age45Percent: 0,
                age55Percent: 0,
                ageAbove55Percent: 0
            }
        }

        var dataList = [];
        dataList[0] = arr.age19Percent;
        dataList[1] = arr.age25Percent;
        dataList[2] = arr.age35Percent;
        dataList[3] = arr.age45Percent;
        dataList[4] = arr.age55Percent;
        dataList[5] = arr.ageAbove55Percent;
        dataList[6] = 20;

        var nameList = [];
        nameList[0] = $scope.constants.compare_size_following_english +'19'+ $scope.constants.company_age_yearOld + $scope.constants.compare_size_following;
        nameList[1] = '19-25' + $scope.constants.company_age_yearOld;
        nameList[2] = '26-35' + $scope.constants.company_age_yearOld;
        nameList[3] = '36-45' + $scope.constants.company_age_yearOld;
        nameList[4] = '46-55' + $scope.constants.company_age_yearOld;
        nameList[5] = $scope.constants.compare_size_above_english + '55' + $scope.constants.company_age_yearOld + $scope.constants.compare_size_above;;

        var properties = picpar.find('.properties');

        var p = compIndex;
        var prop = properties.eq(p);
        // 年龄分布
        var pli = prop.find('li'), lilen = pli.length, j = 0, max = 0;
        // 数组替换操作 年龄分布
        for (; j < lilen; j++) {
            var pj = pli.eq(j);
            var value = dataList[j];
            max = (parseFloat(max) < parseFloat(value)) ? value : max;
            if (value === max) { // 赋值当前元素
                pj.addClass('age_red').siblings().removeClass('age_red');
            }
            pj.find('i').text(value + '%');
            pj.find('span em').css('height', value + '%');
            pj.find('strong').text(nameList[j]);
        }
    };

    $scope.personProperty3 = function (picpar, arr, compIndex) {
        if (!arr) {
            arr = {
                marriedPercent: 0,
                haveChildrenPercent: 0,
                haveCarPercent: 0
            }
        }

        var properties = picpar.find('.properties');

        var p = compIndex;
        var prop = properties.eq(p);
        // 人群属性
        var whether_con = prop.find('.whether_con');
        var person = arr;
        // 数组替换操作
        $scope.drawcircleimg(whether_con[0], person.marriedPercent, $scope.constants.field_passengerPortrait_peopleproperty_married, $state.theme_color_value);
        $scope.drawcircleimg(whether_con[1], person.haveChildrenPercent, $scope.constants.field_passengerPortrait_peopleproperty_parenting, $state.theme_color_value);
        $scope.drawcircleimg(whether_con[2], person.haveCarPercent, $scope.constants.field_passengerPortrait_peopleproperty_haveCar, $state.theme_color_value);

    };

    $scope.drawcircleimg = function (main, obj, name, color) {
        $(main).find('em').text(name);
        $(main).find('strong').text(obj + '%');
        var whether_con_font = $(main).find('.whether_con_font').clone(),
            showval = parseFloat(obj),
            hideval = 100 - showval,
            myChart = echarts.init(main);
        myChart.showLoading();
        //客群画像，人口属性饼图
        var option = chartOptionUtil.getPeoplePropertyOption(showval, hideval, color);

        myChart.hideLoading();
        myChart.setOption(option);
        $(main).find('canvas').css('z-index', 1);
        $(main).append(whether_con_font);
    };
});

angular.module('wreport.app').directive('comPeopleProperty', function () {
    return {
        restrict: 'A',
        controller: 'ComPeoplePropertyController',
        templateUrl: 'app/modules/passengerPortrait/component/comPeopleProperty.html'
    };
});
