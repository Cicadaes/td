'use strict';

angular.module('wreport.app').controller('SensorManageController', function ($scope, $state, $location, CommonService, NgTableParams,ChartService,Upload) {


    $scope.sensorsearchvalue = "";
    $scope.userMacListFlag = false;
    $scope.userMacList = []; // 探针mac下拉列表
    $scope.new_old_flag = false;

    // 探针状态
    $scope.sensorStatus = [
        {key: $scope.constants.mapper_batch_set_all, value: ""},
        {key: $scope.constants.mapper_batch_sensor_manage_normal, value: 1},
        {key: $scope.constants.mapper_batch_sensor_manage_notnormal, value: 0},
        {key: $scope.constants.mapper_batch_sensor_manage_stop, value: 2}
    ];
    // 探针类型
    $scope.sensorType = [
        {key: $scope.constants.mapper_batch_set_all, value: ""},
        {key: $scope.constants.mapper_sensor_manager_wify, value: 1},
        {key: $scope.constants.mapper_sensor_manager_3g, value: 2}
    ];
    //新建探针 探针类型
    $scope.sensorTypes = [
        {key: $scope.constants.mapper_sensor_manager_wify, value: 1},
        {key: $scope.constants.mapper_sensor_manager_3g, value: 2}
    ];
    // 探针型号
    $scope.sensorModel = [
        {key: "GL234", value: 1},
        {key: "GL222", value: 2},
        {key: "GL456", value: 3}
    ];

    $scope.getProjectShop = function () {
        var queryobj = {
            status: 1,
            projectType: 1,
            pageEnabled: false
        };
        // 获取所有门店
        CommonService.request('GetProjectManagementList', queryobj).then(function (response) {
            $scope.projectShopList = response.data;
        });
    };

    $scope.getProjectShop();

    $scope.initUserMacList = function(mac){
        var queryObj = {
            q: mac
        };
        CommonService.request('GetUserMacList', queryObj).then(function (response) {
            $scope.userMacList = response.data;
        });
    };



    // 回车搜索
    $scope.myKeyupsensor = function(e){
        var keycode = window.event?e.keyCode:e.which;
        $scope.sensorsearchvalue = $("#searchSensor").val();
        if(keycode==13){
            $scope.tableParams.filter({"q": encodeURI($scope.sensorsearchvalue)})
        }
        if($scope.sensorsearchvalue==""){
            $scope.tableParams.filter({"q":encodeURI($scope.sensorsearchvalue)})
        }
    };

    // 查看探针详情
    $scope.seeSensorDetail = function(sensor){
        $state.sensorId = sensor.id;
        $state.sensor = sensor;
        $state.sensorType == "2"
        localStorage.setItem("sensor",JSON.stringify($state.sensor));
        $state.go("sensor_detial");
    };

    // 探针信号强度设置
    $scope.sensorStrengthSet = function(sensor){
        $state.sensorId = sensor.id;
        $state.sensor = sensor;
        $state.sensorType == "2";
        localStorage.setItem("sensor",JSON.stringify($state.sensor));
        $state.go("sensor_strength_set");
    };


    // 获取已经向collector发数的mac列表
    $scope.getMacList = function(event){
        event.stopPropagation();
        $scope.userMacListFlag = !$scope.userMacListFlag;
    };


    // 在下拉列表选择一个mac后自动填写上
    $scope.checkOne = function(one){
        var arr = one.split(":");
        $scope.sensor.mac1 = arr[0];
        $scope.sensor.mac2 = arr[1];
        $scope.sensor.mac3 = arr[2];
        $scope.sensor.mac4 = arr[3];
        $scope.sensor.mac5 = arr[4];
        $scope.sensor.mac6 = arr[5];
        $scope.userMacListFlag = false;
    };


    // 过滤功能
    $scope.filterMac = function(sensor){
        var a = sensor.mac1 + ":" + sensor.mac2 + ":" + sensor.mac3 + ":" + sensor.mac4 + ":" + sensor.mac5 + ":" + sensor.mac6;
        if(sensor.mac1 == "" && sensor.mac2 == "" &&  sensor.mac3 == "" && sensor.mac4 == ""  && sensor.mac5 == ""  && sensor.mac6 == "" )
        {
            a = "";
        }
        $scope.initUserMacList(a);
    };

    // 下载表格
    $scope.exportReport_Sensor = function () {
        $scope.sensorsearchvalue = $("#searchSensor").val();
        var queryObj = {
            q: $scope.sensorsearchvalue,
            exportType: "SensorList",
            projectId: $scope.currentProjectId
        };

        CommonService.request('download2excel', queryObj).then(function (response) {
            document.location.href = "api/exports/getExportExcel/" + response.data.attachId;
        });
    };


    $scope.sensorselect = "";
    $scope.sensortype = "";
    $scope.flag = false;
    $scope.sensorTypeList = [
        {key: $scope.constants.mapper_batch_set_all, value: ""},
        {key: $scope.constants.mapper_batch_sensor_manage_normal, value: 1},
        {key: $scope.constants.mapper_batch_sensor_manage_notnormal, value: 0},
        {key: $scope.constants.mapper_batch_sensor_manage_stop, value: 2}
    ];

    // 按照3小时日志数排序
    $scope.hours_sort = function(type){
        if(type != $scope.sensortype){
            $scope.flag = false;
            $scope.sensortype = type;
        }
        $scope.flag = !$scope.flag;
        if($scope.flag == true)
        {
            $scope.sensorselect = "hoursup";
            $scope.sensorSort("logHours",'desc');
        }else {
            $scope.sensorselect = "hoursdown";
            $scope.sensorSort("logHours",'asc');
        }
    };

    // 按照无日志时长排序
    $scope.nolog_sort = function(type){
        if(type != $scope.sensortype){
            $scope.flag = false;
            $scope.sensortype = type;
        }
        $scope.flag = !$scope.flag;
        if($scope.flag == true)
        {
            $scope.sensorselect = "logsup";
            $scope.sensorSort("noLogDuration",'desc');
        }else {
            $scope.sensorselect = "logsdown";
            $scope.sensorSort("noLogDuration",'asc');
        }
    };

    // 排序功能模拟
    $scope.sensorSort = function(name,type){

        if(name == 'createTime')
        {
            $scope.params.$params['sorting'] = {"createTime":type};
        }else if(name == 'logHours'){
            $scope.params.$params['sorting'] = {"logHours":type};
        }else if(name == 'noLogDuration'){
            $scope.params.$params['sorting'] = {"noLogDuration":type};
        }
    };

    // 按照类型过滤
    $scope.sensorstrengthSelect = function(value){
        $scope.params.$params['sorting'] = {};
        $scope.sensortype = "";
        $scope.sensorselect = "";
        $("#sensortype").blur();
        $("#sensorstrength").blur();
        if(value == "全部" || value == "All")
        {
            value = "";
        }
        $scope.tableParams.filter({"sensorTypes":value,"q":encodeURI($scope.sensorsearchvalue)})
    };

    // 按照状态过滤
    $scope.sensortypeSelect = function(value){
        $scope.params.$params['sorting'] = {};
        $scope.sensortype = "";
        $scope.sensorselect = "";
        $("#sensortype").blur();
        $("#sensorstrength").blur();
        $scope.tableParams.filter({"normal":value,"q":encodeURI($scope.sensorsearchvalue)})
    };


    $scope.initProjectPlaceList = function () {
        // 查询高级搜索所在场地下拉列表
        var queryObj = {
            "projectId": $scope.currentProjectId,
            "pageEnabled": false
        };
        CommonService.request('ProjectPlaceList', queryObj).then(function (response) {
            $scope.projectPlaceList = response.data;
        });
    };

    $scope.sensors = {};

    $scope.sensorListCallback = function (sensors) {
        $scope.sensors = sensors;
    };

    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        sort: {
            name: 'asc'
        },
        filter: {
            "q": encodeURI($scope.sensorsearchvalue)
        }
    }, {
        counts: [10, 20, 50],
        paginationMaxBlocks: 9,
        total: 0,
        getData: function ($defer, params) {
            // 排序功能前端代码
            var sort = params.sorting();
            var page = params.url();
            params.paging = {offset: (page.page - 1) * page.count, limit: page.count};
            for (var p in sort) {
                if (sort.hasOwnProperty(p)) {
                    params.sort = {sort: p, order: sort[p]};
                }
            }
            $scope.params = params;
            $scope.defer = $defer;
            var queryObj = CommonService.buildQueryParams(params);
            CommonService.request('GetProjectSensorList', queryObj).then(function (response) {
                $scope.sensorListCallback(response.data);
                var total = response.headers()['x-total-count'];
                $scope.sensorTotal = total;
                params.total(total);
                $defer.resolve(response.data);
            });
            $("#sensortype").focus(function (e) {
                e.stopPropagation();
                $("#sensortype_").css("display", "block");
            });
            $("#sensortype").blur(function (e) {
                e.stopPropagation();
                $("#sensortype_").css("display", "none");
            })
            $("#sensorstrength").focus(function (e) {
                e.stopPropagation();
                $("#sensorstrength_").css("display", "block");
            });
            $("#sensorstrength").blur(function (e) {
                e.stopPropagation();
                $("#sensorstrength_").css("display", "none");
            })
        }
    });

    $scope.initProjectPlaceList();

    $scope.import_file_sensors = function (file) {
        $scope.f = file;

        if (file && !file.$error) {
            file.upload = Upload.upload({
                url: 'api/sensors/batchImport',
                fields: {
                    "projectId": $scope.currentProjectId
                },
                file: file
            });

            file.upload.then(function (response) {
                if (response.data != null && response.data.length != 0) {
                    var data = response.data;
                    var log = [];
                    angular.forEach(data, function (msg) {
                        this.push(msg + " \n");
                    }, log);
                    $.Pop.alerts( $scope.constants.prompt_abnormal +":"+ log);
                } else {
                    $scope.tableParams.reload();
                    $.Pop.alerts($scope.constants.prompt_success);
                }
            }, function (response) {
                $.Pop.alerts(response);
            });
        }

    };

    /**
     * 新增探针
     *
     */
    $scope.newClick = function () {
        $scope.title = $scope.constants.label_create;
        $scope.new_old_flag = true;
        $scope.userMacListFlag = false;
        $scope.sensor = {
            "mac1": "",
            "mac2": "",
            "mac3": "",
            "mac4": "",
            "mac5": "",
            "mac6": ""
        };
        $scope.sensor.isOutside = ""
        $scope.initUserMacList("");
    };
    $scope.modifyClick = function (sensor) {
        $scope.sensor = sensor;
        $scope.new_old_flag = false;
        $scope.userMacListFlag = false;
        var obj = {
            sensorId: sensor.id
        };
        CommonService.request("GetSensorDetial", obj).then(function (response) {
            $scope.title = $scope.constants.label_edit;
            var data = response.data;
            if (sensor.sensorMac != null) {
                var macArray = [];
                macArray = sensor.sensorMac.split(":");
                sensor.mac1 = macArray[0];
                sensor.mac2 = macArray[1];
                sensor.mac3 = macArray[2];
                sensor.mac4 = macArray[3];
                sensor.mac5 = macArray[4];
                sensor.mac6 = macArray[5];
                sensor.minRssi = data.minRssi;
            }
        })

    };



    $scope.isOutside = [
        {id: 0, name: "未选择", value: ""},
        {id: 0, name: "店内探针", value: "N"},
        {id: 0, name: "店外探针", value: "Y"}
    ];

    $scope.filterSensorMinRssi = function (sensor) {
        return sensor;
    };
    //创建或更新探针信息
    $scope._create = function (sensor) {
        var _sensor = {
            id: sensor.id,
            sensorCode: sensor.sensorCode,
            sensorName: sensor.sensorName,
            sensorMac: sensor.mac,
            status: sensor.status,
            description: sensor.description,

            projectId: sensor.projectId,
            minRssi: sensor.minRssi,

            roomId: sensor.roomId,
            roomName: sensor.roomName,

            positionDescription: sensor.positionDescription,
            distance: sensor.distance,

            isOutside: sensor.isOutside,
            sensorType: sensor.sensorType,
            sensorVersion: sensor.sensorVersion
        };

        if(_sensor.projectId == undefined){
            $.Pop.alerts("请选择门店");
            return;
        }

        CommonService.create('CreatetNewSensor', _sensor).then(function (sensor) {
            $.Pop.alerts($scope.constants.prompt_success);
            $scope.tableParams.reload();
        }, function (response) {
            if (response.data != null && !response.data.success) {
                var error = decodeURI(response.headers()['x-wreport-error']);
                $.Pop.alerts(error);
            }
        });

    };

    $scope.reg_ = function (val) {
        var reg = /^-[0-9]*[1-9][0-9]*$/;
        if (Number(val)) {
            return reg.test(val);
        } else {
            return "" == val;
        }
    };

    $scope.createSensor = function (sensor) {

        sensor.mac = sensor.mac1 + ":" + sensor.mac2 + ":" + sensor.mac3 + ":" + sensor.mac4 + ":" + sensor.mac5 + ":" + sensor.mac6;
        if (sensor.sensorCode == undefined ||
            sensor.mac.length != 17) {
            $.Pop.alerts($scope.constants.prompt_place_promptSensorNew);
            return;
        }
        var re = new RegExp('^[a-f0-9]{2}(:[a-f0-9]{2}){5}$');

        if (!re.exec(sensor.mac)) {
            $.Pop.alerts($scope.constants.prompt_sensor_macError1+"(" + sensor.mac + ")"+$scope.constants.prompt_sensor_macError2);
            return;
        }

        if (sensor.minRssi != undefined && !$scope.reg_(sensor.minRssi)) {
            $.Pop.alerts($scope.constants.prompt_sensor_minRssi1+"(" + sensor.minRssi + ")"+$scope.constants.prompt_sensor_macError2);
            return;
        }
        sensor = $scope.filterSensorMinRssi(sensor);
        $scope._create(sensor);

    };

    $scope.filterSensorProperty = function (sensor) {
        sensor.mac = sensor.mac1 + ":" + sensor.mac2 + ":" + sensor.mac3 + ":" + sensor.mac4 + ":" + sensor.mac5 + ":" + sensor.mac6;
        if (sensor.hasOwnProperty("mac1")) {
            delete sensor["mac1"];
        }
        if (sensor.hasOwnProperty("mac2")) {
            delete sensor["mac2"];
        }
        if (sensor.hasOwnProperty("mac3")) {
            delete sensor["mac3"];
        }
        if (sensor.hasOwnProperty("mac4")) {
            delete sensor["mac4"];
        }
        if (sensor.hasOwnProperty("mac5")) {
            delete sensor["mac5"];
        }
        if (sensor.hasOwnProperty("mac6")) {
            delete sensor["mac6"];
        }
        return sensor;
    };
    $scope.editSensor = function (sensor) {
        $scope.createSensor(sensor);
    };

    $scope.saveSensor = function (sensor) {
        sensor = sensor || {};
        sensor.id === undefined ? $scope.createSensor(sensor) : $scope.editSensor(sensor);
    };

    $scope.removeSensor = function (sensor) {
        var msg = '';
        if (sensor.sensorName != null && sensor.sensorName != "") {
            msg = $scope.constants.prompt_remove +":"+ sensor.sensorName + "?";
        }
        $.Pop.confirms(msg, function () {
            CommonService.remove(sensor).then(function (sensor) {
                $scope.tableParams.reload();
            });
        });
    };

    $scope.search = function () {
        $scope.tableParams.filter({"q": encodeURI($scope.sensorsearchvalue)});
    };

    $scope.clickModal = function () {
        if (document.all) {
            window.event.cancelBubble = true;
        } else {
            event.stopPropagation();
        }
    };

    $scope.cancle = function () {
    };

    var window = parent.window || window;
    var winHg = $(window).height();
    var winWd = $(window).width();

    $scope.table_max_height = { 'max-height' : winHg - 355 + "px" ,"overflow-y": "auto","display": "block"};



});
angular.module('wreport.app').directive('sensorManage', function () {
    return {
        restrict: 'A',
        controller: 'SensorManageController',
        templateUrl: 'app/modules/maintenanceManagement/component/SensorManage.html',
        link: function (scope, element, attrs) {
        }
    };
});


angular.module('wreport.app').directive('sensorDialog', function () {
    return {
        restrict: 'A',
        replace: true,
        controller: function ($scope, $state, $location, CommonService) {
        },
        templateUrl: 'app/dialog/SensorDialog.html',
        link: function (scope, element, attrs) {
        }
    }
});