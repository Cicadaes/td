'use strict';

angular.module('wreport.app').factory('CommonFunc', function (Restangular) {
    return {
        //格式化title字数大于5加入...
        formaterString: function (string, length) {
            if (length == undefined) {
                length = 5;
            }
            var value = "";
            if (string != undefined) {
                if (string.length > length) {
                    value = string.substring(0, length);
                    value = value + "..."
                } else {
                    value = string;
                }
            }
            return value;
        },

        //本项目用的日期格式
        formatDateLocal: function (dateLong) {
            var value = new Date(dateLong).Format('yyyy-MM-dd');
            return value;
        },

        //获取两个时间点的的间隔日期
        getDateLength: function (endDateLong, startDateLong) {
            var dateLength = (endDateLong - startDateLong) / 86400000 + 1;
            return dateLength;
        },

        //刷新angularjs，带判断
        refreshAngular: function ($scope) {
            if (!$scope.$$phase && !$scope.$root.$$phase) {
                //console.log('========$scope.$apply()========')
                $scope.$apply();
            }
        },

        //根据列名和升降序排序，key：列名，dir：升降序
        sortByCol: function (ary, key, dir) {
            var length = ary.length;
            for (var i = 0; i < length; i++) {
                var _min = ary[i]
                var k = i
                for (var j = i + 1; j < length; j++) {
                    if ((dir == 'asc' && _min[key] > ary[j][key]) || (dir == 'desc' && _min[key] < ary[j][key])) {
                        _min = ary[j]
                        k = j
                    }
                }
                ary[k] = ary[i]
                ary[i] = _min
            }
            return ary;
        },

        //根据分页信息截取list
        getDataByPage: function (dataList, page, count) {

            var start = (page - 1) * count;
            var end = page * count;
            if (end > dataList.length) {
                end = dataList.length;
            }
            var tmpList = dataList.slice(start, end);

            return tmpList;
        },

        //获取上个月的第一天和最后一天
        getLastMonthDateLong: function () {

            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth();
            var startLong = new Date(year + '/' + month + '/01').getTime();
            var endLong = new Date(year + '/' + (month + 1) + '/01').getTime() - 86400000;

            return {
                startLong: startLong,
                endLong: endLong,
            };
        },

        //处理选择今天逻辑
        getDateWithoutToday: function (startDateLong, endDateLong) {

            // 处理选择今天逻辑
            var startDateVal = new Date(startDateLong).Format('yyyy-MM-dd');
            var endDateVal = new Date(endDateLong).Format('yyyy-MM-dd');
            startDateLong = new Date(startDateVal).getTime()
            endDateLong = new Date(endDateVal).getTime()
            var todayStr = new Date().Format('yyyy-MM-dd');
            var todayLong = new Date(todayStr).getTime()
            var tmp = endDateLong;
            if (tmp == todayLong) {
                endDateLong = endDateLong - 24 * 60 * 60 * 1000;
                if (tmp == startDateLong) {
                    startDateLong = startDateLong - 24 * 60 * 60 * 1000;
                }
            }
            return {
                startDateLong: startDateLong,
                endDateLong: endDateLong,
            };
        },
    };
});

