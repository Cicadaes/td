'use strict';

angular.module('wreport.app').controller('PassengerJobsComeController', function ($scope, $state, $location, NgTableParams, CommonService) {

    var reportId = "608";

    function msgOut(message) {
        if (message.target == "organization" && message.result) {
            if (message.result && message.result.filter && message.result.filter["0"].field == "project_id") {
                var projectId = message.result.filter["0"].value;
                $.ajax({
                    url: 'api/projects/find/' + projectId,
                    async: false,
                    data: {},
                    type: 'get',
                    success: function (data) {
                        $state.topBarScope.setEnvByProjectVM(data);
                        $scope.onProjectClick();
                    },
                    error: CommonService.errorCallback,
                });
            }
        }
    }

    window.DatWillSDK.getInstance().renderReport('.stage', reportId, msgOut);

    window.DatWillSDK.getInstance().getParameter({
        projectType: $state.projectVM.projectType,//1店铺   4城市  5大区  6品牌  2自定义
        projectId: $state.projectVM.projectId,//6015 // 7194
        projectName: $state.projectVM.projectName,
        group_sign: $state.group_sign,
        getFilterMethod: "old"
    })
    //======================================
    $scope.constants = $state.constants;
    $scope.currentProjectId = $state.projectVM.projectId;

    //======================================
    $scope.listType = 2;
    $scope.chooseTab = function (type) {
        $scope.listType = type;
        if (type == 1) {
            $state.go('passengerRegion');
        }
    };

    $scope.placeType = 2;
    $scope.changePlaceType = function (placeType) {
        $scope.placeType = placeType;
        $scope.changeDispData(0);
    };

    var yugi = function (now) {
        var d = new Date(now.replace(/[^\d]/g, "/") + "/1");
        var result = [now];
        for (var i = 0; i < 11; i++) {
            d.setMonth(d.getMonth() - 1);
            var m = d.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            result.push(d.getFullYear() + "-" + m);
        }
        return result;
    };
    function getPreMonth(date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
        if(String(month2).length==1){
            month2 = '0'+month2
        }

        var t2 = year2 + '-' + month2;
        return t2;
    }
    var now = new Date();
    var month = now.getMonth() + 1;
    var date = (now.getFullYear()) + '-' + (month < 10 ? '0' + month : month);
    var preMounth = getPreMonth(date);
    $scope.dateList = yugi(preMounth);
    var date2 = $scope.dateList[1];
    $scope.comp_time_1 = preMounth;
    $scope.comp_time_2 = date2;

    $scope.initCrowd = function () {
        var queryObj = {
            attr1: $scope.currentProjectId,
            status: 1
        };
        CommonService.request('crowdList', queryObj).then(function (response) {

            var res_data = response.data;
            var crowdList = [];

            angular.forEach(res_data, function (obj) {
                if ("AU" == obj.type) {
                }
                crowdList.push({
                    "id": obj.id,
                    "name": obj.name,
                    "type": obj.type
                });
            });

            $scope.crowdList = crowdList;
            if ($scope.crowdList.length > 0) {
                $scope.crowd_id_1 = $scope.crowdList[0].id;
                $scope.crowd_id_2 = $scope.crowdList[0].id;
            }

        });
    };

    $scope.changeCrowd_1 = function (data) {
        $scope.crowd_id_1 = data;
        $scope.changeDispData(0);
    };
    $scope.changeCrowd_2 = function (data) {
        $scope.crowd_id_2 = data;
        $scope.changeDispData(1);
    };
    $scope.changeTime_1 = function (data) {
        $scope.comp_time_1 = data;
        $scope.changeDispData(0);
    };
    $scope.changeTime_2 = function (data) {
        $scope.comp_time_2 = data;
        $scope.changeDispData(1);
    };

    $scope.panel_open = false;
    $scope.click = function () {
        $scope.panel_open = !$scope.panel_open;
        var tdCheck = $('.td-open-check');
        if ($scope.panel_open) {
            tdCheck.animate({
                right: "0px"
            });
        } else {
            tdCheck.animate({
                right: "60px"
            });
        }

        $scope.changeOpenStatus($scope.panel_open);

        if ($scope.panel_open) {
            $scope.changeDispData(0);
            $scope.changeDispData(1);
        } else {
            $scope.changeDispData(0);
        }

        setTimeout(function () {
            $scope.mapLocation();
        }, 100);

        CommonService.refreshAngular($scope);
    };

    $scope.changeOpenStatus = function (state) {
        var window = appConfig.thisWindow;
        var winHg = $(window).height();
        var winWd = $(window).width();
        var mapTop_div = $('#passengerJobs-map1');
        var mapBottom_div = $('#passengerJobs-map2');
        if (state) {
            mapTop_div[0].style.height = ((winHg - $scope.titleHeight - 2 - 45) + "px");
            mapBottom_div[0].style.height = ((winHg - $scope.titleHeight - 2 - 45) + "px");

            mapTop_div[0].style.width = ((winWd - 180) / 2 + "px");
            mapBottom_div[0].style.width = ((winWd - 180) / 2 + "px");

            mapBottom_div[0].style.display = 'block';
            $scope.initBmapTop();
            $scope.initBmapBottom();
            $scope.bindEvent();
        } else {
            mapTop_div[0].style.height = ((winHg - $scope.titleHeight - 2 - 45) + "px");

            mapTop_div[0].style.width = ((winWd - 180) + "px");

            mapBottom_div[0].style.display = 'none';
            $scope.initBmapTop();
        }
    }

    //============================================

    $scope.crowd_id_1 = $state.projectVM.defaultCrowd;
    $scope.crowd_id_2 = null;
    $scope.titleHeight = $state.topBarScope.titleHeight;

    $scope.onProjectClick = function () {
        $scope.crowd_id_1 = $state.projectVM.defaultCrowd;
        $scope.crowd_id_2 = null;

        $scope.currentProjectId = $state.projectVM.projectId;

        $scope.onloadMain();
        $scope.initCrowd();
        setTimeout(function () {
            $scope.mapLocation();
        })
    };

    //获取子项目列表，用于城市间切换
    $scope.getCityList = function () {

        $scope.cityList = [];
        $scope.cityProListMap = {};

        var queryObj2 = {
            projectId: $scope.currentProjectId,
            projectType: 2
        };
        CommonService.request('childProject', queryObj2).then(function (response) {
            var res_data = response.data;

            if ($state.projectVM.city) {
                $scope.cityProListMap[$state.projectVM.city] = 1;
                $scope.citySelected = $state.projectVM.city;
            } else {
                $scope.citySelected = null;
            }

            for (var i = 0; i < res_data.length; i++) {
                var obj = res_data[i];
                if (obj.city != null && obj.city != '' && obj.city != 'null') {
                    $scope.cityProListMap[obj.city] = 1;
                }
            }

            for (var k in $scope.cityProListMap) {
                if (!$scope.cityProListMap.hasOwnProperty(k)) {
                    continue;
                }
                $scope.cityList.push(k);
            }

            if ($scope.citySelected == null) {
                $scope.citySelected = $scope.cityList[0];
            }

            CommonService.refreshAngular($scope);

            if ($scope.citySelected) {
                $scope.changeCity($scope.citySelected);
            }

        });
    };
    $scope.changeCity = function (city) {
        if (city) {
            var city_lng = $state.city_center_point[city].lng;
            var city_lat = $state.city_center_point[city].lat;

            $scope.bmapTop.centerAndZoom(new BMap.Point(city_lng, city_lat), 11);

        }
        $scope.mapLocation();
    };

    //==================================
    $scope.bmapTop = null;
    $scope.bmapBottom = null;
    var mapOverlay = [{}, {}];

    //项目所在点，在地图上显示
    $scope.projectPointList = [];

    $scope.changeDispData = function (compIndex) {
        $scope.dot_list = [];

        mapOverlay[compIndex].setPoints([]);

        if (compIndex == 0) {
            $scope.getDataTrue($scope.currentProjectId, $scope.crowd_id_1, $scope.comp_time_1, compIndex);
        } else {
            $scope.getDataTrue($scope.currentProjectId, $scope.crowd_id_2, $scope.comp_time_2, compIndex);
        }

        $.ajax({
            url: 'api/projects/latlng',
            async: false,
            data: {
                id: $state.projectVM.projectId
            },
            type: 'get',
            success: function (data) {
                $scope.projectPointList = data;
                $scope.drawHouse(compIndex);
            },
            error: CommonService.errorCallback,
        });

    };

    $scope.getDataTrue = function (projectIdFinal, crowdIdFinal, dateFinal, compIndex) {
        var queryObj = {
            hourType: $scope.placeType,
            runDate: dateFinal + '-01',
            cycleStatistics: 30,
            crowdId: crowdIdFinal,
            projectId: projectIdFinal,
            page: 1,
            rows: 20000
        };

        CommonService.request('tenantJobHousingCounts', queryObj).then(function (response) {
            var res_data = response.data;

            var dataNew = res_data;

            for (var i = 0; i < dataNew.length; i++) {
                dataNew[i].lng = parseFloat(dataNew[i].lng);
                dataNew[i].lat = parseFloat(dataNew[i].lat);
            }

            mapOverlay[compIndex].appendPoints(dataNew);

        });
    };

    var pointCollection_house1;
    var pointCollection_house3;
    $scope.drawHouse = function (index) {
        var points = [];
        for (var i = 0; i < $scope.projectPointList.length; i++) {
            var self = $scope.projectPointList[i];
            if (self.latitude && self.longitude) {
                points.push({
                    lng: self.longitude,
                    lat: self.latitude,
                    name: self.projectName
                });
            }
        }

        var pointCollection_house = new TDMap.ImageOverlay(null, {
            type: "sum",
            imgUrl: "images/marker3.png",
            onMouseOver: function (per, event) {
                $scope.drawDiv(per.name, event.clientX, event.clientY);
            },
            onMouseLeave: function () {
                $scope.removeDiv();
            },
            getSize: function (data) {
                return {
                    width: 30,
                    height: 30
                };
            }
        });

        if (index == 0) {
            pointCollection_house1 = pointCollection_house;
            $scope.bmapTop.addOverlay(pointCollection_house1);
            pointCollection_house1.setPoints(points);
            pointCollection_house1.setZIndex(1);
        } else if (index == 1) {
            pointCollection_house3 = pointCollection_house;
            $scope.bmapBottom.addOverlay(pointCollection_house3);
            pointCollection_house3.setPoints(points);
            pointCollection_house3.setZIndex(1);
        }
    };

    $scope.getImgSize = function () {
        var img_size = 28;

        var map_zoom;
        if ($scope.crowd_id_2) {
            map_zoom = $scope.bmapBottom.getZoom();
        } else {
            map_zoom = $scope.bmapTop.getZoom();
        }
        if (map_zoom <= 12) {
            img_size = 28 * 0.3;
        } else if (map_zoom <= 13) {
            img_size = 28 * 0.45;
        } else if (map_zoom <= 14) {
            img_size = 28 * 0.6;
        } else if (map_zoom <= 15) {
            img_size = 28 * 0.75;
        } else if (map_zoom <= 16) {
            img_size = 28 * 0.9;
        }
        img_size = parseInt(img_size);
        return img_size;
    };

    $scope.drawDiv = function (name, x, y) {
        x += 10;
        y += 10;
        var $div = $('.job_tip_div');
        $div.html(name).css({
            top: y + 'px',
            left: x + 'px',
            display: 'inline-block'
        });
    };
    $scope.removeDiv = function () {
        $('.job_tip_div').html('').hide();
    };

    //对比地图拖拽同步
    $scope.bindEvent = function () {
        $scope.bmapTop.addEventListener("dragend", function () {
            var center = $scope.bmapTop.getCenter();
            $scope.bmapBottom.panTo(new BMap.Point(center.lng, center.lat));
        });
        $scope.bmapBottom.addEventListener("dragend", function () {
            var center = $scope.bmapBottom.getCenter();
            $scope.bmapTop.panTo(new BMap.Point(center.lng, center.lat));
        });

        $scope.bmapTop.addEventListener("zoomend", function () {
            var center = $scope.bmapTop.getCenter();
            var zoom = $scope.bmapTop.getZoom();
            $scope.bmapBottom.centerAndZoom(center, zoom);
        });

        $scope.bmapBottom.addEventListener("zoomend", function () {
            var center = $scope.bmapBottom.getCenter();
            var zoom = $scope.bmapBottom.getZoom();
            $scope.bmapTop.centerAndZoom(center, zoom);
        });
    };

    //初始化上侧地图
    $scope.initBmapTop = function () {
        $scope.bmapTop = new BMap.Map('passengerJobs-map1', {
            enableMapClick: false
        });
        $scope.bmapTop.disableScrollWheelZoom();
        $scope.bmapTop.centerAndZoom(new BMap.Point($state.projectVM.longitude, $state.projectVM.latitude), 11); // 初始化地图,设置中心点坐标和地图级别

        $scope.overlayTop = new TDMap.DotOverlay([], {
            fillStyle: '#e24542', // 填充颜色
            lineWidth: 0, // 描边宽度
            shadowColor: '#e24542', // 投影颜色
            shadowBlur: 35, // 投影模糊级数
            globalCompositeOperation: 'lighter', // 颜色叠加方式
            size: function (count) {
                return 4
            } // 半径
        });
        mapOverlay[0] = $scope.overlayTop;
        $scope.bmapTop.addOverlay($scope.overlayTop);
    };

    //初始化下侧地图
    $scope.initBmapBottom = function () {
        $scope.bmapBottom = new BMap.Map('passengerJobs-map2', {
            enableMapClick: false
        });
        $scope.bmapBottom.disableScrollWheelZoom();
        $scope.bmapBottom.centerAndZoom(new BMap.Point($state.projectVM.longitude, $state.projectVM.latitude), 11); // 初始化地图,设置中心点坐标和地图级别

        $scope.overlayBottom = new TDMap.DotOverlay([], {
            fillStyle: '#4286e0', // 填充颜色
            lineWidth: 0, // 描边宽度
            shadowColor: '#4286e0', // 投影颜色
            shadowBlur: 35, // 投影模糊级数
            globalCompositeOperation: 'lighter', // 颜色叠加方式
            size: function (count) {
                return 4
            } // 半径
        });
        mapOverlay[1] = $scope.overlayBottom;
        $scope.bmapBottom.addOverlay($scope.overlayBottom);
    };

    $scope.onloadMain = function () {
        $scope.getCityList();
        $scope.changeOpenStatus(false);
        $scope.changeDispData(0);
    };

});
