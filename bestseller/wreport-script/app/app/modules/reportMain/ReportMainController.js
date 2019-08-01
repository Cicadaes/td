'use strict';

angular.module('wreport.app').controller('ReportMainController', function ($scope, $state, $location, NgTableParams, CommonService, CommonFunc) {

    var url = $state.$current.url.source;

    var reportMapper = {
        //集团概览
        "/report/groupOverview": '514',
        //城市概览
        "/report/cityOverview_1": '526',
        //合作商概览
        "/report/partnersOverview_1": '528',

        //运营概览-店铺
        "/report/operationOverview_store": '530',
        //运营概览-城市
        "/report/operationOverview_city": '531',
        //运营概览-大区
        "/report/operationOverview_region": '532',
        //运营概览-品牌
        "/report/operationOverview_brand": '571',

        //客流动态-小时动态
        "/report/hourlyDynamics": '536',
        //空间动态
        "/report/spatialDynamics": '576',
        //店铺热力图
        "/report/thermodynamicChart": '577',

        //趋势指标
        "/report/trendIndex": '540',
        //活跃指标
        "/report/activeIndex": '544',
        //转化指标
        "/report/transformIndex": '542',

        //来源分析
        "/report/sourceAnalysis": '517',
        //订单分析
        "/report/orderAnalysis": '550',

    };

    var reportId = reportMapper[url];

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
                        var stateName = $state.current.name;

                        CommonService.filterMenu($state.menuList, stateName, data.projectType);
                        CommonService.refreshAngular($scope);

                        if (stateName.startsWith("operationOverview")) {
                            if (CommonService.stateMap["projectTyep_" + data.projectType] != stateName) {
                                $state.go(CommonService.stateMap["projectTyep_" + data.projectType]);
                            }
                        } else if (stateName == "thermodynamicChart" || stateName == "spatialDynamics") {
                            if (CommonService.stateMap2["projectTyep_" + data.projectType] != stateName) {
                                $state.go(CommonService.stateMap2["projectTyep_" + data.projectType]);
                            }
                        }
                    },
                    error: CommonService.errorCallback,
                });
            }
        }
    }

    window.DatWillSDK.getInstance().renderReport('.stage', reportId, msgOut);

    //判断当前url
    var stateArray = ["groupOverview", "ProjectRankingList",
        "cityOverview_1", "partnersOverview_1"];

    var urlArray = [
        "/report/groupOverview",
        "/report/rankingList",
        "/report/cityOverview_1",
        "/report/partnersOverview_1"
    ];

    function contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }

    if (!contains(urlArray, url)) {
        if ($state.projectVM) {
            window.DatWillSDK.getInstance().getParameter({
                projectType: $state.projectVM.projectType,//1店铺   4城市  5大区  6品牌  2自定义
                projectId: $state.projectVM.projectId,//6015 // 7194
                projectName: $state.projectVM.projectName,
                group_sign: $state.group_sign,
                getFilterMethod: "old"
            })
        }
    } else {
        window.DatWillSDK.getInstance().getParameter({
            getFilterMethod: "old"
        });
    }

});
