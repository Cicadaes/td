'use strict';

angular.module('wreport.app').factory('CommonService', function (Restangular, CommonFunc, CommonUrl) {
    Restangular.setFullResponse(true);
    return {
        formatDateLocal: CommonFunc.formatDateLocal,
        getDateLength: CommonFunc.getDateLength,
        refreshAngular: CommonFunc.refreshAngular,
        sortByCol: CommonFunc.sortByCol,
        getDataByPage: CommonFunc.getDataByPage,
        getLastMonthDateLong: CommonFunc.getLastMonthDateLong,
        getDateWithoutToday: CommonFunc.getDateWithoutToday,

        buildQueryParams: function (params) {
            var queryObj = {
                _dc: new Date().getTime()
            };

            if (params.page() == 1 && params.count() == 1) {
                queryObj['pageEnabled'] = false;
            } else {
                queryObj['page'] = params.page();
                queryObj['rows'] = params.count();

            }

            angular.extend(queryObj, params.filter());
            if (params.sort != undefined)
                angular.extend(queryObj, params.sort);

            return queryObj;
        },

        request: function (serviceName, params) {
            var _this = this;
            var result;
            var service = CommonUrl.restServiceList[serviceName];
            if (service.method == 'getList') {
                result = Restangular.all(service.url).getList(params);
            } else if (service.method == 'getOne') {
                result = Restangular.one(service.url).get(params);
            } else if (service.method == 'getOneBy') {
                result = Restangular.one(service.url + params).get();
            } else if (service.method == 'getListUrlParam') {
                //拷贝url模板，防止改动模板，
                var tmpUrl = service.url;
                for (var key in params) {
                    if (!params.hasOwnProperty(key)) {
                        continue;
                    }
                    tmpUrl = tmpUrl.replace('{' + key + '}', params[key]);
                }
                result = Restangular.one(tmpUrl).get(params);
            } else if (service.method == 'edit') {
                // 编辑时获取数据
                var tmpUrl = service.url;
                //service.url = "api/projects/";
                for (var key2 in params) {
                    if (!params.hasOwnProperty(key2)) {
                        continue;
                    }
                    tmpUrl = service.url + params[key2];
                }
                result = Restangular.one(tmpUrl).get(params);
            }
            else if (service.method == 'editSensor') {
                // 编辑时获取数据
                service.url = "api/sensors/";
                for (var key3 in params) {
                    if (!params.hasOwnProperty(key3)) {
                        continue;
                    }
                    service.url = service.url + params[key3];
                }
                result = Restangular.one(service.url).get(params);
            }// 查看交叉分析
            else if (service.method == 'seeAna') {
                // 编辑时获取数据
                service.url = "api/crossAnalysiss/getResult/",
                service.url = service.url + params['crossAnalysisId'];
                var params1 = {
                    projectIds: params['projectIds']
                };
                result = Restangular.one(service.url).get(params1);
            } else if (service.method == 'especially') {
                // 获取单个探针的mac数和有效日志数
                // 探针信号强度设置查询左侧收到的mac列表
                service.url = service.url1 + params + service.url2;
                var params1 = {
                    sensorId: params
                };
                result = Restangular.one(service.url).get(params1);
            } else if (service.method == 'especially2') {
                // 获取测试报告
                var str = "";
                for (var key in params) {
                    str += params[key] + "/";
                }
                service.url = service.url1 + str + service.url2;
                result = Restangular.one(service.url).get(params);
            } else if (service.method == 'sensorHis') {
                // 查看探针历史编辑记录
                service.url = "api/sensors/history/" + params.sensorId;
                result = Restangular.one(service.url).get(params);
            } else if (service.method == 'mosaicId') {
                // 拼接id在最后
                var tmpUrl = service.url;
                tmpUrl = tmpUrl + params[service.mosaicId];
                result = Restangular.one(tmpUrl).get(params);
            }

            return {
                then: function (success, failure) {
                    if (!failure) {
                        failure = _this.errorCallback;
                    }
                    result.then(success, failure);
                }
            };
        },
        // 新建
        create: function (serviceName, params) {
            var _this = this;
            var result;
            var service = CommonUrl.restServiceList[serviceName];
            var base = Restangular.all(service.url);
            if (service.method == 'create') {
                result = base.post(params, {}, {'Content-Type': 'application/json'});
            } else if (service.method == 'createOrder') {
                // 真对场地部署  --  保存排序功能
                result = base.post(params);
            }

            return {
                then: function (success, failure) {
                    if (!failure) {
                        failure = _this.errorCallback;
                    }
                    result.then(success, failure);
                }
            };
        },
        // 适应特殊场景，自定义post
        updatePost: function (serviceName, params) {
            var _this = this;
            var result;
            var service = CommonUrl.restServiceList[serviceName];
            var base = Restangular.all(service.url);
            if (service.method == 'updatePost') {
                result = base.post(params, {}, {'Content-Type': 'application/json'});
            }

            return {
                then: function (success, failure) {
                    if (!failure) {
                        failure = _this.errorCallback;
                    }
                    result.then(success, failure);
                }
            };
        },
        // 编辑
        update: function (params) {
            var _this = this;
            var result = params.put();
            return {
                then: function (success, failure) {
                    if (!failure) {
                        failure = _this.errorCallback;
                    }
                    result.then(success, failure);
                }
            };
        },
        // 删除
        remove: function (params) {
            var _this = this;
            var result = params.remove();
            return {
                then: function (success, failure) {
                    if (!failure) {
                        failure = _this.errorCallback;
                    }
                    result.then(success, failure);
                }
            };
        },

        errorCallback: function (response) {
            if (response.status == 401) {
                if (CommonFunc.loginObj) {
                    var dataObj = CommonFunc.loginObj;
                    window.location.href = dataObj.casLogin + '?service=' + dataObj.appHome + '/j_spring_cas_security_check?spring-security-redirect=http://' + location.host + appConfig.baseUrl + '/index.html';
                    //console.log('====login from cache====')
                } else {
                    $.ajax({
                        url: 'api/parameters',
                        async: false,
                        data: {},
                        type: 'get',
                        success: function (data) {
                            var dataObj = JSON.parse(data);
                            if (dataObj.appHome == '') {
                                window.location.href = 'loginSaas.html';
                            } else {
                                CommonFunc.loginObj = dataObj;
                                window.location.href = dataObj.casLogin + '?service=' + dataObj.appHome + '/j_spring_cas_security_check?spring-security-redirect=http://' + location.host + appConfig.baseUrl + '/index.html';
                                //console.log('====login from ajax====')
                            }
                        }
                    });
                }
            } else if (response.status == 500) {
                if (response.data != null && response.data.message == 'error.internalServerError') {
                    $.Pop.alerts('服务器内部错误！请联系管理员.');
                } else {
                    $.Pop.alerts(response.data.message);
                }
            } else {
                var error = decodeURI(response.headers()['x-wreport-error']);
                $.Pop.alerts(error);
            }
        },
// ================================url配置================================

        //state 提供可变菜单范围
        variableMenuMap: {

            "operationOverview_store": "1",
            "operationOverview_city": "1",
            "operationOverview_region": "1",
            "operationOverview_brand": "1",

            "hourlyDynamics": "1",
            "spatialDynamics": "1",
            "thermodynamicChart": "1",

            "trendIndex": "1",
            "activeIndex": "1",
            "transformIndex": "1",

            "passengerPortrait": "1",
            "passengerJobsCome": "1",
            "passengerRegion": "1",

            "sourceAnalysis": "1",
            "orderAnalysis": "1"
        },

        configMenuMap: {
            "projectManagement": "1",
            "MaintenanceManagement": "1",
            "thresholdSet": "1",
            "targetManagements": "1",
            "BlueprintManagement": "1",

            "changeTenant_a": "1",
            "changeTenant_b": "1",
            "changeTenant_c": "1",
            "changeTenant_d": "1",
            "changeTenant_e": "1"
        },

        variableMenuMapUrl: {
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

            "#/project/passengerPortrait": "passengerPortrait",
            "#/project/passengerJobsCome": "passengerJobsCome",
            "#/project/passengerRegion": "passengerRegion",

            "#/report/sourceAnalysis": 'sourceAnalysis',
            "#/report/orderAnalysis": 'orderAnalysis'
        },

        //路径
        stateMap: {
            "projectTyep_1": "operationOverview_store",
            "projectTyep_11": "operationOverview_city",
            "projectTyep_5": "operationOverview_region",
            "projectTyep_6": "operationOverview_brand"
        },

        //路径
        stateMap2: {
            "projectTyep_1": "thermodynamicChart",
            "projectTyep_11": "spatialDynamics",
            "projectTyep_5": "spatialDynamics",
            "projectTyep_6": "spatialDynamics"
        },

        filterMenu: function (menuList, stateName, projectType, isRefresh) {
            if (!isRefresh && this.configMenuMap[stateName]) {
                return;
            }

            var that = this;
            if (!this.variableMenuMap[stateName]) {
                //隐藏明细菜单
                angular.forEach(menuList, function (item) {
                    if (item.resourceName == "仪表盘" || item.resourceName == "配置管理" || item.resourceName == "租户切换") {
                        item.menu_show = "show";
                        angular.forEach(item.childrens, function (item2) {
                            item2.menu_show = "show";
                        });
                    } else {
                        item.menu_show = "hide";
                        angular.forEach(item.childrens, function (item2) {
                            item2.menu_show = "hide";
                        });
                    }
                });
            } else {
                //显示全部菜单
                angular.forEach(menuList, function (item) {
                    if (item.resourceName == "运营概览") {
                        item.menu_show = "show";
                        angular.forEach(item.childrens, function (item2) {
                            if ("#/report/" + that.stateMap["projectTyep_" + projectType] == item2.resourceUri) {
                                item2.menu_show = "show";
                            } else {
                                item2.menu_show = "hide";
                            }
                        });
                    } else if (item.resourceName == "客流动态") {
                        item.menu_show = "show";
                        angular.forEach(item.childrens, function (item2) {
                            if ("#/report/" + that.stateMap2["projectTyep_" + projectType] == item2.resourceUri) {
                                item2.menu_show = "show";
                            } else if ("#/report/hourlyDynamics" == item2.resourceUri) {
                                item2.menu_show = "show";
                            } else {
                                item2.menu_show = "hide";
                            }
                        });
                    } else {
                        item.menu_show = "show";
                        angular.forEach(item.childrens, function (item2) {
                            item2.menu_show = "show";
                        });
                    }
                });
            }

            return menuList;
        }
    };
});
