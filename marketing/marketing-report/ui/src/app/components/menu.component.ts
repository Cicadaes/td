import { Component, HostListener } from '@angular/core';
import * as $ from "jquery";
import { AuthResourceService } from './../services/admin/auth.resource.service';
import { CampaignDetailDataCommunication } from '../services/communication/campaign-detail-data.communication.service';
import { ErrorHandlingService } from "../services/exceptional/error-handling.service";

@Component({
    selector: 'my-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.css'],
    providers: [AuthResourceService, ErrorHandlingService]
})
export class MenuComponent {

    defaultUrl: any;
    private userName: string;
    private display: boolean = false;
    private passwordData: string = "";//原始密码
    private userpassword: string = "";//新密码
    private userpasswordTrue: string = "";//再次新密码
    private userTips: any;
    errorPrompt: any = {};
    loginUser: any = {};

    hashTenant: boolean = false;//是否有权限管理
    appCode: string = "marketing";//营销管家的appCode
    authAppList: any;//应用列表
    appConfig: any = {
        appCode : "marketing"
    }

    constructor(
        private authResourceService: AuthResourceService,
        private errorHandlingService: ErrorHandlingService
    ) {
        let that = this;
        that.authResourceService.config().then((data: any) => {
            that.defaultUrl = data.dmpDefaultUrl;
        })
        // if (process.env.ENV == "developer") {
        //     that.defaultUrl = 'http://172.23.5.128';
        // } else if (process.env.ENV == "production") {
        //     that.defaultUrl = 'http://medemo.tenddata.com';  //demo环境
        // } else if (process.env.ENV == "test") {
        //     that.defaultUrl = 'http://172.23.5.83';     //测试环境  
        // }
    }

    ngOnInit(){
        let that = this;
        that.getUserInfo();
        that.getAppList();
    }

    ngAfterViewInit(){
        let that = this;
        setTimeout(function(){
            that.bindEvents()
        },500);
    }

    //获取用户详情
    getUserInfo(){
        let that = this;
        that.authResourceService.getUserInfo().then(data => {
            if ((data.retCode || data.msgDes)) {
                let error = that.errorHandlingService.getMsg(data);
                if (error.code === 1) {
                    //TODO 错误处理 右上角
                } else if (error.code === 2) {
                    //TODO 错误处理 页面中
                }
                return;
            }
            that.loginUser = data;
        }).catch(err => {});
    }

    //获取app列表
    getAppList(){
        let that = this;
        that.authResourceService.getAppList().then(data => {
            if ((data.retCode || data.msgDes)) {
                let error = that.errorHandlingService.getMsg(data);
                if (error.code === 1) {
                    //TODO 错误处理 右上角
                } else if (error.code === 2) {
                    //TODO 错误处理 页面中
                }
                return;
            }
            that.authAppList = data;
            that.showNav(data);
            that.calculateConentsHeight();
        }).catch(err => {});
    }

    //计算APP列表的高度
    calculateConentsHeight(){
        var winHg = $(window).height();
        var navHg = winHg - 160 + 2;//160是菜单栏上面的返回主页和下面的账户管理    2是
        $("#nav-bar").css({"max-height":navHg + "px","overflow-y":"scroll"});
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.calculateConentsHeight();
    }

    //记录权限管理相关
    showNav(authAppList: any){
        let that = this;
        for (let i = 0; i < authAppList.length; i++) {
            if("tenant" == authAppList[i].appCode){//tenant是权限管理的appCode
                that.hashTenant = true;
            }
        }
    }

    //菜单点击
    goApp(event: any,data: any){
        let that = this;
        let $li = $(event.target);
        let appCode = data.appCode;
        // that.appConfig.appCode = appCode;
        let appHrefTarget = that.getAppHrefTarget(appCode);
        if(appHrefTarget.target == '_blank'){
            window.open(appHrefTarget.href);
        }else if(appHrefTarget.target == '_self'){
            $li.addClass("active").siblings().removeClass("active");
            window.location.href = appHrefTarget.href;
        }else{
            $li.addClass("active").siblings().removeClass("active");
            window.location.href = that.defaultUrl + "/enterprise/#" + appCode;
        }
    }

    //给菜单的选项绑定上事件
    bindEvents() {
        let that = this;
        let $nav_bar = $("#nav-bar");
        $nav_bar.find(".li").bind('mouseenter', function() {
            let $li = $(this);
            let $nav_name = $li.find(".nav-name");
            let scrollTop = $("body").scrollTop();
            let top = $li.find("a").offset().top - scrollTop;
            let nav_name = $nav_name.html();
            let $app_tip = $("#enterprise-contents .app-tip");
            $app_tip.html(nav_name).show().css({"top":top+'px'});
        }).bind('mouseleave', function() {
            let $app_tip = $("#enterprise-contents .app-tip");
            $app_tip.hide();
        });
    }
    
    //根据APPcode获取APP
    getAppByAppCode(appCode:any){
        let that = this;
        var app = {};
        if(appCode && that.appConfig && that.authAppList && that.authAppList.length > 0){
            var authAppList = that.authAppList;
            for(var i = 0;i < authAppList.length;i++){
                if(appCode == authAppList[i].appCode){
                    app = authAppList[i];
                    break;
                }
            }
        }
        return app;
    }

    //获取url
    getAppHrefTarget(appCode: any){
        let that = this;
        var app = that.getAppByAppCode(appCode);
        var appHrefContent = app["extAttr2"];
        var appHrefTarget = {
            href:'',
            target:''
        };
        if (appHrefContent) {
            try{
                var appHrefContentJson = JSON.parse(appHrefContent);
                if(appHrefContentJson && appHrefContentJson.target && appHrefContentJson.href){
                    appHrefTarget = {
                        href:appHrefContentJson.href,
                        target:appHrefContentJson.target
                    };
                }else if(appHrefContentJson && !appHrefContentJson.target && appHrefContentJson.href){
                    appHrefTarget = {
                        href:appHrefContentJson.href,
                        target:''
                    };
                }
            }catch(e){
                //alert(e);
                appHrefTarget = {
                    href:appHrefContent,
                    target:''
                };
            }
        }
        return appHrefTarget;
    }

    //返回首页
    goToProductList(){
        let that = this;
        window.location.href = that.defaultUrl + "/enterprise";
    }

    //权限管理页面
    goToRuleSystem(){
        let that = this;
        window.location.href = that.defaultUrl + "/enterprise#tenant";
    }
    
    //显示用户信息和用户操作
    showHideDropdown(target: any){
        var that = this;
        var $target = $(target);
        var $arrow = $target.find(".arrow");
        var $dropdown_ul = $target.siblings(".dropdown-ul");
        if($dropdown_ul.hasClass("hide")){
            $dropdown_ul.removeClass("hide");
            $arrow.addClass("arrow-top");
        }
        that.onBodyDown();
    }

    //显示账户管理相关弹框
    onBodyDown() {
        $("#layer-fixed").removeClass('hide');
        $("#layer-fixed").bind('click',function(){
            $("#layer-fixed").addClass('hide');
            $("#dropdown-ul").addClass("hide");
            $("#dropdown-ul2").addClass("hide");
            $("#dropdown .arrow").removeClass("arrow-top");
            $("#layer-fixed").unbind('click');
        });
    }

    //退出登陆
    logoutOneUI(){
        let that = this;
        that.authResourceService.logout().then(data => {
            window.location.href = data.redirectUrl + window.location.href;
        }).catch(erro => {});
    }

    //账户管理
    showDialog(dialogId: any) {
        this.display = true;
        this.passwordData = '';
        this.userpassword = '';
        this.userpasswordTrue = '';
        this.userTips = '';
    }

    //判断
    passwordFromData() {
        function getStringLen(_value: any) {
            var i, sum;
            sum = 0;
            for (i = 0; i < _value.length; i++) {
                if ((_value.charCodeAt(i) >= 0) && (_value.charCodeAt(i) <= 255)) {
                    sum = sum + 1;
                }
                else {
                    sum = sum + 2;
                }
            }
            return sum;
        }

        if (this.passwordData == '' || this.passwordData == '输入原始密码（6-32位）') {
            this.userTips = "原始密码不能为空";
            this.errorPrompt.pwdData = true;
            return false;
        }
        if (getStringLen(this.userpassword) < 6 || getStringLen(this.userpassword) > 32) {
            this.userTips = "密码长度需在6-32位";
            this.errorPrompt.userPwd = true;
            return false;
        }
        if (this.userpasswordTrue !== this.userpassword) {
            this.userTips = "新密码不一致请重新输入";
            this.errorPrompt.userPwdTrue = true;
            return false;
        }
        return true;
    }

    //隐藏修改密码时的错误
    iptHidden() {
        this.userTips = '';
        this.errorPrompt = {};
    }

    //确定
    confirm() {
        if (!this.passwordFromData()) {
        return;
        }

        function encode64(input: any) {
            var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
                + "wxyz0123456789+/" + "=";
            var output = "";
            var chr1, chr2, chr3: any;
            var enc1, enc2, enc3, enc4: any;
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                enc4 = 64;
                }
                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
                + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        }

        this.authResourceService.resetPassword({ oldPassword: encode64(this.passwordData), newPassword: encode64(this.userpasswordTrue) })
        .then(data => {
            // console.log(data,"修改密码返回data")
            this.display = false;
            window.location.href = data._body + window.location.href;
        }).catch(error => {
            this.errorPrompt.pwdData = true;
            this.userTips = "原始密码错误，请重新输入"
        })
    }

}