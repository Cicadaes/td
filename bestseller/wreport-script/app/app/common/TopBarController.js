'use strict';

angular.module('wreport.app').controller('TopBarController', function ($scope, $state, $http, $location, CommonService, $templateCache) {

    $state.theme_color_value = '#43A3FB';

    //==========================================

    var menuArray = [
        "groupOverview",
        "cityOverview_1",
        "partnersOverview_1",
        "ProjectRankingList",

        "loading",

        "projectManagement",
        "MaintenanceManagement",
        "thresholdSet",
        "targetManagements",
        "BlueprintManagement",

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

    //==========================================

    //切换项目时候设置
    $scope.setEnvByProjectVM = function (project) {
        if (project.id == undefined) {
            project.id = project.projectId;
        }
        if (project.projectId == undefined) {
            project.projectId = project.id;
        }

        $state.projectVM = project;

        var colorMap = {
            'blue': '#43A3FB',
            'green': '#02aea2'
        };
        $state.theme_color_value = colorMap['blue'];

        $scope.publishParamUrl('all');

        //设置菜单scope的项目类型，隐藏部分菜单
        $scope.$$prevSibling.projectType = project.projectType;

    };

    //切换语言时候设置
    $scope.setLanguage = function (type) {
        //空值时默认取浏览器
        if (!type) {
            type = $scope.getNavigator();
        }

        //用于切换语言按钮
        $scope.lanType = type;
        //用于全局
        appConfig.language = type;
        $location.search('language', appConfig.language);

        //根据语言取得资源到state
        $state.constants = appConfig.constants[type];
        $state.tipsObj = appConfig.tips[type];

        //资源放到scope，包括topbar，accordion，和其他
        $scope.constants = $state.constants;
        $scope.$$prevSibling.constants = $state.constants;
        if ($scope.$$nextSibling) {
            $scope.$$nextSibling.constants = $state.constants;
        }

        //其他设置
        $scope.$$prevSibling.menuList = $scope.getMenuList(type);
        $scope.loadJs();
        CommonService.refreshAngular($scope);

        $scope.$parent.$broadcast("constantsCallback", 'aaa');
    };

    $scope.loadJs = function () {
        if (appConfig.language == "english") {
            $templateCache.put('ng-table/loading.html', '<div class="ng-cloak ng-table-empty" ng-show="!params.settings().$firstLoaded && !params.settings().$loading && params.data.length == 0">No Data</div><div ng-show="params.settings().$loading" class="empty-box-table-panel"><div class="empty-box-table-bg"></div><div class="empty-box-table"></div></div>');
            $templateCache.put('ng-table/pager.html', '<div class="ng-cloak ng-table-pager" ng-if="params.data.length > 0"><div class="ng-table-counts btn-group pull-right page-count-box"><span>Display per Page</span><select ng-model="pageCount" ng-change="params.count(pageCount);"><option ng-repeat="count in params.settings().counts" value="{{count}}" ng-selected="params.count()==count">{{count}}</option></select> <i class="tb-refresh" title="Refresh" ng-click="params.reload();"></i> </div> <ul class="pagination ng-table-pagination"> <li ng-class="{\'disabled\': !page.active && !page.current, \'active\': page.current}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="first" ng-click="params.page(page.number)" href="" class="first">First Page</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="last" ng-click="params.page(page.number)" href="" class="last">Last Page</a> </li> </ul> </div> ');
        } else {
            $templateCache.put('ng-table/loading.html', '<div class="ng-cloak ng-table-empty" ng-show="!params.settings().$firstLoaded && !params.settings().$loading && params.data.length == 0">暂无数据</div><div ng-show="params.settings().$loading" class="empty-box-table-panel"><div class="empty-box-table-bg"></div><div class="empty-box-table"></div></div>');
            $templateCache.put('ng-table/pager.html', '<div class="ng-cloak ng-table-pager" ng-if="params.data.length > 0"><div class="ng-table-counts btn-group pull-right page-count-box"><span>每页显示</span><select ng-model="pageCount" ng-change="params.count(pageCount);"><option ng-repeat="count in params.settings().counts" value="{{count}}" ng-selected="params.count()==count">{{count}}条</option></select> <i class="tb-refresh" title="刷新" ng-click="params.reload();"></i> </div> <ul class="pagination ng-table-pagination"> <li ng-class="{\'disabled\': !page.active && !page.current, \'active\': page.current}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="first" ng-click="params.page(page.number)" href="" class="first">首页</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="last" ng-click="params.page(page.number)" href="" class="last">末页</a> </li> </ul> </div> ');
        }
        if (appConfig.ngTableScope) {
            appConfig.ngTableScope(null, null, true);
        }
    };
    $scope.lanType = "chinese";
    $scope.changeLanguage = function () {
        if ($scope.lanType == "chinese") {
            $scope.lanType = "english"
        } else {
            $scope.lanType = "chinese"
        }
        $scope.setLanguage($scope.lanType);
        $scope.$$nextSibling.dataFlagUpdate();
    };

    $scope.getNavigator = function () {
        var lang = (navigator.systemLanguage ? navigator.systemLanguage : navigator.language);
        //获取浏览器配置语言 #括号内是个运算，运算过后赋值给lang，当?前的内容为true时把?后的值赋给lang，为False时把:后的值赋给lang
        var lang = lang.substr(0, 2);//获取lang字符串的前两位
        var result = "";
        if (lang == 'zh') {
            result = "chinese";
        } else {
            result = "english";
        }
        return result;
    };

    $scope.getMenuList = function (type) {
        var menuList = $state.menuList;
        angular.forEach(menuList, function (item, index, array) {
            if (item.resourceUri != "") {
                item.resourceLabel = $scope.constants[item.resourceUri] || item.resourceLabel;
            } else {
                item.resourceLabel = $scope.constants[item.resourceName] || item.resourceLabel;
            }
            if (item.childrens) {
                angular.forEach(item.childrens, function (child) {
                    child.resourceLabel = $scope.constants[child.resourceUri] || child.resourceLabel;
                })
            }
        });
        return menuList
    };

    // 将当前scope共享给其他页面
    $state.topBarScope = $scope;
    $scope.showLanguageBtn = false;

    //切换菜单后的回调事件
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "changeTenant_a"
            || toState.name == "changeTenant_b"
            || toState.name == "changeTenant_c"
            || toState.name == "changeTenant_d"
            || toState.name == "changeTenant_e") {
            var tenantIdMap = $state.tenantIdMap || {};
            $.ajax({
                url: 'api/changeTenant/' + tenantIdMap[toState.name],
                async: false,
                data: {},
                type: 'get',
                success: function (data) {
                    $.ajax({
                        url: '/wreport_datareport/api/changeTenant/' + tenantIdMap[toState.name],
                        async: false,
                        data: {},
                        type: 'get',
                        success: function (data) {
                            $scope.$$prevSibling.currentTenantName = $state.tenantNameMap[data.after];
                            $.Pop.alerts("租户切换成功");
                            if (CommonService.variableMenuMap[fromState.name]) {
                                $state.go("ProjectRankingList");
                            } else {
                                $state.go(fromState.name);
                            }
                        },
                        error: CommonService.errorCallback
                    });
                },
                error: CommonService.errorCallback
            });
        }

        $scope.$$nextSibling.$scopeName = toState.name;
        if (fromState.name) {
            if (contains(menuArray, toState.name)) {
                $scope.publishParamUrl('limit');
            } else {
                $scope.publishParamUrl('all');
            }
        }

        var projectType = null;
        if ($state.projectVM) {
            projectType = $state.projectVM.projectType;
        }
        CommonService.filterMenu($state.menuList, toState.name, projectType, fromState.name == '');
        CommonService.refreshAngular($scope);

        $scope.resetHeight();
        $scope.$$nextSibling.constants = $state.constants;
    });

    $scope.topbar_show = false;

    // 控制多应用窗口框架的宽高
    $scope.menuWidth = 180;
    $scope.titleHeight = 0;
    $scope.resetHeight = function () {
        var window = appConfig.thisWindow;
        var content_main_div = document.getElementById("content_main");

        var body_div = $("body");

        var winHg = $(window).height();
        content_main_div.style.height = (winHg - $scope.titleHeight + "px");

        var winWd = $(window).width();
        content_main_div.style.width = (winWd - $scope.menuWidth + "px");

        $("body").css('height', winHg + 'px');
    };

    //处理自适应窗口大小，主要是高度
    $scope.resize = function () {
        $scope.resetHeight();
        if ($scope.$$nextSibling.resize) {
            $scope.$$nextSibling.resize();
            CommonService.refreshAngular($scope.$$nextSibling);
        }
    };

    var hideFunc = function (e) {
        CommonService.refreshAngular($scope);
    };

    setTimeout(function () {
        $('body').on('click', hideFunc);
    });

    $scope.$on("$destroy", function () {
        $('body').off('click', hideFunc);
    });

    // 配置地址栏参数
    $scope.publishParamUrl = function (type) {
        $location.search('language', appConfig.language);
        if (type == 'all') {
            if ($state.projectVM) {
                $location.search('projectId', $state.projectVM.projectId);
                $location.search('projectName', $state.projectVM.projectName);
                $location.search('projectType', $state.projectVM.projectType);
                $location.search('longitude', $state.projectVM.longitude);
                $location.search('latitude', $state.projectVM.latitude);
                $location.search('city', $state.projectVM.city);
                $location.search('defaultCrowd', $state.projectVM.defaultCrowd);
            }
        }
    };

    //刷新页面的逻辑
    var refreshInit = function () {
        $scope.setLanguage($location.search()['language']);

        window.onresize = $scope.resize;

        //根据菜单，是否从url获取参数
        var url = $location.$$url;
        var index = $location.$$url.indexOf('?');
        if (index > 0) {
            url = $location.$$url.substr(0, index);
        }
        if (url == "/report/loading"
            || url == "/report/groupOverview"
            || url == "/report/rankingList"
            || url == "/report/cityOverview_1"
            || url == "/report/partnersOverview_1"

            || url == "/project/projectManagement"
            || url == "/project/maintenanceManagement"
            || url == "/project/thresholdManagement"
            || url == "/project/targetManagement"
            || url == "/project/drawingManagement"

        ) {
            return;
        }

        var projectId = $location.search()['projectId'];
        var projectName = $location.search()['projectName'];
        var projectType = $location.search()['projectType'];
        var longitude = $location.search()['longitude'];
        var latitude = $location.search()['latitude'];
        var city = $location.search()['city'];
        var defaultCrowd = $location.search()['defaultCrowd'];

        if (!projectId || !projectName || !projectType) {
            $scope.$$prevSibling.goFirstMenuItemFromRefresh();
        } else {
            $scope.setEnvByProjectVM({
                id: projectId,
                projectName: projectName,
                projectType: projectType,
                longitude: longitude,
                latitude: latitude,
                city: city,
                defaultCrowd: defaultCrowd
            });
        }

    }();

});
