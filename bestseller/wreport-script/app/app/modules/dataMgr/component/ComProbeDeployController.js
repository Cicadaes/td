angular.module('wreport.app').directive('probeDeployDialog', function () {
    return {
        restrict: 'A',
        replace: true,
        controller: function ($scope, $state, $location, CommonService) {
            //探针部署   Start
            $scope.probe_list = [];//探针列表
            $scope.deployMap = {};//探针位置map
            $scope.markerMap = {};//探针点marker，map
            $scope.dataMap = {};//数据map，便于检索
            $scope.currentData = {};//当前数据项，探针上的提示信息
            $scope.deployCount = 0;//本场地已布置数
            $scope.show_filter = false;//显示过滤条件下拉
            $scope.currentStatus = 99;//过滤器目前的状态

            $scope.picWidth = 2099.5866;
            $scope.picHeight = 1078.8;
            $scope.statusStr = $scope.constants.label_all + $scope.constants.label_space + $scope.deployName;//页面使用

            $scope.logoWidth = 29;
            $scope.logoHeight = 44;

            $scope.userMacListFlag = false;
            $scope.userMacList = []; // 探针mac下拉列表
            $scope.new_old_flag = true;

            // 探针类型
            $scope.sensorType = [
                {key: $scope.constants.mapper_batch_set_all, value: ""},
                {key: "wif探针", value: 1},
                {key: "3G/4G探针", value: 2}
            ];
            //新建探针 探针类型
            $scope.sensorTypes = [
                {key: "wif探针", value: 1},
                {key: "3G/4G探针", value: 2}
            ];
            // 探针型号
            $scope.sensorModel = [
                {key: "GL234", value: 1},
                {key: "GL222", value: 2},
                {key: "GL456", value: 3}
            ];

            $scope.initUserMacList = function (mac) {
                var queryObj = {
                    q: mac
                };
                CommonService.request('GetUserMacList', queryObj).then(function (response) {
                    $scope.userMacList = response.data;
                });
            };
            $scope.initUserMacList("");

            // 获取已经向collector发数的mac列表
            $scope.getMacList = function (event) {
                event.stopPropagation();
                $scope.userMacListFlag = !$scope.userMacListFlag;

            };

            // 过滤功能
            $scope.filterMac = function (sensor) {
                var a = sensor.mac1 + ":" + sensor.mac2 + ":" + sensor.mac3 + ":" + sensor.mac4 + ":" + sensor.mac5 + ":" + sensor.mac6;
                if (sensor.mac1 == "" && sensor.mac2 == "" && sensor.mac3 == "" && sensor.mac4 == "" && sensor.mac5 == "" && sensor.mac6 == "") {
                    a = "";
                }
                $scope.initUserMacList(a);
            };

            // 在下拉列表选择一个mac后自动填写上
            $scope.checkOne = function (one) {
                var arr = one.split(":");
                $scope.sensor.mac1 = arr[0];
                $scope.sensor.mac2 = arr[1];
                $scope.sensor.mac3 = arr[2];
                $scope.sensor.mac4 = arr[3];
                $scope.sensor.mac5 = arr[4];
                $scope.sensor.mac6 = arr[5];
                $scope.userMacListFlag = false;
            };

            $scope.saveSensor = function (sensor) {
                sensor = sensor || {};
                $scope.createSensor(sensor);
            };

            $scope.createSensor = function (sensor) {
                sensor.mac = sensor.mac1 + ":" + sensor.mac2 + ":" + sensor.mac3 + ":" + sensor.mac4 + ":" + sensor.mac5 + ":" + sensor.mac6;
                if (sensor.sensorCode == undefined ||
                    sensor.mac.length != 17) {
                    $.Pop.alerts($scope.constants.prompt_sensor_new);
                    return;
                }
                var re = new RegExp('^[a-f0-9]{2}(:[a-f0-9]{2}){5}$');
                if (!re.exec(sensor.mac)) {
                    $.Pop.alerts($scope.constants.prompt_sensor_macError1 + "(" + sensor.mac + ")" + $scope.constants.prompt_sensor_macError2);
                    return;
                }
                $scope._create(sensor);
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

                    projectId: sensor.projectId || $scope.currentProjectId,
                    minRssi: sensor.minRssi,

                    roomId: sensor.roomId,
                    roomName: sensor.roomName,

                    positionDescription: sensor.positionDescription,
                    distance: sensor.distance,

                    isOutside: sensor.isOutside,
                    sensorType: sensor.sensorType,
                    sensorVersion: sensor.sensorVersion,
                };
                CommonService.create('CreatetNewSensor', _sensor).then(function (sensor) {
                    $scope.initSensorList();
                }, function (response) {
                    if (response.data != null && !response.data.success) {
                        var error = decodeURI(response.headers()['x-wreport-error']);
                        $.Pop.alerts(error);
                    }
                });
            };
            // 弹出框  关闭按钮
            $scope.cancle = function () {
            };

            $scope.DateProbe = {
                className: 'DateProbe',

                onLoad: function () {
                },

                dragProb: function (event, id) {

                    var ids = id.split(',');

                    event.dataTransfer.setData("Text", ids[0]);
                    event.dataTransfer.setData("logoId", ids[1]);
                    event.dataTransfer.setData("text", id);

                    var imgDiv = $('#testImg');

                    if (event.dataTransfer.setDragImage) {
                        event.dataTransfer.setDragImage(imgDiv[0], 14.5, 40);
                    }
                },

                dropProb: function (event) {
                    event.preventDefault();
                    var logoId = null;

                    var textData = event.dataTransfer.getData("text");
                    var ids = textData.split(',');
                    var id = ids[0];

                    var pointX = event.offsetX;
                    var pointY = event.offsetY;
                    var relatedType = 0;
                    for (var k in $scope.probe_list) {
                        if (!$scope.probe_list.hasOwnProperty(k)) {
                            continue;
                        }
                        var obj = $scope.probe_list[k];
                        relatedType = obj.relatedType;
                        if (obj.sensorId == parseInt(id)) {
                            obj['color_status_old'] = obj['color_status'];
                            obj['color_status'] = 1;
                        }
                    }
                    CommonService.refreshAngular($scope);
                    $scope.initProbePoint(id, pointX, pointY, 'origin', logoId, relatedType);
                },

                dragover: function (event) {
                    event.preventDefault();
                },

                clickProb: function (id) {
                    if ($scope.deployMap[id] != null) {
                        var marker = $scope.markerMap[id];
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        setTimeout(function () {
                            marker.setAnimation();
                        }, 2000);
                    }
                },

                saveDeploy: function () {
                    var dataArray = [];
                    for (var key in $scope.deployMap) {
                        if ($scope.deployMap.hasOwnProperty(key)) {
                            var obj = $scope.deployMap[key];
                            var pointXY = obj.split(',');
                            dataArray.push({
                                id: key,
                                x: pointXY[0].replace('\r\n', ''),
                                y: pointXY[1].replace('\r\n', ''),
                                type: pointXY[2]
                            });
                        }
                    }
                    var dataStr = JSON.stringify(dataArray);
                    var reqParma = {
                        pid: parseInt($scope.projectId),//parseInt($scope.currentProjectId),
                        //did: parseInt($scope.projectPlaceId),
                        datastr: dataStr,
                        placeName: $scope.drwName
                    };

                    CommonService.create('sensorInstallInfosUpdate', reqParma).then(function (response) {
                        if (response.data) {
                            $.Pop.alerts(response.data.msg);
                        } else {
                            $.Pop.alerts($scope.constants.prompt_sensor_success);
                        }
                    });
                },

                doFilterByStatus: function () {
                    $scope.show_filter = !$scope.show_filter;
                },

                createOpen: function () {
                    $scope.title = $scope.constants.label_create;
                    $scope.sensor = {
                        "mac1": "",
                        "mac2": "",
                        "mac3": "",
                        "mac4": "",
                        "mac5": "",
                        "mac6": ""
                    };
                    setTimeout(function () {
                        document.getElementById('sensorDialog_1').style.left = '400px';
                    }, 100);
                },
                chooseStatus: function (status) {
                    $scope.currentStatus = parseInt(status);

                    var statusMap = {
                        '99': $scope.constants.label_all + $scope.deployName,
                        '0': $scope.constants.mapper_projectpalce_chooseStatus_notfurnished,
                        '1': $scope.constants.mapper_projectpalce_chooseStatus_furnished,
                        //'2': $scope.constants.mapper_projectpalce_chooseStatus_thisplacenotfurnished
                    };
                    $scope.statusStr = statusMap[status];
                },

                mapLocation: function () {
                    // $scope.map.panTo($scope.orginPoint);
                    $scope.map.centerAndZoom($scope.orginPoint, 8);
                },

                mapBigger: function () {
                    var map_zoom = $scope.map.getZoom();
                    if (map_zoom >= 9) {
                        return false;
                    }
                    $scope.map.setZoom(map_zoom + 1);
                },

                mapSmaller: function () {
                    var map_zoom = $scope.map.getZoom();
                    if (map_zoom <= 7) {
                        return false;
                    }
                    $scope.map.setZoom(map_zoom - 1);
                },

                tooltip: function (event, name, change, index) {
                    var divInfo = document.getElementById("my_tooltip");
                    if (change == '1') {
                        divInfo.style.display = "block";
                        divInfo.innerHTML = name;
                        divInfo.style.left = 1300 + "px";
                        divInfo.style.top = 218 + index * 40 + "px";
                    } else {
                        divInfo.style.display = "none";
                    }
                },
                tooltip_out: function (event, name) {
                    var divInfo = document.getElementById("my_tooltip");
                    divInfo.style.display = "none";
                }
            };

            $scope.initData = function (param) {

                var contentDiv = $("#probe_map_div");
                contentDiv[0].addEventListener("click", function (event) {
                    if ($scope.show_filter) {
                        $scope.show_filter = false;
                    }
                });

                var contentDiv2 = $("#probe_list_main");
                contentDiv2[0].addEventListener("click", function (event) {
                    if ($scope.show_filter) {
                        $scope.show_filter = false;
                    }
                });

                $scope.initSensorList();

                $scope.isOutside = [
                    {id: 0, name: "未选择", value: ""},
                    {id: 0, name: "店内探针", value: "N"},
                    {id: 0, name: "店外探针", value: "Y"}
                ];
            };

            $scope.initSensorList = function () {
                var relatedType = 1;
                // if ($state.projectVM.projectType == 1) {
                //     relatedType = 2;
                // }
                var param = {
                    projectId: $scope.thisprojectid,//$scope.currentProjectId,//$scope.thisprojectid,
                    //status: 1,//状态有效
                    pageEnabled: false,
                    relatedType: relatedType
                };

                CommonService.request('sensorInstallInfos', param).then(function (response) {
                    $scope.data = [];
                    var data = response.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].constructor == Object) {
                            $scope.data.push(data[i]);
                        }
                    }
                    for (var k in $scope.data) {
                        if (!$scope.data.hasOwnProperty(k)) {
                            continue;
                        }
                        var obj = $scope.data[k];

                        obj.sensorId = obj.relatedId;
                        $scope.dataMap[obj.sensorId] = obj;

                        if (obj.longitude == null || obj.latitude == null
                            || obj.projectPlaceId == 0 || obj.longitude == '0' || obj.latitude == '0') {
                            obj['color_status'] = 0;
                        } else if (obj.projectId == $scope.projectId) {
                            obj['color_status'] = 1;
                            var id = obj.sensorId;
                            var pointX = obj.longitude;
                            var pointY = obj.latitude;
                            if (parseFloat(pointX) > $scope.picWidth || parseFloat(pointY) > $scope.picHeight) {
                                pointX = '100';
                                pointY = '100';
                            }
                            $scope.deployMap[id] = pointX + ',' + pointY + ',' + obj.relatedType;
                        } else {
                            obj['color_status'] = 2;
                        }

                        if (obj['name'].length > 8) {
                            obj['nameMapper'] = obj['name'].substring(0, 8) + '...';
                            obj['sensorNameChange'] = '1';
                        } else {
                            obj['nameMapper'] = obj['name'];
                            obj['sensorNameChange'] = '0';
                        }

                        obj['codeMapper'] = obj['relatedAttribute'];
                    }

                    $scope.probe_list = $scope.data;   // 拿到的全部探针
                    $scope.deployMap = {};
                    $scope.markerMap = {};
                    $scope.deployCount = 0;

                    for (var key in $scope.probe_list) {
                        if (!$scope.probe_list.hasOwnProperty(key)) {
                            continue;
                        }
                        var probe_obj = $scope.probe_list[key];

                        if (probe_obj.color_status == 1) {
                            var id2 = probe_obj.sensorId;
                            var relatedType = probe_obj.relatedType;
                            var pointX2 = probe_obj.longitude;
                            var pointY2 = probe_obj.latitude;
                            if (parseFloat(pointX2) > $scope.picWidth || parseFloat(pointY2) > $scope.picHeight) {
                                pointX2 = '100';
                                pointY2 = '100';
                            }
                            $scope.initProbePoint(id2, pointX2, pointY2, null, probe_obj.logoId, relatedType);
                        }
                    }
                    CommonService.refreshAngular($scope);
                }, function (response) {

                });
            };

            $scope.initMap = function () {
                var map = new BMap.Map('probe_map_div', {enableMapClick: false});
                var point = new BMap.Point(116.404, 39.915);
                $scope.orginPoint = point;

                map.centerAndZoom(point, 8);
                map.disableDoubleClickZoom();

                var b = new BMap.Bounds(new BMap.Point(105.746831, 35.379736), new BMap.Point(127.061169, 44.159083));
                try {
                    BMapLib.AreaRestriction.setBounds(map, b);
                } catch (e) {
                    $.Pop.alerts(e);
                }

                if ($scope.drwStrUrl && $scope.drwStrUrl != "images/small_picture.png") {
                    $.ajax({
                        url: $scope.drwStrUrl,
                        async: false,
                        data: {},
                        type: 'get',
                        success: function (data) {
                            // debugger
                        },
                        error: function (data) {
                            $scope.drwStrUrl = "images/small_picture.png";
                        }
                    });
                }

                var indoor = new TDMap.IndoorOverlay($scope.drwStrUrl, $scope.picWidth, $scope.picHeight, 'rrheight');
                indoor.addEventListener('load', function (e) {
                    $scope.initData();//初始化数据
                });
                map.addOverlay(indoor);

                $scope.map = map;
                $scope.indoor = indoor;
            };

            $scope.initProbePoint = function (id, pointX, pointY, type, logoId, relatedType) {
                if ($scope.markerMap[id] != null) {
                    var marker = $scope.markerMap[id];
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                    setTimeout(function () {
                        marker.setAnimation();
                    }, 2000);
                    return;
                }

                var tmpPoint = $scope.indoor.inPixelToPoint(pointX, pointY);
                if (type == 'origin') {
                    tmpPoint = $scope.indoor.inPixelToPointOrigin(pointX, pointY);
                }

                var imgUrl = 'images/icon-id.png';

                var myIcon = new BMap.Icon(imgUrl, new BMap.Size($scope.logoWidth, $scope.logoHeight));
                var tmpMarker = new BMap.Marker(tmpPoint, {icon: myIcon});
                tmpMarker.setOffset(new BMap.Size(0, -18));
                $scope.map.addOverlay(tmpMarker);
                tmpMarker.enableDragging();
                tmpMarker.myId = id;
                tmpMarker.logoId = logoId;

                var inPixel = $scope.indoor.pointToInPixel(tmpPoint);
                $scope.deployMap[id] = Math.round(inPixel.x) + ',' + Math.round(inPixel.y) + ',' + relatedType;
                $scope.markerMap[id] = tmpMarker;
                $scope.deployCount++;

                //创建右键菜单
                var markerMenu = new BMap.ContextMenu();
                markerMenu.addItem(new BMap.MenuItem('删除', $scope.removeMarker.bind(tmpMarker)));
                tmpMarker.addContextMenu(markerMenu);

                tmpMarker.addEventListener('dragend', function () {
                    var inPixel = $scope.indoor.pointToInPixel(this.point);

                    var relatedType = 1;
                    // if ($state.projectVM.projectType == 1) {
                    //     relatedType = 2;
                    // }
                    $scope.deployMap[this.myId] = Math.round(inPixel.x) + ',' + Math.round(inPixel.y) + ',' + relatedType;
                });

                var opts = {
                    width: 0,     // 信息窗口宽度
                    offset: new BMap.Size(15, -35) //信息窗口偏移量
                };
                tmpMarker.addEventListener("mouseover", function (e) {
                    $scope.currentData = $scope.dataMap[e.target.myId];
                    CommonService.refreshAngular($scope);

                    var divInfo = document.getElementById("PassengerDistribution-divInfo");
                    var infoWindow = new BMap.InfoWindow(divInfo.innerHTML, opts);  // 创建信息窗口对象
                    var pointNew = new BMap.Point(e.target.point.lng, e.target.point.lat);
                    $scope.map.openInfoWindow(infoWindow, pointNew); //开启信息窗口
                    $scope.infoWindow = infoWindow;
                });

                tmpMarker.addEventListener("mouseout", function (e) {
                    $scope.infoWindow.close();
                });

                tmpMarker.addEventListener('dragging', function (e) {
                    $scope.infoWindow.close();
                });

            };

            $scope.removeMarker = function (e, ee, marker) {
                var _this = marker;
                $scope.map.removeOverlay(_this);
                delete $scope.deployMap[_this.myId];
                delete $scope.markerMap[_this.myId];
                $scope.deployCount--;

                for (var k in $scope.probe_list) {
                    if (!$scope.probe_list.hasOwnProperty(k)) {
                        continue;
                    }
                    var obj = $scope.probe_list[k];
                    if (obj.sensorId == _this.myId) {
                        if (obj['color_status_old'] != null) {
                            obj.color_status = obj['color_status_old'];
                        } else {
                            obj.color_status = 0;
                        }
                    }
                }
                CommonService.refreshAngular($scope);
            };

            //探针部署   END

            $scope.initDeploy = function (obj) {
                var queryobj = {
                    projectId: obj.id
                };
                CommonService.request('GetProjectAreaPic', queryobj).then(function (response) {
                    //debugger
                    var data = response.data;
                    $scope.drwStrUrl = "images/small_picture.png";
                    if (data.picUrl) {
                        $scope.drwStrUrl = "pic/" + data.picUrl;
                    }
                    $scope.projectId = data.projectId;
                    // var paramObj = {
                    //     "diagramId": data.diagramId,
                    //     "projectPlaceId": data.id,
                    //     "placeName": data.placeName
                    // };
                    $scope.thisprojectid = data.projectId;
                    setTimeout(function () {
                        $scope.resize();
                    }, 1);
                    setTimeout(function () {

                        $scope.drwName = data.placeName;

                        $scope.initMap();//初始化地图

                        //初始化控制按钮
                        var lis = $("#passengerRegion-tools ul li");
                        lis[0].addEventListener("click", $scope.DateProbe.mapLocation);
                        lis[1].addEventListener("click", $scope.DateProbe.mapBigger);
                        lis[2].addEventListener("click", $scope.DateProbe.mapSmaller);

                        appConfig.DateProbe = $scope.DateProbe;//供页面非ng事件触发

                        var dengxiang1 = $(".modal.in.top.am-fade");
                        dengxiang1.unbind("click");

                    }, 1000);
                }, function (response) {
                    var data = obj;
                    $scope.drwStrUrl = "images/small_picture.png";
                    // if (data.picUrl) {
                    //     $scope.drwStrUrl = "pic/" + data.picUrl;
                    // }
                    $scope.projectId = data.id;
                    $scope.thisprojectid = data.id;
                    setTimeout(function () {
                        $scope.resize();
                    }, 1);
                    setTimeout(function () {
                        $scope.drwName = data.placeName;
                        $scope.initMap();//初始化地图
                        //初始化控制按钮
                        var lis = $("#passengerRegion-tools ul li");
                        lis[0].addEventListener("click", $scope.DateProbe.mapLocation);
                        lis[1].addEventListener("click", $scope.DateProbe.mapBigger);
                        lis[2].addEventListener("click", $scope.DateProbe.mapSmaller);
                        appConfig.DateProbe = $scope.DateProbe;//供页面非ng事件触发
                        var dengxiang1 = $(".modal.in.top.am-fade");
                        dengxiang1.unbind("click");
                    }, 1000);
                });

            };

        },
        templateUrl: 'app/dialog/ProbeDeployDialog.html',
        link: function (scope, element, attrs) {
        }
    }
});