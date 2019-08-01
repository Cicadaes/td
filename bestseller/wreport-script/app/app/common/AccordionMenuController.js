'use strict';

angular.module('wreport.app').controller('AccordionMenuController', function ($scope, $state, $http, $location, CommonService) {

    //初始化静态资源
    $state.constants = appConfig.constants["chinese"];
    $state.tipsObj = appConfig.tips["chinese"];
    $scope.constants = $state.constants;

    $scope.currentTenantName = '';

    var menuIconMap = {
        "仪表盘": "icon-2",
        "运营概览": "icon-8",
        "客流动态": "icon-4",
        "客流指标": "icon-3",
        "客流洞察": "icon-5",
        "销售指标": "icon-14",
        "配置管理": "icon-6"
    };

    var menuItemMap = {

        //loading
        "#/report/loading": "loading",

        //report
        "#/report/groupOverview": "groupOverview",
        "#/report/cityOverview_1": 'cityOverview_1',
        "#/report/partnersOverview_1": 'partnersOverview_1',

        "#/report/operationOverview_store": 'operationOverview_store',
        "#/report/operationOverview_city": 'operationOverview_city',
        "#/report/operationOverview_region": 'operationOverview_region',
        "#/report/operationOverview_brand": 'operationOverview_brand',

        "#/report/hourlyDynamics": 'hourlyDynamics',
        "#/report/spatialDynamics": 'spatialDynamics',
        "#/report/thermodynamicChart": 'thermodynamicChart',

        "#/report/trendIndex": 'trendIndex',
        "#/report/activeIndex": 'activeIndex',
        "#/report/transformIndex": 'transformIndex',

        "#/report/sourceAnalysis": 'sourceAnalysis',
        "#/report/orderAnalysis": 'orderAnalysis',

        //排行榜
        "#/report/rankingList": 'ProjectRankingList',

        //配置管理
        "#/project/projectManagement": 'projectManagement',
        "#/project/maintenanceManagement": 'MaintenanceManagement',
        "#/project/thresholdManagement": 'thresholdSet',
        "#/project/targetManagement": 'targetManagement',
        "#/project/drawingManagement": 'BlueprintManagement'
    };

    var firstMenuItem = "#/report/loading";

    //从菜单列表寻找第一个有效菜单
    $scope.findFirstMenuItem = function () {
        for (var i = 0; i < $state.menuList.length; i++) {
            var menuObj = $state.menuList[i];
            if (menuObj.childrens && menuObj.childrens.length > 0) {
                for (var j = 0; j < menuObj.childrens.length; j++) {
                    var childObj = menuObj.childrens[j];
                    if (childObj.resourceUri && childObj.resourceUri != "") {
                        firstMenuItem = childObj.resourceUri;
                        return;
                    }
                }
            }
        }
    };

    $scope.goFirstMenuItem = function () {
        //如果当前为loading，跳转到第一个有效菜单
        if ($state.current.name == "loading") {
            var stateName = "loading";
            if (menuItemMap[firstMenuItem]) {
                stateName = menuItemMap[firstMenuItem];
            }
            $state.go(stateName);
        }
    };


    $scope.goFirstMenuItemFromRefresh = function () {
        var stateName = "loading";
        if (menuItemMap[firstMenuItem]) {
            stateName = menuItemMap[firstMenuItem];
        }
        $state.go(stateName);
    };

    //请求配置参数
    $.ajax({
        url: 'api/appConfigs',
        async: false,
        data: {},
        type: 'get',
        success: function (data) {
            var dataObj = JSON.parse(data);
            //城市中心坐标点
            $state.city_center_point = dataObj.city_center_point;
            appConfig.city_center_point = dataObj.city_center_point;

            //按钮list，暂时不用
            $state.buttonList = dataObj.buttonList;
            //当前登录用户信息
            $state.user = dataObj.user;
            //暂时不用
            $state.has_tenant_app = dataObj.has_tenant_app;
            //菜单列表
            $state.menuList = dataObj.menuList;
            //配置信息
            $state.view_log = dataObj.view_log;
            //语言
            appConfig.language = dataObj.language;
            //凌志用，是否有全部门权限
            $state.group_sign = dataObj.group_sign;

            //当前登录用户可访问的app列表
            if (dataObj.authAppList && dataObj.authAppList.length > 0) {
                var appListNew = [];
                for (var i = 0; i < dataObj.authAppList.length; i++) {
                    var appUse = dataObj.authAppList[i];
                    if (appUse.appCode != 'tenant') {
                        appListNew.push(appUse);
                    }
                }
                appConfig.authAppList = appListNew;
                $scope.$$prevSibling.authAppList = appListNew;
                setTimeout(function () {
                    $scope.$$prevSibling.bindEvents();
                });
            } else {
                $scope.$$prevSibling.bindEvents();
            }

            //处理租户切换功能
            for (var i = 0; i < $state.menuList.length; i++) {
                var menuObj = $state.menuList[i];
                menuObj.extAttr2 = menuIconMap[menuObj.resourceName];
                if (menuObj.resourceName == "租户切换" && menuObj.childrens) {
                    var tenantIdMap = {};
                    var tenantNameMap = {};
                    for (var j = 0; j < menuObj.childrens.length; j++) {
                        var menuItem = menuObj.childrens[j];
                        tenantIdMap[menuItem.extAttr3] = menuItem.extAttr2;
                        tenantNameMap[menuItem.extAttr2] = menuItem.resourceName;
                    }
                    $state.tenantIdMap = tenantIdMap;
                    $state.tenantNameMap = tenantNameMap;
                }
            }

            //过滤和隐藏部分菜单
            $scope.findFirstMenuItem();

            $scope.goFirstMenuItem();

        },
        error: CommonService.errorCallback
    });

    //初始化数据
    $scope.menuList = $state.menuList;
    $scope.user = $state.user;
    $scope.hashTenant = $state.has_tenant_app;
    $scope.projectType = 1;

    $scope.curMenuUri = "";
    $scope.isMutilApp = false;

    $scope.mentItemClick = function (item) {
        if (item.resourceUri) {
            window.location.href = item.resourceUri;
            $state.tabType = "";
            $state.sensorType = "";
        }
    };

    $scope.logout = function () {
        $.ajax({
            url: 'api/logout2',
            data: {},
            type: 'get',
            success: function (data) {
                var dataObj = JSON.parse(data);
                // window.location.href = dataObj.casLogout + '?service=' + dataObj.casLogin + '?service=' + dataObj.appHome + '/j_spring_cas_security_check?spring-security-redirect=http://' + location.host + appConfig.baseUrl + '/index.html'
                window.location.href = dataObj.casLogout + '?service=http://' + location.host + appConfig.baseUrl + '/index.html'

            }
        });
    };

    $scope.mouseoverLogout = function () {
        $scope.userMgrActive = true;
    };

    $scope.mouseoutLogout = function (event) {
        $scope.userMgrActive = false;
    };

    //父子菜单url映射
    var urlMap = {
        "/project/projectDetail": "/project/projectManagement",
        "/project/sensors/detail": "/project/maintenanceManagement",
        "/project/StoreThresholdSetDetail": "/project/thresholdManagement",

    };
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //将子菜单映射到父菜单
        $scope.curMenuUri = '#' + toState.url;
        if (urlMap[toState.url]) {
            $scope.curMenuUri = '#' + urlMap[toState.url];
        }

        //高亮显示当前菜单，其他变暗
        if ($scope.menuList) {
            var md = '#' + toState.url;
            for (var i = 0; i < $scope.menuList.length; i++) {
                $scope.menuList[i].active = false;
                if (md == $scope.menuList[i].resourceUri) {
                    $scope.menuList[i].active = true;
                }
            }
        }
    });

    //点击logo，显示app选择栏
    $scope.toggleDirectBar = function (event) {
        var directBar = document.getElementById('con-left');
        var className = 'con-left-hide';
        if (directBar.classList.contains(className)) {
            directBar.classList.remove(className);
        } else {
            directBar.classList.add(className);
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    };

    //隐藏app选择栏
    $('body').on('click', function (event) {
        var directBar = document.getElementById('con-left');
        var className = 'con-left-hide';
        directBar.classList.remove(className);
        if (!directBar.classList.contains(className)) {
            directBar.classList.add(className);
        }
        // if (event.stopPropagation) {
        //     event.stopPropagation();
        // }
    });

});
