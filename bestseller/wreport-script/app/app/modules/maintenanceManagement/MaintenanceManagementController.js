'use strict';

angular.module('wreport.app').controller('MaintenanceManagementController', function ($scope, $state, $location, NgTableParams, CommonService, Upload) {
    $scope.constants = $state.constants;

    if ($state.sensorType == "2") {
        $scope.tabType = '2';
    } else {
        $scope.tabType = '1';
    }



    $scope.changeTabType = function (type) {
        $scope.tabType = type;
    };


    // 初始化预警设置的变量
    $scope.warningSettingInit = function(){
        $scope.healthyFlag = false;
        $scope.nologsFlag = false;
        $scope.onenologsFlag = false;
        $scope.administratorsFlag = false;
        $scope.storePersonFlag = false;
        $scope.emailFlag = false;
        $scope.healthy = "";
        $scope.onenologs = "";
        $scope.nologs = "";
    };
    $scope.warningSettingInit();

    $scope.creatFlag = false;  // 判断预警设置是新建还是更新

    // 获取预警设置
    $scope.getWarningSetting = function () {
        CommonService.request('GetWarningSetting', {}).then(function (response) {

            if (response.data == undefined) {
                $scope.creatFlag = true;
            }else {
                $scope.creatFlag = false;
                $scope.WarningSetObj = response.data;
                if ($scope.WarningSetObj.healthRate != null) {
                    $scope.healthyFlag = "healthy";
                    $scope.healthy = $scope.WarningSetObj.healthRate;
                }

                if ($scope.WarningSetObj.sensorsNolog != null) {
                    $scope.nologsFlag = "nologs";
                    $scope.nologs = $scope.WarningSetObj.sensorsNolog;
                }

                if ($scope.WarningSetObj.sensorNolog != null) {
                    $scope.onenologsFlag = "onenologs";
                    $scope.onenologs = $scope.WarningSetObj.sensorNolog;
                }

                if ($scope.WarningSetObj.sendMail == 1) {
                    $scope.emailFlag = "email";
                }

                if ($scope.WarningSetObj.sendTenantAdmin == 1) {
                    $scope.administratorsFlag = "administrators";
                }

                if ($scope.WarningSetObj.sendPrincipal == 1) {
                    $scope.storePersonFlag = "storePerson";
                }
            }
        })
    };
    $scope.getWarningSetting();


    // 接受人多选
    $scope.checkChannel = function (event, type) {
        if ($(event.target).hasClass("simulationCheck_check")) {
            if (type == "administrators") {
                $scope.administratorsFlag = false;
            } else if (type == "storePerson") {
                $scope.storePersonFlag = false;
            } else if (type == "email") {
                $scope.emailFlag = false;
            }
        } else {
            if (type == "administrators") {
                $scope.administratorsFlag = "administrators";
            } else if (type == "storePerson") {
                $scope.storePersonFlag = "storePerson";
            } else if (type == "email") {
                $scope.emailFlag = "email";
            }
        }
    };

    // 预警阈值多选
    $scope.checkThreshold = function (event, type) {
        if ($(event.target).hasClass("simulationCheck_check")) {
            if (type == "healthy") {
                $scope.healthyFlag = false;
                $scope.healthy = "";
            } else if (type == "nologs") {
                $scope.nologsFlag = false;
                $scope.nologs = "";
            } else if (type == "onenologs") {
                $scope.onenologsFlag = false;
                $scope.onenologs = "";
            }
        } else {
            if (type == "healthy") {
                $scope.healthyFlag = "healthy";
            } else if (type == "nologs") {
                $scope.nologsFlag = "nologs";
            } else if (type == "onenologs") {
                $scope.onenologsFlag = "onenologs";
            }
        }
    };

    // 关闭弹框
    $scope.closeModel = function () {
        if($scope.creatFlag == true){
            $scope.warningSettingInit();
        }
        $('#warningSettingDialog').modal("hide");
    };



    // 保存预警设置
    $scope.saveWarningSettingResult = function () {

        if($scope.creatFlag == true)
        {
            var queryObj = {};
            queryObj.sendTenantAdmin = null;
            queryObj.sendPrincipal = null;
            queryObj.sendSms = null;
            queryObj.sendMail = null;

            // var queryObj =  $scope.checkVariable(obj);
            if ($scope.administratorsFlag != "administrators" && $scope.storePersonFlag != "storePerson") {
                $.Pop.alerts($scope.constants.prompt_warning_setting_recipient);
                return;
            }

            if ($scope.healthyFlag != "healthy" && $scope.nologsFlag != "nologs" && $scope.onenologsFlag != "onenologs") {
                $.Pop.alerts($scope.constants.prompt_warning_setting_threshold);
                return;
            }

            if ($scope.healthyFlag == "healthy") {
                if ($scope.healthy == "" || $scope.healthy == undefined) {
                    $.Pop.alerts($scope.constants.prompt_warning_setting_threshold_health);
                    return;
                } else {
                    queryObj.healthRate = $scope.healthy;
                }
            } else {
                queryObj.healthRate = null;
            }

            if ($scope.nologsFlag == "nologs") {
                if ($scope.nologs == "" || $scope.nologs == undefined) {
                    $.Pop.alerts($scope.constants.prompt_warning_setting_threshold_nologes);
                    return;
                } else {
                    queryObj.sensorsNolog = $scope.nologs;
                }
            } else {
                queryObj.sensorsNolog = null;
            }

            if ($scope.onenologsFlag == "onenologs") {
                if ($scope.onenologs == "" || $scope.onenologs == undefined) {
                    $.Pop.alerts($scope.constants.prompt_warning_setting_threshold_onenologes);
                    return;
                } else {
                    queryObj.sensorNolog = $scope.onenologs;
                }
            } else {
                queryObj.sensorNolog = null;
            }

            if ($scope.emailFlag == "email") {
                queryObj.sendMail = 1;
            } else if ($scope.emailFlag != "email") {
                $.Pop.alerts($scope.constants.prompt_warning_setting_channel);
                return;
            }

            if ($scope.administratorsFlag == "administrators") {
                queryObj.sendTenantAdmin = 1;
            } else if ($scope.storePersonFlag == "storePerson") {
                queryObj.sendPrincipal = 1;
            }

            CommonService.create("CreateWarningSetting",queryObj).then(function (response) {
                $scope.getWarningSetting();
                $('#warningSettingDialog').modal("hide");
            });


        }else {
            var queryObj = $scope.WarningSetObj;
            if ($scope.administratorsFlag != "administrators" && $scope.storePersonFlag != "storePerson") {
                $.Pop.alerts($scope.constants.prompt_warning_setting_recipient);
                return;
            }

            if ($scope.healthyFlag != "healthy" && $scope.nologsFlag != "nologs" && $scope.onenologsFlag != "onenologs") {
                $.Pop.alerts($scope.constants.prompt_warning_setting_threshold);
                return;
            }

            if ($scope.healthyFlag == "healthy") {
                if ($scope.healthy == "" || $scope.healthy == undefined) {
                    $.Pop.alerts($scope.constants.prompt_warning_setting_threshold_health);
                    return;
                } else {
                    queryObj.healthRate = $scope.healthy;
                }
            } else {
                queryObj.healthRate = null;
            }

            if ($scope.nologsFlag == "nologs") {
                if ($scope.nologs == "" || $scope.nologs == undefined) {
                    $.Pop.alerts($scope.constants.prompt_warning_setting_threshold_nologes);
                    return;
                } else {
                    queryObj.sensorsNolog = $scope.nologs;
                }
            } else {
                queryObj.sensorsNolog = null;
            }

            if ($scope.onenologsFlag == "onenologs") {
                if ($scope.onenologs == "" || $scope.onenologs == undefined) {
                    $.Pop.alerts($scope.constants.prompt_warning_setting_threshold_onenologes);
                    return;
                } else {
                    queryObj.sensorNolog = $scope.onenologs;
                }
            } else {
                queryObj.sensorNolog = null;
            }

            if ($scope.emailFlag == "email") {
                queryObj.sendMail = 1;
            } else if ($scope.emailFlag != "email") {
                $.Pop.alerts($scope.constants.prompt_warning_setting_channel);
                return;
            }

            if ($scope.administratorsFlag == "administrators") {
                queryObj.sendTenantAdmin = 1;
            } else if ($scope.storePersonFlag == "storePerson") {
                queryObj.sendPrincipal = 1;
            }

            //var queryObj =  $scope.checkVariable(obj);
            CommonService.update(queryObj).then(function (response) {
                $scope.getWarningSetting();
                $('#warningSettingDialog').modal("hide");
            });
        }
    };

    //================================
    $scope.resize = function () {
        var window = appConfig.thisWindow;
        var winHg = $(window).height();
        $scope.table_max_height = {'max-height': winHg - 330 + "px"};
    };
    $scope.resize();
});

angular.module('wreport.app').directive('warningSettingDialog', function () {
    return {
        restrict: 'A',
        replace: true,
        controller: function ($scope, $state, $location, CommonService) {
        },
        templateUrl: 'app/dialog/WarningSettingDetailDialog.html',
        link: function (scope, element, attrs) {
        }
    }
});
