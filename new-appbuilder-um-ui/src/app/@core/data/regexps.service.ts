import { Injectable } from '@angular/core';

@Injectable()
export class RegexpSService {

    // 邮箱校验
    private email: RegExp = new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/);

    // 字母数字下划线校验
    private generalstr: RegExp = new RegExp(/^[0-9a-zA-Z_]{1,}$/);

    // 密码校验（字母加数字至少6位）
    private password: RegExp = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/);

    // 密码校验（密码只支持字母、数字、英文符号，不能输入空格，必须至少包含1个数字及1个字符）
    private enterpassword: RegExp = new RegExp(/^\s*[\S]*[0-9]+[\S]*$/)

    // 小于6位整数
    private pwd: RegExp = new RegExp(/^\s*\d{1,6}\s*$/);

    // 编码校验规则
    private code: RegExp = new RegExp(/^[0-9a-zA-Z]{2,50}$/);

    // 名称校验规则
    private name: RegExp = new RegExp(/^[a-zA-Z\d\u4e00-\u9fa5\-\_\&\s]{2,100}$/);

    // 域名校验规则
    private domainurl: RegExp = new RegExp(/^((ht|f)tps?):\/\/[\w]+((\.[\w\-]+)*)+([\w\?=&:\/\#\-]*)$/);

    // 版本校验规则
    private version: RegExp = new RegExp(/([0-9a-zA-Z\.\_]){3,50}$/);

    // url校验规则
    private url: RegExp = new RegExp(/^[a-zA-Z\d\-\_\&\:\/\?\=\#\{\}\.]{2,256}$/);

    // uri校验规则
    private uri: RegExp = new RegExp(/^[a-zA-Z\d\-\_\&\:\/\?\=\#\{\}\.]{2,100}$/);

    // 严格的uri校验规则
    private urlStrict: RegExp = new RegExp(/^((ht|f)tps?):\/\/[\w]+((\.[\w\-]+)*)+([\w\?=&:\/\#\{\}]*)$/);

    constructor() {
    }

    // TODO: observables
    getEmail(): RegExp {
        return this.email;
    }

    getGeneralstr() {
        return this.generalstr;
    }

    getPassword() {
        return this.password;
    }

    getPwd() {
        return this.pwd;
    }

    getCode() {
        return this.code;
    }

    getName() {
        return this.name;
    }

    getDomainUrl() {
        return this.domainurl;
    }
    getVersion() {
        return this.version;
    }

    getUrl() {
        return this.url;
    }

    getUri() {
        return this.uri;
    }

    getUurlStrict() {
        return this.urlStrict;
    }

    getenterpassword() {
        return this.enterpassword
    }

}
