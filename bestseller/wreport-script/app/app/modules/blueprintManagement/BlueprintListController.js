'use strict';

angular.module('wreport.app').controller('BlueprintListController', function ($scope, $state, $location, NgTableParams, CommonService, Upload) {
  $scope.constants = $state.constants;
  //$scope.currentProjectId = $state.projectVM.projectId;
  $scope.projectPlace = {};
  $scope.radioType = 1;
  $scope.deployName = $scope.constants.table_sensor;

  // if ($state.projectVM.projectType == 1) {
  //     $scope.deployTitle = $scope.constants.btn_projectPlace_room;
  //     $scope.deployType = 1;
  //     $scope.deployName = $scope.constants.label_store;
  // }

  // 部署状态
  $scope.sensorStatus = [
    {key: "显示全部", value: ""},
    {key: "显示未部署", value: 1},
    {key: "显示已部署", value: 0}
  ];

  $scope.onProjectClick = function () {
    $scope.search();
  };

  // 部探针
  $scope.probeDeploy = function (obj) {
    $scope.curPlace = obj;
    $scope.initDeploy($scope.curPlace);
  };

  // 回车搜素
  $scope.myKeyup = function (e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      $scope.tableParams.filter({"q": encodeURI($scope.searchText), projectType: 1,status:1});
    }
    if ($scope.searchText == "") {
      $scope.tableParams.filter({"q": encodeURI($scope.searchText), projectType: 1,status:1});
    }
  };

  $scope.tableParams = new NgTableParams({
    page: 1,
    count: 10,
    filter: {
      projectType : 1,
      status:1
    }
  }, {
    counts: [10, 20, 50],
    paginationMaxBlocks: 9,
    total: 0,
    getData: function ($defer, params) {

      // 查询客户围群table列表
      var queryObj = CommonService.buildQueryParams($scope.tableParams);
      CommonService.request('GetDrawingManagementList', queryObj).then(function (response) {
        $scope.customCrowds = response.data;
        var total = response.headers()['x-total-count'];
        var customCrowds = response.data;
        params.total(total);
        $defer.resolve(customCrowds);
      });
      $("#sensortype").focus(function (e) {
        e.stopPropagation();
        $("#sensortype_").css("display", "block");
      });
      $("#sensortype").blur(function (e) {
        e.stopPropagation();
        $("#sensortype_").css("display", "none");
      })
      $("#blueprintStatus").focus(function (e) {
        e.stopPropagation();
        $("#blueprintStatus_").css("display", "block");
      });
      $("#blueprintStatus").blur(function (e) {
        e.stopPropagation();
        $("#blueprintStatus_").css("display", "none");
      })
    }
  });

  //还原
  $scope.reductionBlueprint = function (customCrowd) {
    $.Pop.confirms("执行清空后会清空图纸及清除探针部署在图纸的位置，是否确认清空？", function () {
      var obj = {
        id:customCrowd.id
      };
      CommonService.request("RemoveProjectAreaPic",obj).then(function (response) {
        $scope.tableParams.reload();

        if (response.data) {
          $.Pop.alerts(response.data.msg);
        } else {
          $.Pop.alerts($scope.constants.prompt_sensor_success);
        }
      });
    });
  };

  $scope.search = function () {
    $scope.tableParams.filter({
      'q': $scope.searchValue,
      projectId: $scope.currentProjectId,
      status: 1
    });
  };

  $scope.clickModal = function () {
    if (document.all) {
      window.event.cancelBubble = true;
    } else {
      event.stopPropagation();
    }
  };

  //上传图纸
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

        // 保存图片接口
        var queryObj = {
          id: projectPlace.id,
          picUrl: response.data.filePath
        };
        CommonService.create("SaveProjectPlacePic",queryObj).then(function(response){
          if (response.data) {
            $.Pop.alerts(response.data.msg);
            if(response.data.state){
              projectPlace.picUrl = response.data.filePath;
              $scope.tableParams.reload();
            }
          } else {
            $.Pop.alerts($scope.constants.prompt_sensor_success);
          }
        })
      }, function (response) {
        $.Pop.alerts($scope.constants.prompt_newImg);
      });
    }
  };

  // 按照图纸状态过滤
  $scope.blueprintStatusSelect = function(value){
//             $scope.params.$params['sorting'] = {};
    $scope.blueprintStatus = "";
    $scope.blueprintSelect = "";
    $("#sensortype").blur();
    $("#blueprintStatus").blur();
    if(value == "全部" || value == "All")
    {
      value = "";
    }
//             $scope.tableParams.filter({"blueprintStatus":value,"projectId":$scope.currentProjectId,"statuses":1})
  };

  // 按照探针状态过滤
  $scope.sensortypeSelect = function(value){
//             $scope.params.$params['sorting'] = {};
    $scope.sensortype = "";
    $scope.sensorselect = "";
    $("#sensortype").blur();
    $("#blueprintStatus").blur();
//             $scope.tableParams.filter({"normal":value,"projectId":$scope.currentProjectId,"statuses":1})
  };


  //================================
  //edited
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
    // $scope.table_width_6 = {'width': table_width / 6 + 'px'};

    $scope.table_max_height = {'max-height': winHg - 310 + "px"};

    //-----------------------------------------------
    var diaHeight = winHg - 120;
    var diaWidth = winWd - 100;
    $scope.model_width = {'width': diaWidth + 'px'};
    $scope.model_height = {'height': (diaHeight - 85) + 'px'};
    $scope.list_height = {'height': (diaHeight - 278) + 'px'};
  };
  $scope.resize();
});
