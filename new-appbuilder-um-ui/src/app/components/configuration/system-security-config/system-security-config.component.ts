import { Component, OnInit } from '@angular/core';
import { SystemSecurityConfigService } from './system-security-config.service';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-system-security-config',
    templateUrl: './system-security-config.component.html',
    styleUrls: ['./system-security-config.component.css'],
    providers: [SystemSecurityConfigService]
})
export class SystemSecurityConfigComponent implements OnInit {

    configInfo: any = {};                       // 安全配置信息
    errorInfo: any = {};                        // 错误信息

    constructor(
        private systemSecurityConfigService: SystemSecurityConfigService,
        private nzNotificationService: NzNotificationService
    ) { }

    ngOnInit() {
        this.getConfig();
    }

    /**
     * 获取配置
     */
    getConfig() {
        this.systemSecurityConfigService.getSystemSecurityConfig().then(response => {
            if (response['success']) {
                this.configInfo = response['data'];
                this.configInfo['openOperLog'] = response['data']['openOperLog'] ? true : false;
            }
        });
    }

    /**
     * 保存配置
     */
    saveConfig() {
        if(!this.changeLoginFailTimes() || !this.changeSessionTimeout()){
            return ;
        }
        let param = {
            loginFailTimes: this.configInfo['loginFailTimes'],
            sessionTimeout: this.configInfo['sessionTimeout'],
            openOperLog: this.configInfo['openOperLog'] ? 1 : 0,
        }
        this.systemSecurityConfigService.saveSystemSecurityConfig(param).then(response => {
            if (!response['success']) {
                this.nzNotificationService.error("失败", response['msg']);
            } else {
                this.nzNotificationService.success("成功", response['msg']);
            }
        });
    }

    /**
     * 校验登录鉴别次数
     * @param event 
     */
    changeLoginFailTimes(event?: Event) {
        if (!this.configInfo['loginFailTimes']) {
            this.errorInfo.loginFailTimesError = true;
            this.errorInfo.loginFailTimesErrorInfo = "请输入登录鉴别次数";
            return false;
        } else {
            this.errorInfo.loginFailTimesError = false;
            return true;
        }
    }

    /**
     * 校验会话超时时间
     * @param event 
     */
    changeSessionTimeout(event?: Event) {
        if (!this.configInfo['sessionTimeout']) {
            this.errorInfo.sessionTimeoutError = true;
            this.errorInfo.sessionTimeoutErrorInfo = "请输入会话超时时间";
            return false;
        } else {
            this.errorInfo.sessionTimeoutError = false;
            return true;
        }
    }

}
