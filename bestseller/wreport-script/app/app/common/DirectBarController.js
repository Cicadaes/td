'use strict';

angular.module('wreport.app').controller('DirectBarController', function ($scope, $state, $http, $location, CommonService) {

    $scope.authAppList = appConfig.authAppList;

    $scope.goToProductList = function () {
        window.location.href = "/enterprise";
    };

    $scope.getAppByAppCode = function (appCode) {
        var app = {};
        if (appCode && appConfig && appConfig.authAppList && appConfig.authAppList.length > 0) {
            var authAppList = appConfig.authAppList;
            for (var i = 0; i < authAppList.length; i++) {
                if (appCode == authAppList[i].appCode) {
                    app = authAppList[i];
                    break;
                }
            }
        }
        return app;
    };

    $scope.getAppHrefTarget = function (appCode) {//获取产品跳转方式
        var app = $scope.getAppByAppCode(appCode);
        var appHrefContent = app.extAttr2;
        var appHrefTarget = {
            href: '',
            target: ''
        };
        if (appHrefContent) {
            try {
                var appHrefContentJson = JSON.parse(appHrefContent);
                if (appHrefContentJson && appHrefContentJson.target && appHrefContentJson.href) {
                    appHrefTarget = {
                        href: appHrefContentJson.href,
                        target: appHrefContentJson.target
                    };
                } else if (appHrefContentJson && !appHrefContentJson.target && appHrefContentJson.href) {
                    appHrefTarget = {
                        href: appHrefContentJson.href,
                        target: ''
                    };
                }
            } catch (e) {
                //alert(e);
                appHrefTarget = {
                    href: appHrefContent,
                    target: ''
                };
            }
        }
        return appHrefTarget;
    };

    $scope.bindEvents = function () {
        var $nav_bar = $("#nav-bar");
        $nav_bar.find(".li").bind('click', function () {
            var $li = $(this);
            /*if($li.hasClass("active")){
             return false;
             }*/
            var appCode = $li.attr("appCode");
            appConfig.appCode = appCode;
            var appHrefTarget = $scope.getAppHrefTarget(appCode);
            if (appHrefTarget.target == '_blank') {
                window.open(appHrefTarget.href);
            } else if (appHrefTarget.target == '_self') {
                $li.addClass("active").siblings().removeClass("active");
                window.location.href = appHrefTarget.href;
            } else {
                $li.addClass("active").siblings().removeClass("active");
                window.location.href = "/enterprise/#" + appConfig.appCode;
            }

        }).bind('mouseenter', function () {
            var $li = $(this);
            var $nav_name = $li.find(".nav-name");
            var scrollTop = $("body").scrollTop();
            var top = $li.find("a").offset().top - scrollTop;
            var nav_name = $nav_name.html();
            var $app_tip = $(".app-tip");
            $app_tip.html(nav_name).show().css({"top": top + 'px'});
        }).bind('mouseleave', function () {
            var $app_tip = $(".app-tip");
            $app_tip.hide();
        });
    };

    // $scope.bindEvents();
});
