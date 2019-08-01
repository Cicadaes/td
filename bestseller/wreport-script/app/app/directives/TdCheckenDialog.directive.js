'use strict';
/**
 * 添加指标组件
 */
angular.module('wreport.app').directive('tdCheckedDialog', function () {
    return {
        restrict: 'A',
        scope: {
            showflag:"=",
            tdChange: "&",
            tdHide: "&"
        },
        controller: function ($scope, $state, $location, CommonService) {

        },
        templateUrl: 'app/directives/td-checked.html',
        link: function ($scope, element, attrs) {
            // {
            //     code:"activeUsers",
            //         value:"入店客流",
            //     checked:false
            // } ,{
            //     code:"frontUsers",
            //         value:"周边客流",
            //         checked:false
            // },{
            //     code:"stayUsers",
            //         value:"停留客流",
            //         checked:false
            // }
            // 指标数据模拟
            $scope.checkedList = {
                datalist:[
                    {
                        name:"客流趋势指标",
                        value:"passenger-flow-trend",
                        isShowList:true,
                        checked:false,
                        list:[{
                            code:"jumpUsers",
                            value:"跳出客流",
                            checked:false
                        } ,
                        //     {
                        //     code:"memberCount",
                        //     value:"入店会员",
                        //     checked:false
                        // },
                            {
                            code:"potentialCount",
                            value:"微信认证数",
                            checked:false
                        },{
                            code:"memberCount",
                            value:"手机认证数",
                            checked:false
                        }]
                    },{
                        name:"客流构成指标",
                        value:"passenger-flow-composition",
                        isShowList:true,
                        list:[{
                            code:"activeUserNewRate",
                            value:"新客占比",
                            checked:false
                        },{
                            code:"activeUserOldRate",
                            value:"老客占比",
                            checked:false
                        },{
                            code:"highRate",
                            value:"高活跃客占比",
                            checked:false
                        } ,{
                            code:"middleRate",
                            value:"中活跃客占比",
                            checked:false
                        } ,{
                            code:"lowRate",
                            value:"低活跃客占比",
                            checked:false
                        },{
                            code:"sleepRate",
                            value:"沉睡客占比",
                            checked:false
                        }]
                    },{
                        name:"客流转化指标",
                        value:"passenger-flow-transformation",
                        isShowList:true,
                        checked:false,
                        list:[{
                            code:"stayDurationPerTime",
                            value:"入店平均停留时长",
                            checked:false
                        },{
                            code:"enterRate",
                            value:"入店率",
                            checked:false
                        },{
                            code:"stayRate",
                            value:"停留率",
                            checked:false
                        } ,{
                            code:"jumpRate",
                            value:"跳出率",
                            checked:false
                        }]
                    },{
                        name:"消费指标",
                        value:"consumption",
                        isShowList:true,
                        checked:false,
                        list:[{
                            code:"salesAmount",
                            value:"销售金额",
                            checked:false
                        },{
                            code:"orderCount",
                            value:"订单数",
                            checked:false
                        },{
                            code:"orderAveragePrice",
                            value:"VPC",
                            checked:false
                        } ,{
                            code:"singularPrice",
                            value:"件单价",
                            checked:false
                        }]
                    },{
                        name:"显示环比指标",
                        value:"mom",
                        isShowList:true,
                        checked:false,
                        list:[]
                    }
                ]
            };

            $scope.dataList = [];

            // 点击选中自己及下级
            $scope.checkedAll = function(one){
                one.checked = !one.checked;
                if(one.list.length != 0){
                    for(var i = 0; i < one.list.length; i++){
                        one.list[i].checked = one.checked;
                    }
                }
            };

            // 选中单个
            $scope.checkedOne = function(one,parent){
                one.checked = !one.checked;
                if(parent.list.length != 0){
                    var index = 0;
                    for(var i = 0; i <parent.list.length; i++){
                        if(parent.list[i].checked == true){
                            index = index + 1;
                        }
                    }
                    if(index == parent.list.length){
                        parent.checked = true;
                    }else{
                        parent.checked = false;
                    }
                }
            };

            // 确定按钮
            $scope.confirmSelect = function(){
                $scope.dataList = [];
                var data = angular.copy($scope.checkedList);
                var dataList = data.datalist;
                for(var i = 0; i < dataList.length; i++){
                    var obj = dataList[i];
                    if(obj.list.length != 0){
                        for(var k = 0; k < obj.list.length; k++){
                            if(obj.list[k].checked == true){
                                $scope.dataList.push(obj.list[k].code)
                            }
                        }
                    }else {
                        if(obj.checked == true){
                            $scope.dataList.push(obj.value)
                        }
                    }
                }
                $scope.tdChange()($scope.dataList);
            };

            // 取消按钮
            $scope.cancelSelect = function(){
               $scope.tdHide()();
            };

        }
    }
});
