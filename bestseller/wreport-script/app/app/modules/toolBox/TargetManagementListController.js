'use strict';

angular.module('wreport.app').controller('TargetManagementListController', function ($scope, $state, $location, NgTableParams, CommonService, Upload) {
    $scope.constants = $state.constants;

    $scope.onProjectClick = function () {
        $scope.listTypeDefer = "1";
        $scope.listType = "1";
        $scope.tableParams.filter({
        });
    };

    $scope.targetList_1 = [];
    $scope.targetList_2 = [];
    $scope.targetList_3 = [];
    $scope.targetList_4 = [];

    $scope.targetMap = {};
    $scope.targetValueTypeMap = {};
    $scope.targetValueTypeNameMap = {
        count: $scope.constants.company_person,
        min: $scope.constants.field_batchset_time_company_min,
        per: '%',
    };

    var queryObj = {
        pageEnabled: false,
        status: 1,
    };

    $.layerLoading.show();
    CommonService.request('targets', queryObj).then(function (response) {
        $scope.targetList_1 = [
            {id: 101, name: $scope.constants.mapper_target_list1_one}
        ];
        $scope.targetList_4 = [
            {id: 102, name: $scope.constants.mapper_target_list_one},
            {id: 103, name: $scope.constants.mapper_target_list_two},
            {id: 104, name: $scope.constants.mapper_target_list_three},
            {id: 105, name: $scope.constants.mapper_target_list_four},
            {id: 106, name: $scope.constants.mapper_target_list_five},
            {id: 107, name: $scope.constants.mapper_target_list_six}
        ];

        for (var i = 0; i < response.data.length; i++) {
            var target = response.data[i];
            if (target.type == '1') {
                $scope.targetList_1.push(target);
            } else if (target.type == '2') {
                if (target.name == "到访客流") {
                    target.name = $scope.constants.mapper_targetNew_list_type2_vistingCustomer;
                    $scope.targetList_2.push(target);
                }
                if (target.name == "新客数量") {
                    target.name = $scope.constants.mapper_targetNew_list_type2_newCustomer;
                    $scope.targetList_2.push(target);
                }
                if (target.name == "老客数量") {
                    target.name = $scope.constants.mapper_targetNew_list_type2_returnCustomer;
                    $scope.targetList_2.push(target);
                }
                if (target.name == "停留客流") {
                    target.name = $scope.constants.mapper_targetNew_list_type2_stayingCustomer;
                    $scope.targetList_2.push(target);
                }
                //$scope.targetList_2.push(target);
                // $scope.targetList_2.push(target);
            } else if (target.type == '3') {
                /*if (target.name != "进店率") {
                 $scope.targetList_3.push(target);
                 }*/
                if (target.name == "人均停留时长") {
                    target.name = $scope.constants.mapper_targetNew_list_type3_lenghtOf;
                    $scope.targetList_3.push(target);
                }
                if (target.name == "停留率") {
                    target.name = $scope.constants.mapper_targetNew_list_type3_stayRate;
                    $scope.targetList_3.push(target);
                }

            } else if (target.type == '4') {
                $scope.targetList_4.push(target);
            }

            $scope.targetMap[target.id] = target.name;
            $scope.targetValueTypeMap[target.id] = target.valueType;
        }
        CommonService.refreshAngular($scope);

        $.layerLoading.hide();

    });

    var date = new Date();
    $scope.dateInForm = {
        tagDataTimeStart: date.getTime() - 86400000 * 6,
        tagDataTimeEnd: date.getTime()
    }

    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        filter: {
        }
    }, {
        counts: [10, 20, 50],
        paginationMaxBlocks: 9,
        total: 0,
        getData: function ($defer, params) {
            var queryObj = CommonService.buildQueryParams(params);
            CommonService.request('QueryTargetManagementList', queryObj).then(function (response) {
                angular.forEach(response.data, function (item, index) {
                    if ($scope.targetValueTypeMap[item.targetId] == 'count') {
                        if (item.targetValue > 10000) {
                            //item.targetValueChange = item.targetValue / 10000;
                            item.targetValueChange = item.targetValue;
                            item.targetSuffix = $scope.constants.company_tenthousand + $scope.constants.company_person;
                        } else {
                            item.targetValueChange = item.targetValue;
                            item.targetSuffix = $scope.constants.company_person;
                        }
                        //item.targetValueEdit = item.targetValue / 10000;
                        item.targetValueEdit = item.targetValue;
                        if (item.currentValue > 10000) {
                            // item.currentValueChange = item.currentValue / 10000;
                            item.currentValueChange = item.currentValue;
                            item.currentSuffix = $scope.constants.company_tenthousand + $scope.constants.company_person;
                        } else {
                            item.currentValueChange = item.currentValue;
                            item.currentSuffix = $scope.constants.company_person;
                            ;
                        }
                    } else {
                        item.targetValueEdit = item.targetValue;
                        item.targetValueChange = item.targetValue;
                        item.currentValueChange = item.currentValue;
                        item.targetSuffix = $scope.targetValueTypeNameMap[$scope.targetValueTypeMap[item.targetId]];
                        item.currentSuffix = $scope.targetValueTypeNameMap[$scope.targetValueTypeMap[item.targetId]];
                    }
                });
                var total = response.headers()['x-total-count'];
                params.total(total);
                $defer.resolve(response.data);
                $scope.listTypeDefer = $scope.listType;
            });
        }
    });

    CommonService.refreshAngular($scope);

    $scope._regExp = function (val) {
        var reg = /^\d+(\.\d+)?$/;
        if (Number(val)) {
            return reg.test(val);
        } else {
            if ("" != val) {
                return false;
            } else {
                return true;
            }
        }
    };

    $scope.createTargetManagement = function (targetManagement) {

        if (targetManagement.pageIndex) {
            targetManagement.pageIndex = 0;
        } else {
            targetManagement.pageIndex = -1;
        }

        CommonService.create('CreatetargetManagement', targetManagement).then(function (targetManagement) {
            $.layerLoading.hide();
            $scope.tableParams.reload();
        });
    };

    $scope.editTargetManagement = function (targetManagement) {

        var a = parseInt(targetManagement.pageIndex)
        if (isNaN(a)) {
            targetManagement.pageIndex = 0;
        } else {
            targetManagement.pageIndex = targetManagement.pageIndex;
        }
        //console.log(targetManagement.pageIndex)
        CommonService.update(targetManagement).then(function (targetManagement) {
            $.layerLoading.hide();
            $scope.tableParams.reload();
        });
    };

    $scope.saveTargetManagement = function (targetManagement) {
        targetManagement = targetManagement || {};

        //处理日期参数
        var startDateLong = $scope.dateInForm.tagDataTimeStart;
        var endDateLong = $scope.dateInForm.tagDataTimeEnd;
        var startDateVal = new Date(startDateLong).Format('yyyy-MM-dd');
        var endDateVal = new Date(endDateLong).Format('yyyy-MM-dd');
        targetManagement.startDate = startDateVal;
        targetManagement.endDate = endDateVal;

        if ($scope.targetId) {
            targetManagement.targetId = $scope.targetId;
        }

        if (targetManagement.targetName == undefined || targetManagement.publisher == undefined
            || targetManagement.targetId == undefined || targetManagement.targetValueEdit == undefined) {
            $.Pop.alerts($scope.constants.prompt_projectNew);
            return;
        }
        if (targetManagement.targetValueEdit != undefined && !$scope._regExp(targetManagement.targetValueEdit)) {
            $.Pop.alerts($scope.constants.prompt_targetValueEdit);
            return;
        }

        if ($scope.targetValueTypeMap[targetManagement.targetId] == 'count') {
            //targetManagement.targetValue = targetManagement.targetValueEdit * 10000;
            targetManagement.targetValue = targetManagement.targetValueEdit;
        } else {
            targetManagement.targetValue = targetManagement.targetValueEdit;
        }

        targetManagement.duration = (endDateLong - startDateLong) / 86400000 + 1;

        targetManagement.isRecurring = $scope.isRecurring;

        targetManagement.id === undefined ? $scope.createTargetManagement(targetManagement) : $scope.editTargetManagement(targetManagement);
    };

    $scope.removeTargetManagement = function (targetManagement) {
        $.Pop.confirms($scope.constants.prompt_remove + ':' + targetManagement.targetName + '？', function () {
            CommonService.remove(targetManagement).then(function (targetManagement) {
                $scope.tableParams.reload();
            });
        });
    };

    $scope.stopTargetManagement = function (targetManagement) {
        $.Pop.confirms($scope.constants.prompt_stop + '？', function () {
            CommonService.create('CreateHisTargetManagementsStop', targetManagement).then(function (response) {
                $scope.tableParams.reload();
            });
        });
    };

    $scope.search = function () {
        $scope.tableParams.filter({
            'q': $scope.searchValue,
            'listType': $scope.listType
        });
    };

    $scope.clickModal = function () {
        if (document.all) {
            window.event.cancelBubble = true;
        } else {
            event.stopPropagation();
        }
    }

    $scope.listType = 1;
    $scope.listTypeDefer = $scope.listType;
    //列表tab页标签
    $scope.changeRadio = function (type) {
        $scope.listType = type;

        $scope.tableParams.filter({
            'listType': $scope.listType
        });
    }

    $scope.choosePanelShow = false;
    //弹出选择框
    $scope.chooseTargetType = function (targetManagement) {
        $scope.choosePanelShow = true;
        var targetId = targetManagement.targetId;
        $("input[name='targetManagement_targetId'][value=" + targetId + "]").attr("checked", true);
    }

    //确定按钮
    $scope.selectTargetType = function () {
        $scope.choosePanelShow = false;
        //指标类型输入框显示中文
        var val = $('input[name="targetManagement_targetId"]:checked ').val();
        $('*[name="targetId"]').val($scope.targetMap[val]);

        //赋值当前指标id和指标单位
        $scope.targetId = val;
        $scope.targetValueType = $scope.targetValueTypeMap[val];
    }

    //取消按钮
    $scope.cancelTargetType = function () {
        $scope.choosePanelShow = false;
    }

    //新建按钮
    $scope.createClick = function () {
        $scope.title = $scope.constants.label_create;
        $scope.targetManagement = {};
        $scope.choosePanelShow = false;
        $("#t_target_form_targetId").val("");
        setTimeout(function () {
            $scope.targetValueType = '';
            $scope.isRecurring = 0;
            var date = new Date();
            $scope.dateInForm.tagDataTimeStart = date.getTime() - 86400000 * 6;
            $scope.dateInForm.tagDataTimeEnd = date.getTime();
            CommonService.refreshAngular($scope);
        }, 100);
    }

    //格式化日期
    $scope.formatTimeColumn = function (timestamp) {
        var result = '';
        if (typeof timestamp == 'string') {
            result = timestamp.substring(0, 10);
        } else if (typeof timestamp == 'number') {
            result = new Date(timestamp).Format('yyyy-MM-dd');
        }
        return result;
    }

    //列表编辑按钮
    $scope.editClick = function (targetManagement) {
        $scope.targetManagement = targetManagement;
        $scope.title = $scope.constants.label_edit;
        var targetId = targetManagement.targetId;
        $scope.isRecurring = targetManagement.isRecurring;
        function getDate(strDate) {
            var date = strDate.replace(/-/g, '/');
            var dateLong = new Date(date).getTime();

            return dateLong;
        }

        $scope.dateInForm.tagDataTimeStart = getDate(targetManagement.startDate);
        $scope.dateInForm.tagDataTimeEnd = getDate(targetManagement.endDate);
        setTimeout(function () {
            $('*[name="targetId"]').val($scope.targetMap[targetId]);
            $scope.targetValueType = $scope.targetValueTypeMap[targetId];

            var durationDom;
            if (targetManagement.isRecurring) {
                durationDom = $("input[name='targetManagement_duration'][value=" + targetManagement.duration + "]");
                durationDom[0].checked = true;
            } else {
                durationDom = $("input[name='targetManagement_duration'][value=0]");
                durationDom[0].checked = true;
            }

            CommonService.refreshAngular($scope);
        }, 100);
    }

    $scope.changeDuration = function (duration, targetManagement) {
        var today = new Date();
        $scope.dateInForm.tagDataTimeStart = today.getTime();
        if (duration == 0) {
            $scope.dateInForm.tagDataTimeEnd = today.getTime();
            $scope.isRecurring = 0;
        } else {
            $scope.dateInForm.tagDataTimeEnd = today.getTime() + 86400000 * (duration - 1);
            $scope.isRecurring = 1;
        }
    }

    $scope.bodyClick = function (event) {
        if (event.target.name != 'targetId' && $scope.choosePanelShow) {
            $scope.choosePanelShow = false;
        }
    };

    $scope.isRecurring = 0;
    $scope.changeTagDataTime = function (start, end) {
        var durationDom = $("input[name='targetManagement_duration'][value=0]");
        durationDom[0].checked = true;
        $scope.isRecurring = 0;

        $scope.dateInForm.tagDataTimeStart = start;
        $scope.dateInForm.tagDataTimeEnd = end;
    }

    // 数据导出
    $scope.exportReport_TargetManagement = function () {

        var queryObj = {
            exportType: "TargetManagement"
        };
        CommonService.request('export2excel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };
    //================================
    $scope.resize = function () {
        var window = appConfig.thisWindow;
        var winHg = $(window).height();
        var winWd = $(window).width();

        var table_width = (winWd - 180);
        $scope.table_width_1 = {'width': table_width / 8 + 'px'};
        $scope.table_width_2 = {'width': table_width / 8 + 'px'};
        $scope.table_width_3 = {'width': table_width / 8 + 'px'};
        $scope.table_width_4 = {'width': table_width / 8 + 'px'};
        $scope.table_width_5 = {'width': table_width / 8 + 'px'};
        $scope.table_width_6 = {'width': table_width / 8 + 'px'};
        $scope.table_width_7 = {'width': table_width / 8 + 'px'};
        $scope.table_width_8 = {'width': table_width / 8 + 'px'};

        $scope.table_max_height = {'max-height': winHg - 330 + "px"};

    };
    $scope.resize();
});

angular.module('wreport.app').directive('targetManagementDialog', function () {
    return {
        restrict: 'A',
        replace: true,
        controller: function ($scope, $state, $location, CommonService) {
        },
        templateUrl: 'app/dialog/TargetManagementDialog.html',
        link: function (scope, element, attrs) {
        }
    }
});
