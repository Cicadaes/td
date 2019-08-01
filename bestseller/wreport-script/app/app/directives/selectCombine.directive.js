'use strict';
/**
 * 下拉列表组件
 */
angular.module('wreport.app').directive('selectCombine', function () {
    return {
        restrict: 'A',
        scope: {
            labels:"=",
            showSelectBox:"=",
            count:"="

        },
        controller: function ($scope, $state, $location, CommonService) {

        },
        templateUrl: 'app/directives/selectCombine.html',
        link: function (scope, element, attrs) {
            scope.label = {
                        name:"按店铺查看",
                        isShowList:false,
                        list:[
                            {
                                code:"city",
                                value:"按城市查看"
                            },
                            {
                                code:"store",
                                value:"按店铺查看"
                             }
                        ]}

             scope.agency = {
                         name:"全部办事处",
                         isShowList:false,
                         list:[
                            {
                                code:"city",
                                value:"华北"
                            },
                            {
                                code:"store",
                                value:"华南"
                             }
                         ]}

              scope.city = {
                          name:"全部城市",
                          isShowList:false,
                          list:[
                             {
                                 code:"city",
                                 value:"北京"
                             },
                             {
                                 code:"store",
                                 value:"上海"
                              }
                          ]}

              scope.brand = {
                          name:"全部品牌",
                          isShowList:false,
                          list:[
                             {
                                 code:"only",
                                 value:"only"
                             },
                             {
                                 code:"jackjones",
                                 value:"jackjones"
                              }
                          ]}

              scope.selectedStorelList = [

                      {
                        code:"dzm",
                        value:"东直门店铺"
                      }
               ]

              scope.storeList = [
                      {
                        code:"dzm",
                        value:"东直门店铺"
                      },
                      {
                        code:"dzm",
                        value:"朝阳门店铺"
                      },
                      {
                      code:"dzm",
                      value:"大悦城店铺"
                      }
              ]
            var $element = $(element);
//            $element.bind("click",function(){
//                scope.showSelectBox = !scope.showSelectBox;
//            })

            //点击下拉标题
            scope.showLabelList = function(obj){
                var currentStatus = obj.isShowList;
                 //全部下拉列表收起
                scope.label.isShowList = false;
                scope.agency.isShowList  = false;
                scope.city.isShowList  = false;
                scope.brand.isShowList  = false;
                //当前下拉列表展开/收起
                obj.isShowList = !currentStatus;
            }

            //选中一个key
            scope.selectLabel = function(obj){


            }

            //选中一个店铺
            scope.selectStore = function(store){
                if(scope.checkHas(store,scope.selectedStorelList)) return;



            }
            //检查是否已经选中
            scope.checkHas = function(obj,arr){
                var has = false;
                if(arr){
                    for(var i= 0;i< arr.length;i++){
                        if(obj.code == arr[i].code){
                            has = true;
                            break;
                        }
                    }
                }
                return has;
            }

            scope.init = function(){



            }
            scope.init();
        }
    }
});