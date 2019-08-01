'use strict';

angular.module('wreport.app').controller('ComPeopleMediaController', function ($scope, $state, $location, CommonService) {

    $scope.housekey = null;
    var medieLength = 24;
    var islen = 0;

    $scope.appTouchType = "radar";

    $scope.datas = [{
        id: 1,
        label: $scope.constants.label_coverageDegree,
        value: "radar"
    }, {
        id: 0,
        label: $scope.constants.label_appPreference,
        value: "appPreference"
    }];

    // 媒体触点
    $scope.requestDataAll_2 = function (opraDom, comp_side) {
        var usetime = $('.media_drag_time').text();
        var uset = usetime.split('~'), usest = uset[0].split(':')[0], useet = uset[1].split(':')[0];
        var hour = usest + "," + useet;

        if (true && comp_side != 2) {
            // 请求对比1
            var projectId = $scope.currentProjectId;
            var crowdId = $scope.firstid;
            if ($scope.comparePanelType == 'multi') {
                projectId = $scope.firstid;
                crowdId = $scope.crowd_map[$scope.firstid];
            }

            var param = {
                "startDate": $scope.comp_date_1_start,
                "endDate": $scope.comp_date_1_end,
                "projectId": projectId,
                "crowdId": crowdId,

                "hour": hour,
                "applistlimit": 50,
                "appTouchType": $scope.appTouchType,
                "appType": $scope.housekey
            };

            CommonService.request('queryAppUseTimeList', param).then(function (response) {
                $scope.mediatouchPoint1(opraDom, response.data, 0);
            });
            CommonService.request('queryAppUseList', param).then(function (response) {
                $scope.mediatouchPoint2(opraDom, response.data, 0);
            });

        }

        if ($scope.status == 'compare_double' && comp_side != 1) {
            // 请求对比2
            var projectId2 = $scope.currentProjectId;
            var crowdId2 = $scope.secondid;
            if ($scope.comparePanelType == 'multi') {
                projectId2 = $scope.secondid;
                crowdId2 = $scope.crowd_map[$scope.secondid];
            }
            var param2 = {
                "startDate": $scope.comp_date_1_start,
                "endDate": $scope.comp_date_1_end,
                "projectId": projectId2,
                "crowdId": crowdId2,

                "hour": hour,
                "applistlimit": 50,
                "appTouchType": $scope.appTouchType,
                "appType": $scope.housekey
            };

            CommonService.request('queryAppUseTimeList', param2).then(function (response) {
                $scope.mediatouchPoint1(opraDom, response.data, 1);
            });
            CommonService.request('queryAppUseList', param2).then(function (response) {
                $scope.mediatouchPoint2(opraDom, response.data, 1);
            });
        }

    };

    if ($scope.$parent) {
        $scope.$parent.requestDataAll_2 = $scope.requestDataAll_2;
    }

    $scope.mediatouchPoint1 = function (picpar, arr, compIndex) {

        var properties = picpar.find('.properties');
        var plen = properties.length;

        var nameList = [];
        var valueList = [];
        angular.forEach(arr, function (obj) {
            nameList.push(obj.tag_name);
            valueList.push(obj.sta_value);
        });
        // app使用作息图
        var media_app_chart_01 = $('.media_app_chart_01')[compIndex];
        $scope.drawsquareimg(media_app_chart_01, nameList, valueList);

        // 对比进度条处理
        var drag_left = properties.find('.drag_left'), drag_right = properties.find('.drag_right'), mbar = properties.find('.media_drag_top'), media_drag_time = properties
            .find('.media_drag_time'), time_d_l = 0, time_d_r = 0, centerval = 0;

        // 对比显示处理
        if ($scope.status == 'compare_double') {
            // 时间进度条处理
            var drag_slider = properties.find('.drag_slider'), d_s_l = parseInt(drag_slider.css("left")), d_r_l = parseInt(drag_right.css("left")), d_l_l = parseInt(drag_left
                .css("left"));
            if ($scope.status == 'compare_double' && islen !== plen) {
                islen = plen;
                // 对比
                mbar.width(mbar.width() / 2 + 'px');
                // 右边点缩放处理
                drag_right.css('left', d_r_l / 2 + 'px');
                // 左边点缩放处理
                drag_left.css('left', d_l_l / 2 + 'px');
                // 判断距离点
                drag_slider.css('left', d_s_l / 2 + 'px');
            }
            if ($scope.status == 'compare_single' && islen !== plen) {
                islen = plen;
                // 初始化
                mbar.width(mbar.width() * 2 + 'px');
                // 右边点缩放处理
                drag_right.css('left', d_r_l * 2 + 'px');
                drag_left.css('left', d_l_l * 2 + 'px');
                // 左边点移动处理
                drag_slider.css('left', d_s_l * 2 + 'px');
            }
        } else {
            // 初始化 display为none 强制设置值 width为200px
            if (mbar.width() === 0) {
                mbar.width(200 / mlen + 'px');
            }
        }

        time_d_l = parseInt(drag_left.css("left"));
        time_d_r = parseInt(drag_right.css("left"));
        centerval = (time_d_l < time_d_r) ? time_d_l : time_d_r;
        // 时间段
        media_drag_time.css("left", Math.abs(centerval) + (mbar.width() / 2) + 'px');
    };

    $scope.mediatouchPoint2 = function (picpar, arr, compIndex) {
        // applist列表
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            if (!obj.sta_value) {
                obj.sta_value = 'images/app_logo/app_logo.png';
            }
        }
        if (compIndex == 0) {
            $scope.applist = arr;
        } else {
            $scope.applist_2 = arr;
        }

        CommonService.refreshAngular($scope);
    };

    $scope.drawsquareimg = function (main, arr, datarr) {
        var options = {
            tooltip: {
                /* trigger: 'axis', */
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' |
                    // 'shadow'
                },
                showContent: false // 是否显示提示
            },
            grid: {
                left: '1%',
                right: '2%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                textStyle: {
                    color: '#333'
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: arr
            }],
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }],
            series: [{
                name: $scope.constants.label_appRest,
                type: 'bar',
                stack: 'group_1',
                hoverAnimation: false,
                itemStyle: {
                    normal: {
                        color: $state.theme_color_value
                    }
                },
                data: datarr
            }]
        };

        var myChart = echarts.init(main);
        myChart.setOption(options);
    };

    //===================================================
    $scope.funcObj = {

        arrSortVal: function (arra, temparr) {
            var m = null, j = 0;
            for (m in arra) {
                if (!arra.hasOwnProperty(m)) {
                    continue;
                }
                temparr.push(arra[m]);
            }
            temparr = temparr.sort(function (a, b) {
                return a - b;
            });
            // 冒泡排序 去重遍历key
            for (m in arra) {
                if (!arra.hasOwnProperty(m)) {
                    continue;
                }
                j = $.inArray(arra[m], temparr);
                temparr[j] = m + '_' + temparr[j];
            }
            return temparr;
        },

        moveTimeArea: function (e, dom) {
            var tmp_func_obj = $scope.funcObj;
            if (dom.length != 1) {
                return;
            }
            var operationDom = dom[0];
            // 移动区间
            var els = operationDom.style, od = $(operationDom), pod = od.parents('.properties'), parod = od.parent(), startarLeft = -5, endtarLeft = 0, nowleft = 0, otherleft = 0, x = 0, media_drag_time = pod
                .find('.media_drag_time'), target = e.target;

            // 按下元素后，计算当前选择区域的开始和结束位置
            endtarLeft = pod.find('canvas').width();
            x = e.clientX - operationDom.offsetLeft;
            // 拿到第二个点的坐标
            var otherpar = od.siblings().not('.drag_slider');
            $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
            // IE下捕捉焦点
            target.setCapture && target.setCapture();
            // 绑定移动事件
            function mouseMove(e) {
                els.left = e.clientX - x + 'px';
                nowleft = parseInt(els.left);
                otherleft = parseInt(otherpar.css('left'));
                // 如果超过起始点
                if (startarLeft > nowleft) {
                    els.left = startarLeft + 'px';
                    return;
                }
                // 如果超过结束点
                if (nowleft > endtarLeft) {
                    els.left = endtarLeft + 'px';
                    return;
                }

                // 如果起点向右移动值 超出第二个点 则第二个点为起点
                if (nowleft > otherleft) {
                    parod.find('.drag_slider').css("left", otherleft + 'px');
                    media_drag_time.css("left", Math.abs(otherleft) + (parod.width() / 2) + 'px');
                    parod.width(((nowleft - otherleft) / endtarLeft) * endtarLeft + 'px');
                } else {
                    parod.find('.drag_slider').css("left", nowleft + 'px');
                    media_drag_time.css("left", Math.abs(nowleft) + (parod.width() / 2) + 'px');
                    parod.width(((otherleft - nowleft) / endtarLeft) * endtarLeft + 'px');
                }
                return false;
            }

            // 绑定结束事件
            function mouseUp(e) {
                var timearea = endtarLeft / medieLength, startarea = 0, endarea = 0;
                if (nowleft / timearea > 0) {
                    startarea = parseInt(nowleft / timearea) + 7;
                } else {
                    startarea = 7;
                }
                if (otherleft / timearea > 0) {
                    endarea = parseInt(otherleft / timearea) + 7;
                } else {
                    endarea = 7;
                }
                // 如果超过24 强制赋值为24点
                endarea = (endarea > 24) ? 24 : endarea;
                startarea = (startarea > 24) ? 24 : startarea;
                // 赋值处理
                if (startarea > endarea) {
                    media_drag_time.text(endarea + ':00~' + startarea + ':00');
                } else {
                    media_drag_time.text(startarea + ':00~' + endarea + ':00');
                }

                // 结束时还原位置
                target.releaseCapture && target.releaseCapture();
                // 卸载事件
                $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
                // 如果当前是操作第一项选择
                tmp_func_obj.applistload();
            }
        },
        applistload: function () {
            var picturecon = $('.picturecon');
            var picpar = picturecon.eq(0);
            $scope.requestDataAll_2(picpar);
        }

    };

    // 加载项目下app分类
    $scope.allAppTypeIdStr = "";
    $scope.initProjectAppTypes = function () {

        var queryObj = {
            projectId: $scope.currentProjectId
        };
        CommonService.request('projectAppTypess', queryObj).then(function (response) {
            $scope.appTypes = response.data;
            var str = "";
            angular.forEach(response.data, function (type) {
                str = str + "," + type.typeId;
            });
            if (str.length > 0) {
                str = str.substring(1, str.length);
                $scope.allAppTypeIdStr = str;
            }
        });
    };

    $scope.appTouchTypeChange = function (appTouchType) {
        $scope.appTouchType = appTouchType;
        $scope.appTypeClick();
    };

    $scope.appTypeClick = function (appType) {

        var thisdom, key;

        if (!appType) {
            thisdom = $(".alltypeClick");
            key = $scope.allAppTypeIdStr;
        } else {
            thisdom = $(".appType_" + appType.id);
            key = appType.typeId;
        }

        $scope.housekey = key;
        $(thisdom).addClass('media_choose').siblings().removeClass('media_choose');

        var tmp_func_obj = $scope.funcObj;
        tmp_func_obj.applistload();
    };

    // 媒体触点，左右拖动
    $('#timeAreaRight').mousedown(function (e) {
        $scope.funcObj.moveTimeArea(e, [this]);
    });
    $('#timeAreaLeft').mousedown(function (e) {
        $scope.funcObj.moveTimeArea(e, [this]);
    });
});

angular.module('wreport.app').directive('comPeopleMedia', function () {
    return {
        restrict: 'A',
        controller: 'ComPeopleMediaController',
        templateUrl: 'app/modules/passengerPortrait/component/comPeopleMedia.html'
    };
});
