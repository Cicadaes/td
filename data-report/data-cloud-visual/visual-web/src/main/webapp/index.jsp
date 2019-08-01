<%@ page language="java" pageEncoding="UTF-8"%>
<!doctype html>
<html >
<head>
  <meta charset="utf-8">
  <title>证券指标</title>
  <meta name="description" content="">
  <meta http-equiv="Access-Control-Allow-Origin" content="*">
  <meta name="viewport" content="width=device-width">
  <link rel="shortcut icon" type="image/x-icon" href="/enterprise/images/app/common/corner-maik.png" media="screen" />
  <style type="text/css">
  	.ng-hide{display:none;}
  </style>
  <script>
	<%--var appConfig = ${appConfig};--%>
    var appConfig = {"authAppList":[{"rid":66,"appCode":"DMP","appName":"用户管家","appDesc":"精准人群标签助力优化投放和营销效果","appToken":"e10adc3949ba59abbe56e057f20f883e","appRolePrefix":"DMP","extAttr1":"1","extAttr2":"/dmp-web","extAttr3":"1","status":0,"createTime":null,"updateTime":null,"opUmid":null},{"rid":122,"appCode":"sample-data-app","appName":"活动投放管理","appDesc":"","appToken":"17b97b2ae5266f687e93a65220dd79e6","appRolePrefix":"sample-data-app","extAttr1":"活动投放管理","extAttr2":"/sampledataapp","extAttr3":"1","status":0,"createTime":null,"updateTime":null,"opUmid":"dmpadmin"}],"tenant":{"rid":2000000,"caName":"租户公司演示","caCode":"zhgsys580","caShortName":"租户演示","phone":"123456","fax":"","status":0,"contractStartDate":1463760000000,"contractEndDate":1463760000000,"createTime":null,"updateTime":null,"opUmid":"UMAdmin","adminName":"租户管理员","adminEmail":"admin@tendcloud.com","adminPhone":"123456"},"accreditUser":null,"authList":[],"menuList":[],"dmp.theme.login.logo":"","dmp.theme.copy.right.text":"TalkingData@2011-2017","dmp.theme.app.menu.logo":"http://medemo.tenddata.com/theme/20170217200813/C235C5A3B10C4C3D8B5E676F10D12ADB.png","changePwdFlag":null,"user":{"umid":"dmpadmin","userName":"DMP管理员","loginName":"dmpadmin","name":"DMP管理员","userPassword":null,"userDesc":"DMP管理员","gender":null,"birthday":null,"email":"dmpadmin@163.com","telphone":null,"mobile":null,"title":null,"departmentId":"2000152","departmentName":null,"status":"0","partnerFullName":null,"id":null,"tenantId":2000000,"proxyUmid":null,"tenantAdmin":false},"dmp.theme.app.nav.logo":"http://medemo.tenddata.com/theme/20170217200800/72A23216786D4BF898C1BE15D6E604A5.png","buttonList":[]};
    buildAppVersion();
    window.load = function(){
        document.getElementById('密码域ID').value='';
    };
    function buildAppVersion(){
        appConfig.appVersion = appConfig.appVersion || 201702091130;
    }
  </script>
  <script data-main="js/main.js" src="/enterprise/js/libs/require.js"></script>
</head>
<body style="padding: 0;">

<div class="contents">
	<div class="clrfix">
		<!-- <div data-accordion-menu role="accordion" ng-show="showAccordMenu" class="menu-left-root"></div> -->
		<div class="con-box" ng-class="{showAccordMenu:showAccordMenu}">
			<div class="content" id="content" style="background: #FFF;">
				<div class="alteration" style="min-height: 500px;" data-ui-view></div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
