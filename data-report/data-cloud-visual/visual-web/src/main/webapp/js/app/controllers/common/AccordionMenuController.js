define(['angularAMD'], function (angularAMD) {
  'use strict';
  angularAMD.controller('AccordionMenuController', ['$scope','$http', '$state','$stateParams', function ($scope,$http,$state,$stateParams) {
	  
	$scope.menuList = angular.copy(appConfig.menuList);
	$scope.menu=$scope.menuList ;
	$scope.curMenuUri = "";
	$scope.showAccordMenu=true;
	$scope.searchMenuKeyword = "";
	  
	$scope.title="搜索";
  	$scope.getCurrFocus= function(callback){
  			$scope.title="";
  	}
  	$scope.bluFocus=function(callback){
  		if($scope.searchMenuKeyword==null||$scope.searchMenuKeyword==""){
  			$scope.title="搜索";
  		}
  		
  	}
	  
	  $scope.convertState = function(state){
		  if(state.split("/").length > 2){
			  state = state.substring(0,state.lastIndexOf("/"));
		  }
		  var convertedState = convertStateConfig[state];
		  if(convertedState){
			  return convertedState;
		  }
		  return state;
	  };
	  
	  $scope.toggleMenuLeft = function(node){
		  for(var i=0; i<$scope.menu.length; i++){
			  if(node.extAttr2 == $scope.menu[i].extAttr2){
				  $scope.menu[i].show = !$scope.menu[i].show; 
			  }else{
				  $scope.menu[i].show = false; 
			  }
		  }
		  
		  if(window.parent && window.parent.iFrameScrollHeight){
			  window.setTimeout(window.parent.iFrameScrollHeight,200);
		  }
	  }
	  
	  $scope.searchMenuList = function(){
		  
	  }
	  
	  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		  var winHg = $(window).height();
		  var $content = $('.contents .con-box');
		  $content.height(winHg).scrollTop(0);
		  var md = toState.url.split('/')[1];
		  var curMenuUri = $scope.convertState(toState.url);
		  $scope.curMenuUri = '#'+curMenuUri;
		  if(window.parent && window.parent.iFrameScrollHeight){
			  window.setTimeout(window.parent.iFrameScrollHeight,200);
		  }
	  	});
	  
	  $scope.scrollMenu = function(){
		  var $menu_left = $('#menu-left');
		  if($menu_left && $menu_left.length){
			  var $bottom_scroll = $menu_left.siblings(".bottom_scroll");
			  $.jqueryScroll($menu_left.parent(),$menu_left,"v",false,true);
		  }
	  }
	  
	  $scope.mouseoverLogout = function(){
		  $scope.isShowLogout = true;
	  }
	  
	  $scope.mouseoutLogout = function(event){
		  $scope.isShowLogout = false;
	  }
	  
	  $scope.toggleLogout = function(){
		  $scope.isShowLogout = !$scope.isShowLogout;
		  if($scope.isShowLogout){
			  $("body").bind("mousedown", $scope.onBodyDown);
			  $scope.IframeOnClick.track(document.getElementById("extern-pages"), function() { 
				  $scope.$apply(function (){
					  $scope.isShowLogout = false;
				  });
			  });
		  }
	  }
	  
	  $scope.goToRuleSystem = function(){
		  $scope.isShowLogout = false;
		  $scope.isShowRuleSystem = true;
	  }
	  
	  $scope.IframeOnClick = {  
	    resolution: 200,  
	    iframes: [],  
	    interval: null,  
	    Iframe: function() {  
	        this.element = arguments[0];  
	        this.cb = arguments[1];   
	        this.hasTracked = false;  
	    },  
	    track: function(element, cb) {  
	        this.iframes.push(new this.Iframe(element, cb));  
	        if (!this.interval) {  
	            var _this = this;  
	            this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);  
	        }  
	    },  
	    checkClick: function() {  
	        if (document.activeElement) {  
	            var activeElement = document.activeElement;  
	            for (var i in this.iframes) {  
	                if (activeElement === this.iframes[i].element) {
	                    if (this.iframes[i].hasTracked == false) {   
	                        this.iframes[i].cb.apply(window, []);   
	                        this.iframes[i].hasTracked = true;  
	                    }  
	                } else {  
	                    this.iframes[i].hasTracked = false;  
	                }  
	            }  
	        }  
	    }  
	  };
	  
	  $scope.onBodyDown = function(event) {
		  $scope.isShowRuleSystem = false;
		  if (!($(event.target).parents("#logout").length > 0 || $(event.target).hasClass("pop-bg") || $(event.target).parents(".pop-box").length > 0)) {
			  $scope.$apply(function (){
				  $scope.isShowLogout = false;
			  });
			  $("body").unbind("mousedown", $scope.onBodyDown);
		  }
	  }
	  
	  $scope.checkRepasswordValid = function(){
		  if($scope.changeUser.repassword != $scope.changeUser.newPassword){
			  $scope.repasswordIsError = true;
		  }else{
			  $scope.repasswordIsError = false;
		  }
	  }
	  
	  $scope.checkNewPasswordValid = function(){
		  if($scope.changeUser.oldPassword == $scope.changeUser.newPassword){
			  $scope.newPasswordIsSame = true;
		  }else{
			  $scope.newPasswordIsSame = false;
		  }
	  }
	  
	  $scope.updatePassword =function(callback,formHorizontal){
		  if(!$scope.changeUser.oldPassword){
			  formHorizontal.oldPassword.$dirty = true;
			  return false;
		  }
		  if(!$scope.changeUser.newPassword){
			  formHorizontal.newPassword.$dirty = true;
			  return false;
		  }
		  
		  if($scope.changeUser.oldPassword == $scope.changeUser.newPassword){
			  $scope.newPasswordIsSame = true;
			  return false;
		  }else{
			  $scope.newPasswordIsSame = false;
		  }
		  
		  if(!$scope.changeUser.repassword){
			  formHorizontal.repassword.$dirty = true;
			  return false;
		  }
		  if($scope.changeUser.repassword != $scope.changeUser.newPassword){
			  $scope.repasswordIsError = true;
			  return false;
		  }
		  $scope.repasswordIsError = false;
		  
		  $http({
				method:'post',
				url:'changeUserPassword.do',
				data: {'oldPassword':$scope.changeUser.oldPassword,'newPassword':$scope.changeUser.newPassword},
				config:{
					'Content-Type' : 'application/json'
				}
			})
			.success(function(data) {
				if(data.errMsg){
					$.Pop.alerts(data.errMsg);
				}else if(data.msg){
					$scope.changeUser.oldPassword = "";
					$scope.changeUser.newPassword = "";
					$scope.changeUser.repassword = "";
					$.Pop.alerts(data.msg);
					callback.call();
				}
		    })
		    .error(function(data) {
		    	$.Pop.alerts("网络异常");
		    });
	  }
	  
	  $scope.showUpdatePasswordLayer = function(){
		  $scope.changeUser = {};
		  $scope.repasswordIsError = false;
		  $scope.newPasswordIsSame = false;
		  $scope.isOldPasswordError = false;
		  $scope.isOtherError = false;
	  }
	  
	  $scope.initMenuLeft = function(){
		  $scope.isMutilApp = false;
		  $scope.hasTenantFlag = false;
		  var $mainFrame  = $('#main-frame', parent.document);
		  if($mainFrame.length > 0){
			  var appNum = $mainFrame.attr("appNum");
			  if(appNum && appNum > 1){
				  $scope.isMutilApp = true;
			  }
			  var hasTenantFlag = $mainFrame.attr("hasTenantFlag");
			  if(hasTenantFlag == 'true'){
				  $scope.hasTenantFlag = true;
			  }
		  }
	  }
	  
	  $scope.init = function(){
		  $scope.initMenuLeft();
		  $scope.accountName = appConfig.user.name;
		  $scope.accountEmail = appConfig.user.email;
	  }
	  $scope.init();
  }]);

  angularAMD.directive('accordionMenu', function () {
    return {
      restrict: 'A',
      controller: 'AccordionMenuController',
      templateUrl: 'html/common/accordion.html'
    };
  });
});
