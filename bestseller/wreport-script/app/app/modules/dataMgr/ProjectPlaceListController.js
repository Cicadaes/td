'use strict';

angular.module('wreport.app').controller('ProjectPlaceListController', function ($scope, $state, $location, NgTableParams, CommonService, Upload) {
    $scope.constants = $state.constants;
    $scope.currentProjectId = $state.projectVM.projectId;

    $scope.onProjectClick = function () {
        $scope.search();
        $scope.initParams();
    };

    $scope.initParams = function () {

        $scope.deployTitle = $scope.constants.btn_projectPlace_sensor;
        $scope.deployType = 2;

        $scope.deployName = $scope.constants.table_sensor;

        if ($state.projectVM.projectType == 1) {
            $scope.deployTitle = $scope.constants.btn_projectPlace_room;
            $scope.deployType = 1;
            $scope.deployName = $scope.constants.label_store;
        }
    };

    $scope.initParams();

    //保存排序
    $scope.saveIndex = function () {
        var items = [];
        var ids = [];
        var orderNumbers = [];
        for (var i = 0; i < $scope.projectPlaces.length; i++) {
            var item = $scope.projectPlaces[i];
            if ((i + 1) != $scope.oldItemsMapObj[item.id]) {
                item.orderNumber = i + 1;//更新排序字段值
                items.push(item);
                ids.push(item.id + "," + item.orderNumber);
                orderNumbers.push(item.orderNumber);
            }
        }
        // 保存排序功能
        CommonService.create('SaveProjectPlaceOrder', ids).then(function (response) {
            $.Pop.alerts($scope.constants.prompt_success);
        });
    };

    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        filter: {
            'projectId': $scope.currentProjectId,
            "status": 1
        }
    }, {
        counts: [10, 20, 50],
        paginationMaxBlocks: 9,
        total: 0,
        getData: function ($defer, params) {
            var queryObj = CommonService.buildQueryParams(params);
            CommonService.request('ProjectPlaceList', queryObj).then(function (response) {

                $scope.oldItemsMapObj = {};
                angular.forEach(response.data, function (item) {
                    $scope.oldItemsMapObj[item.id] = item.orderNumber;
                    if (item.picUrl != null) {
                        var pic = item.picUrl.slice(26);
                        item.diagramName = pic
                    }

                }, this);
                // 拿数据

                $scope.projectPlaces = response.data;
                var totalStr = response.headers()['x-total-count'];
                var total = parseInt(totalStr);
                params.total(total);
                $defer.resolve($scope.projectPlaces);
            });
        }
    });

    $scope.import_file_pic = function (file, projectPlace) {
        $scope.f = file;
        if (file && !file.$error) {
            file.upload = Upload.upload({
                url: 'api/attachment',
                file: file,
                fields: {
                    type: "projectPlace"
                }
            });
            file.upload.then(function (response) {
                projectPlace.picUrl = response.data.filePath;
            }, function (response) {
                $.Pop.alerts($scope.constants.prompt_newImg);
            });
        }
    };

    $scope.newClick = function () {
        $scope.title = $scope.constants.label_create;
        $scope.f = {};
        $scope.projectPlace = {};
    };

    $scope.modifyClick = function (obj) {
        $scope.projectPlace = obj;
        $scope.title = $scope.constants.label_edit;
    };

    // 部探针
    $scope.probeDeploy = function (obj) {
        $scope.curPlace = obj;
        $scope.initDeploy($scope.curPlace);
    };

    $scope.createProjectPlace = function (projectPlace) {
        if (projectPlace.placeName == undefined) {
            $.Pop.alerts($scope.constants.prompt_place_promptNew);
            return;
        }

        var queryObj = {
            "projectId": $scope.currentProjectId,
            "placeName": projectPlace.placeName,
            "description": projectPlace.description,
            "picUrl": projectPlace.picUrl
        };

        // 创建场地接口调用
        CommonService.create('NewProjectPlace', queryObj).then(function (projectPlace) {
            $.Pop.alerts($scope.constants.prompt_success);
            $('#projectPlaceDialog').modal("hide");
            $scope.tableParams.reload();
        });
    };

    $scope.editProjectPlace = function (projectPlace) {
        if (projectPlace.placeName == undefined) {
            $.Pop.alerts($scope.constants.prompt_place_promptNew);
            return;
        }
        CommonService.update(projectPlace).then(function (projectPlace) {
            $scope.tableParams.reload();
        });
    };

    $scope.saveProjectPlace = function (projectPlace) {
        projectPlace = projectPlace || {};
        projectPlace.id === undefined ? $scope.createProjectPlace(projectPlace) : $scope.editProjectPlace(projectPlace);
    };

    // 删除场地前，要确认场地下没有房间。
    $scope.removeProjectPlace = function (projectPlace) {
        $.Pop.confirms($scope.constants.prompt_remove + projectPlace.placeName + ' ，' + $scope.constants.prompt_place_remove, function () {
            CommonService.remove(projectPlace).then(function (projectPlace) {
                $scope.tableParams.reload();
            });
        });
    };

    $scope.search = function () {
        $scope.tableParams.filter(
            {
                'q': $scope.searchValue,
                'projectId': $scope.currentProjectId,
                "status": 1
            }
        );
    };

    $scope.clickModal = function () {
        if (document.all) {
            window.event.cancelBubble = true;
        } else {
            event.stopPropagation();
        }
    };

    //================================
    $scope.resize = function () {
        var window = appConfig.thisWindow;
        var winHg = $(window).height();
        var winWd = $(window).width();

        var table_width = (winWd - 180);
        $scope.table_width_1 = {'width': table_width / 5 + 'px'};
        $scope.table_width_2 = {'width': table_width / 5 + 'px'};
        $scope.table_width_3 = {'width': table_width / 5 + 'px'};
        $scope.table_width_4 = {'width': table_width / 5 + 'px'};
        $scope.table_width_5 = {'width': table_width / 5 + 'px'};

        $scope.table_max_height = {'max-height': winHg - 330 + "px"};

        //-----------------------------------------------
        var diaHeight = winHg - 120;
        var diaWidth = winWd - 100;
        $scope.model_width = {'width': diaWidth + 'px'};
        $scope.model_height = {'height': (diaHeight - 85) + 'px'};
        $scope.list_height = {'height': (diaHeight - 278) + 'px'};
    };
    $scope.resize();
});

angular.module('wreport.app').directive('projectPlaceDialog', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/dialog/ProjectPlaceDialog.html',
    }
});
