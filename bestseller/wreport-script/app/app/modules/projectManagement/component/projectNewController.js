'use strict';

angular.module('wreport.app').controller('projectNewController', function ($scope, $state, $location, NgTableParams, CommonService) {

    $scope.constants = $state.constants;
    $scope.byprojectName = "";

    // 跳转回项目管理页面
    $scope.goProjectManagement = function () {
        localStorage.removeItem("customUpdateId");
        $state.go("projectManagement")
    };


    // 初始化变量
    var sonList = []; // 店组分配
    // 保存时的下级店组，店铺
    $scope.list = [];  // 左边数据显示
    $scope.listsG = []; // 所有店组
    $scope.lists = [];  // 所有店铺
    $scope.allG = [];  // 全选是做过度 --所有店组
    $scope.listRchoose = [];
    $scope.listLchoose = [];
    $scope.listR = [];
    $scope.chooseAll = [];
    $scope.chooseAllR = [];
    $scope.flagAL = false;
    $scope.flagAR = false;
    $scope.project = {};
    $scope.f = {};
    //店铺分配
    $scope.haveG = [];
    $scope.projectNameLength = 0;
    $scope.projectPositionLength = 0;
    $scope.projectNumLength = 0;
    $scope.listLchoose = [];


    if($state.customUpdateId == undefined){
        $state.customUpdateId = JSON.parse(localStorage.getItem("customUpdateOne"));
    }



    //编辑店组时需要请求的接口
        if ($state.customUpdateId) {
            setTimeout(function () {
                // 编辑时请求接口
                var queryobj = {
                    projectId: $state.customUpdateId.id
                };
                CommonService.request('EditShopGroup', queryobj).then(function (response) {
                    var data = response.data;
                    if (data.projectName != null) {
                        $scope.projectNameLength = data.projectName.length;
                    }
                    if (data.projectNum != null) {
                        $scope.projectNumLength = data.projectNum.length;
                    }
                    if (data.projectPosition != null) {
                        $scope.projectPositionLength = data.projectPosition.length;
                    }
                    // 取回来下级店组，下级店铺  分配到不同的数据列表中
                    for (var j = 0; j < data.childProjectList.length; j++) {
                        var obj = data.childProjectList[j];
                            $scope.haveG.push(obj);  // 编辑时已有店组列表
                            $scope.chooseAll.push(obj); // 所有店组     用于店组左边全选时
                            $scope.chooseAllR.push(obj);  // 所有店组   用于店组右边全选时

                    }
                    $scope.project = data;
                    $scope.listR = $scope.haveG;  // 编辑店组时   下级店组
                    $scope.listRshop = $scope.haveS;  // 编辑店铺时   下级店铺
                    for (var k = 0; k < data.projectList.length; k++) {
                        var obj2 = data.projectList[k];
                            $scope.list.push(obj2);
                            $scope.listsG.push(obj2); // 所有店组  店组左边列表
                            $scope.allG.push(obj2); // 所有店组
                            $scope.chooseAll.push(obj2); // 所有店组     用于店组左边全选时
                            $scope.chooseAllR.push(obj2);  // 所有店组   用于店组右边全选时

                    }
                    // 初始化个数
                    $scope.leftGLength = $scope.list.length; // 分配店组左边
                    $scope.rightGright = $scope.listR.length; // 分配店组右边
                    CommonService.refreshAngular($scope);
                })
            }, 2000);
        }else {
            // 新建店组时需要请求的接口 请求所有数据
            var queryobj = {
                //pageEnabled: false,
                status: 1,
                page:1,
                rows:200,
                //projectType: 1
            };
            CommonService.request('GetCustomProjectList', queryobj).then(function (response) {
                var data = response.data;
                for (var i = 0; i < data.length; i++) {
                        $scope.listsG.push(data[i]); // 所有店组  店组左边列
                        $scope.allG.push(data[i]); // 所有店组
                        $scope.chooseAll.push(data[i]); // 所有店组     用于店组左边全选时
                        $scope.chooseAllR.push(data[i]);  // 所有店组   用于店组右边全选时

                }
                $scope.list = $scope.listsG;  // 所有店组左边列表
                $scope.leftGLength = $scope.list.length; // 分配店组左边
                $scope.rightGright = "0"; // 分配店组右边
                CommonService.refreshAngular($scope);
            })
        }

    // 限制店组名字长度
    $scope.name_ = function () {
        $scope.projectNameLength = 0;
        if ($scope.project.projectName != "" && $scope.project.projectName != undefined) {
            $scope.projectNameLength = $scope.project.projectName.length;
        }
    };

    // 限制店组ID长度
    $scope.id_ = function () {
        $scope.projectNumLength = 0;
        if ($scope.project.projectNum != "" && $scope.project.projectNum != undefined) {
            $scope.projectNumLength = $scope.project.projectNum.length;
        }

    };

    // 限制店组地址长度
    $scope.address_ = function () {
        $scope.projectPositionLength = 0;
        if ($scope.project.projectPosition != "" && $scope.project.projectPosition != undefined) {
            $scope.projectPositionLength = $scope.project.projectPosition.length;
        }
    };


    // 搜索接口
    $scope.searchProject = function (projectName) {
        // 新建店组时需要请求的接口 请求所有数据
        var queryobj = {
            status: 1,
            page:1,
            rows:200
        };
        queryobj["q"] = projectName;
        CommonService.request('GetCustomProjectList', queryobj).then(function (response) {
            var data = response.data;
            $scope.listsG = []; // 所有店组  店组左边列
            $scope.allG = []; // 所有店组
            $scope.chooseAll = []; // 所有店组     用于店组左边全选时
            $scope.chooseAllR = [];  // 所有店组   用于店组右边全选时
            $scope.listsG = angular.copy(data);
            $scope.allG = angular.copy(data); // 所有店组
            $scope.chooseAll = angular.copy(data); // 所有店组     用于店组左边全选时
            $scope.chooseAllR = angular.copy(data);  // 所有店组   用于店组右边全选时

            for (var i = 0; i < $scope.listsG.length; i++) {
                for(var j = 0; j < $scope.listR.length; j++){
                    if($scope.listsG[i]["id"] ==  $scope.listR[j]["id"]){
                        $scope.listsG.splice(i, 1); // 所有店组  店组左边列
                        $scope.allG.splice(i, 1); // 所有店组
                        $scope.chooseAll.splice(i, 1); // 所有店组     用于店组左边全选时
                        $scope.chooseAllR.splice(i, 1);  // 所有店组   用于店组右边全选时
                    }
                }
            }

            $scope.list = $scope.listsG;  // 所有店组左边列表
            $scope.leftGLength = $scope.list.length; // 分配店组左边
            $scope.rightGright = $scope.listR.length; // 分配店组右边
            CommonService.refreshAngular($scope);
        })
    };

    // 回车搜索
    $scope.setKeyUp = function (e) {
        //console.log('=====>$scope.byprojectName',$scope.byprojectName);
        $scope.searchProject($scope.byprojectName);
    };

    // 店组 选择左右
    $scope.moveRight = function () {
        if ($scope.flagAL) {
            $scope.list = [];
            $scope.listR = [];
            for (var b = 0; b < $scope.chooseAll.length; b++) {
                $scope.listR.push($scope.chooseAll[b])
            }
            $("#checkall1").removeClass("check_");
        } else {
            for (var i = 0; i < $scope.listRchoose.length; i++) {
                $scope.listR.push($scope.listRchoose[i])
            }
            // 清除掉左边被选中的
            for (var k = 0; k < $scope.list.length; k++) {
                for (var j = 0; j < $scope.listRchoose.length; j++) {
                    if ($scope.list[k].id == $scope.listRchoose[j].id) {
                        $scope.list.splice(k, 1);
                    }
                }
            }
        }
        $scope.leftGLength = $scope.list.length; // 分配店组左边
        $scope.rightGright = $scope.listR.length; // 分配店组右边
        $scope.listRchoose = [];
    };

    $scope.moveLeft = function () {
        if ($scope.flagAR) {
            $scope.listR = [];
            $scope.list = [];
            for (var a = 0; a < $scope.chooseAllR.length; a++) {
                $scope.list.push($scope.chooseAllR[a]);
            }
            $("#checkall2").removeClass("check_");
        } else {
            for (var i = 0; i < $scope.listLchoose.length; i++) {
                $scope.list.push($scope.listLchoose[i])
            }
            // 从列表中清除选中的数据
            for (var k = 0; k < $scope.listR.length; k++) {
                for (var j = 0; j < $scope.listLchoose.length; j++) {
                    if ($scope.listR[k].id == $scope.listLchoose[j].id) {
                        $scope.listR.splice(k, 1);
                    }
                }
            }
        }
        $scope.leftGLength = $scope.list.length; // 分配店组左边
        $scope.rightGright = $scope.listR.length; // 分配店组右边
        $scope.listLchoose = [];
    };

    // 左边全选按钮
    $scope.check_all1 = function ($event) {
        $scope.flagAL = true;
        if ($($event.target).hasClass("check_")) {
            $($event.target).parent().parent().parent().find(".check_one").removeClass("check_");
            $($event.target).removeClass("check_")
        } else {
            $($event.target).parent().parent().parent().find(".check_one").addClass("check_");
            $($event.target).addClass("check_")
        }
    };

    // 右边全选按钮
    $scope.check_all2 = function ($event) {
        $scope.flagAR = true;
        if ($($event.target).hasClass("check_")) {
            $($event.target).parent().parent().parent().find(".check_one").removeClass("check_");
            $($event.target).removeClass("check_")
        } else {
            $($event.target).parent().parent().parent().find(".check_one").addClass("check_");
            $($event.target).addClass("check_")
        }

    };

    // 左边单选
    $scope.check_one1 = function (project, $event) {
        $scope.flagAL = false;
        // 清除选中有取消的
        for (var i = 0; i < $scope.listRchoose.length; i++) {
            if (project.id == $scope.listRchoose[i].id) {
                $scope.listRchoose.splice(i, 1);
            }
        }
        if ($($event.target).hasClass("check_")) {
            $($event.target).removeClass("check_");
            $($event.target).parent().parent().parent().parent().parent().find(".checkall_").removeClass("check_")
        } else {
            $($event.target).addClass("check_");
            $scope.listRchoose.push(project);
        }
    };


    // 右边单选
    $scope.check_one2 = function (project, $event) {
        $scope.flagAR = false;
        // 清除选中又取消的
        for (var i = 0; i < $scope.listR.length; i++) {
            if (project.id == $scope.listR[i].id) {
                $scope.listLchoose.splice(i, 1);
            }
        }
        if ($($event.target).hasClass("check_")) {
            $($event.target).removeClass("check_")
            $($event.target).parent().parent().parent().parent().parent().find(".checkall_").removeClass("check_")
        } else {
            $($event.target).addClass("check_");
            $scope.listLchoose.push(project)
        }
    };

    $scope.filterProjectPro = function (project) {
        project.projectChildrenId = project.projectChildrenId;
        if (project.hasOwnProperty("flag")) {
            delete project["flag"];
        }
        if (project.hasOwnProperty("selectedStartHour")) {
            delete project["selectedStartHour"];
        }
        if (project.hasOwnProperty("selectedEndHour")) {
            delete project["selectedEndHour"];
        }
        if (project.hasOwnProperty("selectedStartMin")) {
            delete project["selectedStartMin"];
        }
        if (project.hasOwnProperty("selectedEndMin")) {
            delete project["selectedEndMin"];
        }
        if (project.hasOwnProperty("refresh")) {
            delete project["refresh"];
        }
        if (project.hasOwnProperty("uuid")) {
            delete project["uuid"];
        }
        if (project.hasOwnProperty("file")) {
            delete project["file"];
        }

        if (project.hasOwnProperty("route")) {
            delete project["route"];
            project.route = "/api/projects"
        }
        return project;
    };


    $scope.init = function () {
        $scope.saveProject = function (project) {
            // 取新添加好的下级店组
            for (var i = 0; i < $scope.listR.length; i++) {
                sonList.push($scope.listR[i].id)
            }

            project = project || {};
            project.projectChildrenId = sonList.join("@");
            //debugger
            if(project.projectChildrenId == ""){
                $.Pop.alerts("请选择下游项目。");
                return;
            }
            if (project.id === undefined) {
                $scope.importDataFile(project);
            } else {
                $scope.editProject(project);
            }
        };


        // 新建项目
        $scope.importDataFile = function (project) {
            if (project.projectName == undefined || project.projectNum == undefined) {
                $.Pop.alerts($scope.constants.prompt_projectNew);
                return;
            }

            project = $scope.filterProjectPro(project);

            CommonService.create('CreateNewProject', project).then(function (response) {
                $state.go("projectManagement")
            });
        };

        // 编辑项目
        $scope.editProject = function (project) {
            if (project.projectName == undefined || project.projectNum == undefined) {
                $.Pop.alerts($scope.constants.prompt_projectNew);
                return;
            }

            project = $scope.filterProjectPro(project);
            CommonService.update(project).then(function (response) {
                $state.go("projectManagement")
            });
        };
    };
    $scope.init();
});