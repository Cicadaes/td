import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../main.service';
// import { datasourceRestapiTestComponent } from '../datasource-restapi-test/datasource-restapi-test.component';
import { DatasourceCreateService } from './datasource-create.service';

import { StoreModule, Store } from 'ng-cosmos-td-common';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { dictionary } from '../../../../config/config.dictionary';

@Component({
    selector: 'datasource-create',
    templateUrl: './datasource-create.component.html',
    styleUrls: ['./datasource-create.component.less'],
    providers: [FormBuilder]
})
export class DatasourceCreateComponent implements OnInit {

    datasourceName: string = "";//数据源名称

    title: Array<any>;
    datasourceTypeList: any;//// 数据源类型
    singledom: any = "JDBC";
    single: any;
    versions: any;//ES版本号
    versionNumber: any;//版本号默认
    version = 1;
    value: any;
    dataorigin: any;//数据源
    regular: any = {};
    response: any;
    state: boolean;
    dataURLprefix: any;
    url: any;
    // @ViewChild(datasourceRestapiTestComponent)
    // private create: datasourceRestapiTestComponent;
    validateForm: FormGroup;
    validateForm1: FormGroup;
    validateForm2: FormGroup;
    validateForm3: FormGroup;
    sure: boolean = true;
    controlArray: Array<any> = [];
    disabled: boolean;
    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }
    getFormControl1(name: any) {
        return this.validateForm1.controls[name];
    }
    getFormControl2(name: any) {
        return this.validateForm2.controls[name];
    }
    getFormControl3(name: any) {
        return this.validateForm3.controls[name];
    }
    constructor(
        private _message: CmNotificationService,
        private store: Store<{ formValidator: any }>,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private mainService: MainService,
        private datasourceCreateService: DatasourceCreateService,
    ) {
        this.state = true;
        this.single = "JDBC";
        this.singledom = "JDBC";
        this.datasourceTypeList = dictionary.dataSourceType;
        this.versions = dictionary.versionES;
        store.select('formValidator').subscribe((data: any) => {
            this.regular = data;
        });

        this.title = this.route.snapshot.data['title'];
        if (this.route.snapshot.params.id !== undefined) {
            this.title[1]['url'] = `datasource/detail/${this.route.snapshot.params.id}`;
            this.title[2]['url'] = `datasource/${this.route.snapshot.url[0]['path']}/${this.route.snapshot.params.id}`;
        } else {
            this.title[1]['url'] = `datasource/${this.route.snapshot.url[0]['path']}`;
        }//面包屑

        this.disabled = false;
        this.dataURLprefix = "http://";
        this.validateForm = this.fb.group({
            datasourceName: ['', [Validators.required, this.folderNameAsyncValidator]],
            datasourceType: ['JDBC', [Validators.required]],
            state: ['true', [Validators.required]],
            datasourceMatter: [''],
            //  "JDBC"
            dataIP: ['', [Validators.required, this.folderIpAsyncValidator]],
            databaseName: ['', [Validators.required, this.folderdatabaseNameAsyncValidator]],
            port: ['', [Validators.required, this.folderportAsyncValidator]],
            userName: ['', [Validators.required, this.folderusernameAsyncValidator]],
            password: ['', [Validators.required]],
        });
        this.validateForm1 = this.fb.group({
            datasourceName: ['', [Validators.required, this.folderNameAsyncValidator]],
            datasourceType: ['RESTAPI', [Validators.required]],
            state: ['true', [Validators.required]],
            datasourceMatter: [''],
            // res
            dataURLres: ['', [Validators.required]],
            dataURLprefix: ['http://']
        });
        this.validateForm2 = this.fb.group({
            datasourceName: ['', [Validators.required, this.folderNameAsyncValidator]],
            datasourceType: ['ELASTICSEARCH', [Validators.required]],
            state: ['true', [Validators.required]],
            datasourceMatter: [''],
            //ELASTICSEARCH
            versionNumber: ['1', [Validators.required]],
            dataURL: ['', [Validators.required]],
            dataURLprefix: ['http://']
        });
        this.validateForm3 = this.fb.group({
            datasourceName: ['', [Validators.required, this.folderNameAsyncValidator]],
            datasourceType: ['SPARK', [Validators.required]],
            state: ['true', [Validators.required]],
            datasourceMatter: [''],
            //  "SPARK"
            dataIP: ['', [Validators.required, this.folderIpAsyncValidator]],
            databaseName: ['', [Validators.required, this.folderdatabaseNameAsyncValidator]],
            databasewarehouse: ['', [Validators.required]],
            port: ['', [Validators.required, this.folderportAsyncValidator]],
            userName: ['', [Validators.required, this.folderusernameAsyncValidator]],
            password: ['', [Validators.required]],
        });
        if (this.route.snapshot.params.id !== undefined) {
            this.disabled = true;
            this.datasourceCreateService.get(this.route.snapshot.params.id).then((response: any) => {
                this.singledom = response.type
                this.single = response.type;
                this.versionNumber = response.version;
                if (this.singledom !== "JDBC" && this.singledom !== "SPARK" && response.url !== null) {
                    this.url = response.url.split('//');
                } else {
                    this.url = [undefined, undefined];
                }
                this.datasourceName = response.name;
                this.validateForm = this.fb.group({
                    datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                    datasourceType: ['JDBC', [Validators.required]],
                    state: ['true', [Validators.required]],
                    datasourceMatter: [response.description],
                    //  "JDBC"
                    dataIP: [response.host, [Validators.required, this.folderIpAsyncValidator]],
                    databaseName: [response.database, [Validators.required, this.folderdatabaseNameAsyncValidator]],
                    port: [response.port, [Validators.required, this.folderportAsyncValidator]],
                    userName: [response.userName, [Validators.required, this.folderusernameAsyncValidator]],
                    password: ["*********", [Validators.required]],
                });
                this.validateForm1 = this.fb.group({
                    datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                    datasourceType: ['RESTAPI', [Validators.required]],
                    state: ['true', [Validators.required]],
                    datasourceMatter: [response.description],
                    // res
                    dataURLres: [this.url[1] == undefined ? undefined : this.url[1], [Validators.required]],
                    dataURLprefix: [this.url[0] == undefined ? undefined : this.url[0] + "//"],
                });
                this.validateForm2 = this.fb.group({
                    datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                    datasourceType: ['ELASTICSEARCH', [Validators.required]],
                    state: ['true', [Validators.required]],
                    datasourceMatter: [response.description],
                    //ELASTICSEARCH
                    versionNumber: [this.versions[0], [Validators.required]],
                    dataURL: [this.url[1] == undefined ? undefined : this.url[1], [Validators.required]],
                    dataURLprefix: [this.url[0] == undefined ? undefined : this.url[0] + "//"]
                });
                this.validateForm3 = this.fb.group({
                    datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                    datasourceType: ['SPARK', [Validators.required]],
                    state: ['true', [Validators.required]],
                    datasourceMatter: [response.description],
                    //  "SPARK"
                    dataIP: [response.host, [Validators.required, this.folderIpAsyncValidator]],
                    databaseName: [response.database, [Validators.required, this.folderdatabaseNameAsyncValidator]],
                    databasewarehouse: [response.sparkDatabase, [Validators.required]],
                    port: [response.port, [Validators.required, this.folderportAsyncValidator]],
                    userName: [response.userName, [Validators.required, this.folderusernameAsyncValidator]],
                    password: ["*********", [Validators.required]],
                });
            }).catch((err: any) => {
                // this._message.error("错误", err);
            });
        }//初始化
    }
    backtrack() {
        history.back()
    }//路由返回
    selectedChange(single: any) {
        if (single) {
            this.singledom = single;
        }
    };//下拉框
    submitForm = function ($event: any, value: any) {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
    };
    submitForm1 = function ($event: any, value: any) {
        $event.preventDefault();
        for (const key in this.validateForm1.controls) {
            this.validateForm1.controls[key].markAsDirty();

        }
    };
    submitForm2 = function ($event: any, value: any) {
        $event.preventDefault();
        for (const key in this.validateForm2.controls) {
            this.validateForm2.controls[key].markAsDirty();
        }
    };
    submitForm3 = function ($event: any, value: any) {
        $event.preventDefault();
        for (const key in this.validateForm3.controls) {
            this.validateForm3.controls[key].markAsDirty();
        }
    };
    folderNameAsyncValidator = (control: FormControl): any => {
        const FOLDERname_REGEXP = new RegExp(this.regular.name.regexp);
        if (!control.value) {
            return { required: true };
        } else if (FOLDERname_REGEXP.test(control.value) && control.value.length >= 2) {
            return { duplicated: true }
        } else if (control.value.length < 2) {
            return { lengthInfo: true }
        }
    };//数据源名称
    folderIpAsyncValidator = (control: FormControl): any => {
        const FOLDERip_REGEXP = new RegExp(this.regular.ip.regexp);
        if (!control.value) {
            return { required: true }
        } else if (!FOLDERip_REGEXP.test(control.value) && control.value.length >= 4) {
            return { duplicated: true };
        } else if (control.value.length <= 3) {
            return { lengthInfo: true }
        }
    };//主机ip
    folderportAsyncValidator = (control: FormControl): any => {
        const FOLDERport_REGEXP = new RegExp(this.regular.port.regexp);
        if (!control.value) {
            return { required: true };
        } else if (!FOLDERport_REGEXP.test(control.value) && control.value.length >= 2) {
            return { duplicated: true, };
        } else if (control.value.length < 2) {
            return { lengthInfo: true };
        }
    };//端口号
    folderdatabaseNameAsyncValidator = (control: FormControl): any => {
        const FOLDERname_REGEXP = new RegExp(this.regular.name.regexp);
        if (!control.value) {
            return { required: true };
        } else if (FOLDERname_REGEXP.test(control.value) && control.value.length >= 2) {
            return { duplicated: true }
        } else if (control.value.length < 2) {
            return { lengthInfo: true }
        }
    };//数据库名称
    folderusernameAsyncValidator = (control: FormControl): any => {
        const FOLDERname_REGEXP = new RegExp(this.regular.name.regexp);
        if (!control.value) {
            return { required: true };
        } else if (FOLDERname_REGEXP.test(control.value) && control.value.length >= 2) {
            return { duplicated: true }
        } else if (control.value.length < 2) {
            return { lengthInfo: true }
        }
    };//用户名
    folderdataURLresAsyncValidator = (control: FormControl): any => {
        const FOLDERurl_REGEXP = new RegExp(this.regular.url.regexp);
        if (!control.value) {
            return { required: true }
        } else if (!FOLDERurl_REGEXP.test(control.value)) {
            return { duplicated: true };
        } else if (FOLDERurl_REGEXP.test(control.value) && control.value.length <= 10 && control.value.length > 0) {
            return { lengthInfo: true };
        }
    };//RESurl
    folderdataURLAsyncValidator = (control: FormControl): any => {
        const FOLDERurl_REGEXP = new RegExp(this.regular.url.regexp);
        if (!control.value) {
            return { required: true }
        } else if (!FOLDERurl_REGEXP.test(control.value)) {
            return { duplicated: true };
        } else if (FOLDERurl_REGEXP.test(control.value) && control.value.length <= 10 && control.value.length > 0) {
            return { lengthInfo: true };
        }
    };//ELAurl
    folderpasswordAsyncValidator = (control: FormControl): any => {
        const FOLDERpassword_REGEXP = new RegExp(this.regular.url.regexp);
        if (!control.value) {
            return { required: true }
        } else if (control.value.length >= 6 && FOLDERpassword_REGEXP.test(control.value)) {
            return { duplicated: true };
        } else if (control.value.length < 6) {
            return { lengthInfo: true }
        }

    };//password
    testTheConnection() {
        let value = this.validateForm.value;
        let value1 = this.validateForm1.value;
        let value2 = this.validateForm2.value;
        let value3 = this.validateForm3.value;
        let obj: Object;
        if (this.singledom == "ELASTICSEARCH") {
            obj = {
                "name": value2.datasourceName,
                "type": value2.datasourceType,
                "version": value2.versionNumber,
                "url": value2.dataURLprefix + value2.dataURL,
                "status": value2.state,
                "description": value2.datasourceMatter
            }
        }
        if (this.singledom == "JDBC") {
            obj = {
                "name": value.datasourceName,
                "type": value.datasourceType,
                "host": value.dataIP,
                "port": value.port,
                "userName": value.userName,
                "password": value.password == "*********" ? null : value.password,
                "database": value.databaseName,
                "status": value.state,
                "description": value.datasourceMatter
            }
        }
        if (this.singledom == "RESTAPI") {
            obj = {
                "name": value1.datasourceName,
                "type": value1.datasourceType,
                "url": value1.dataURLprefix + value1.dataURLres,
                "description": value1.datasourceMatter,
                "status": value1.state
            }
        }
        if (this.singledom == "SPARK") {
            obj = {
                "name": value3.datasourceName,
                "type": value3.datasourceType,
                "host": value3.dataIP,
                "port": value3.port,
                "userName": value3.userName,
                "password": value3.password == "*********" ? null : value3.password,
                "database": value3.databaseName,
                // 
                "status": value3.state,
                "description": value3.datasourceMatter,
                "sparkDatabase": value3.databasewarehouse
            }
        }
        if (this.route.snapshot.params.id !== undefined) {
            obj["id"] = this.route.snapshot.params.id;
            this.datasourceCreateService.test(obj).then(response => {
                if (response.success) {
                    return this._message.success(response.msg, "", this.datasourceCreateService.msg['notification']['success'])
                } else {
                    return this._message.error(response.msg, "", this.datasourceCreateService.msg['notification']['error'])
                }
            }).catch((err: any) => {
                // this._message.error("错误", err);
            });
        } else {
            obj["id"] = null;
            this.datasourceCreateService.test(obj).then(response => {
                if (response.success) {
                    return this._message.success(response.msg, "", this.datasourceCreateService.msg['notification']['success'])
                } else {
                    return this._message.error(response.msg, "", this.datasourceCreateService.msg['notification']['error'])
                }
            }).catch((err: any) => {
                // this._message.error("错误", err);
            });
        }
    }//测试点击
    handleCancelMiddle() {
        if (this.singledom == "JDBC") {
            this.validateForm.reset();
            setTimeout(() => {
                this.single = "JDBC";
                this.state = true;
                if (this.route.snapshot.params.id !== undefined) {
                    this.datasourceCreateService.get(this.route.snapshot.params.id).then((response: any) => {
                        this.single = response.type;
                        this.validateForm = this.fb.group({
                            datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                            datasourceType: ['JDBC', [Validators.required]],
                            state: ['true', [Validators.required]],
                            datasourceMatter: [response.description],
                            //  "JDBC"
                            dataIP: [response.host, [Validators.required, this.folderIpAsyncValidator]],
                            databaseName: [response.database, [Validators.required, this.folderdatabaseNameAsyncValidator]],
                            port: [response.port, [Validators.required, this.folderportAsyncValidator]],
                            userName: [response.userName, [Validators.required, this.folderusernameAsyncValidator]],
                            password: ['******', [Validators.required, this.folderpasswordAsyncValidator]],
                        });
                    }).catch((err: any) => {
                        // this._message.error("错误", err);
                    });
                }
            }, 0);
        }
        if (this.singledom == "SPARK") {
            this.validateForm3.reset();
            setTimeout(() => {
                this.single = "SPARK";
                this.state = true;
                if (this.route.snapshot.params.id !== undefined) {
                    this.datasourceCreateService.get(this.route.snapshot.params.id).then((response: any) => {
                        this.single = response.type;
                        this.validateForm3 = this.fb.group({
                            datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                            datasourceType: ['SPARK', [Validators.required]],
                            state: ['true', [Validators.required]],
                            datasourceMatter: [response.description],
                            //  "SPARK"
                            dataIP: [response.host, [Validators.required, this.folderIpAsyncValidator]],
                            databaseName: [response.database, [Validators.required, this.folderdatabaseNameAsyncValidator]],
                            databasewarehouse: [response.database, [Validators.required]],
                            port: [response.port, [Validators.required, this.folderportAsyncValidator]],
                            userName: [response.userName, [Validators.required, this.folderusernameAsyncValidator]],
                            password: ['******', [Validators.required, this.folderpasswordAsyncValidator]],
                        });
                    }).catch((err: any) => {
                        // this._message.error("错误", err);
                    });
                }
            }, 0);
        }
        if (this.singledom == "ELASTICSEARCH") {
            this.validateForm2.reset();
            setTimeout(() => {
                this.single = "ELASTICSEARCH";
                this.state = true;
                if (this.route.snapshot.params.id !== undefined) {
                    this.datasourceCreateService.get(this.route.snapshot.params.id).then((response: any) => {
                        this.single = response.type;
                        this.versionNumber = response.version;
                        this.validateForm2 = this.fb.group({
                            datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                            datasourceType: ['ELASTICSEARCH', [Validators.required]],
                            state: ['true', [Validators.required]],
                            datasourceMatter: [response.description],
                            //ELASTICSEARCH
                            versionNumber: [this.versions[0], [Validators.required]],
                            dataURL: [response.url, [Validators.required]]

                        });
                    }).catch((err: any) => {
                        // this._message.error("错误", err);
                    });
                }
            }, 0);
        }
        if (this.singledom == "RESTAPI") {
            this.validateForm1.reset();
            setTimeout(() => {
                this.single = "RESTAPI";
                this.state = true;
                if (this.route.snapshot.params.id !== undefined) {
                    this.datasourceCreateService.get(this.route.snapshot.params.id).then((response: any) => {
                        this.single = response.type;
                        this.validateForm1 = this.fb.group({
                            datasourceName: [response.name, [Validators.required, this.folderNameAsyncValidator]],
                            datasourceType: ['RESTAPI', [Validators.required]],
                            state: ['true', [Validators.required]],
                            datasourceMatter: [response.description],
                            // res
                            dataURLres: [response.url, [Validators.required]],
                        });

                    }).catch((err: any) => {
                        // this._message.error("错误", err);
                    });
                }
            }, 0);
        }
    };//重置
    saveTheDataSource(sure: any) {
        this.datasourceCreateService.hasSaved = true;
        let value = this.validateForm.value;
        let value1 = this.validateForm1.value;
        let value2 = this.validateForm2.value;
        let value3 = this.validateForm3.value;
        let objsure: Object;
        if (this.singledom == "ELASTICSEARCH") {
            objsure = {
                "name": value2.datasourceName,
                "type": value2.datasourceType,
                "url": value2.dataURLprefix + value2.dataURL,
                "version": value2.versionNumber,
                "status": value2.state ? 1 : 0,
                "description": value2.datasourceMatter
            }
        }
        if (this.singledom == "JDBC") {
            objsure = {
                "name": value.datasourceName,
                "type": value.datasourceType,
                "host": value.dataIP,
                "port": value.port,
                "userName": value.userName,
                "password": value.password == "*********" ? null : value.password,
                // "password": value.password,
                "database": value.databaseName,
                "status": value.state ? 1 : 0,
                "description": value.datasourceMatter
            }
        }
        if (this.singledom == "RESTAPI") {
            objsure = {
                "name": value1.datasourceName,
                "type": value1.datasourceType,
                "url": value2.dataURLprefix + value1.dataURLres,
                "status": value1.state ? 1 : 0,
                "description": value1.datasourceMatter
            }
        }
        if (this.singledom == "SPARK") {
            objsure = {
                "name": value3.datasourceName,
                "type": value3.datasourceType,
                "host": value3.dataIP,
                "port": value3.port,
                "userName": value3.userName,
                "password": value3.password == "*********" ? null : value3.password,
                // "password": value.password,
                "database": value3.databaseName,
                //
                "sparkDatabase": value3.databasewarehouse,
                "status": value3.state ? 1 : 0,
                "description": value3.datasourceMatter
            }
        }
        if (this.route.snapshot.params.id !== undefined) {
            objsure["id"] = this.route.snapshot.params.id;
            this.datasourceCreateService.update(objsure).then(response => {
                if (JSON.parse(response._body).success) {
                    this.router.navigate(['/main/datasource/detail', this.route.snapshot.params.id]);
                    return this._message.success(JSON.parse(response._body).msg, "", this.datasourceCreateService.msg['notification']['success']);
                } else {
                    return this._message.error(JSON.parse(response._body).msg, "", this.datasourceCreateService.msg['notification']['error'])
                }

            }).catch((err: any) => {
                // this._message.error("错误", err);
            });
        } else {
            this.datasourceCreateService.create(objsure).then(response => {
                if (response.success) {
                    this.router.navigate(['/main/datasource']);
                    return this._message.success(response.msg, "", this.datasourceCreateService.msg['notification']['success'])
                } else {
                    return this._message.error(response.msg, "", this.datasourceCreateService.msg['notification']['error'])
                }
            }).catch((err: any) => {
                // this._message.error("错误", err);
            });
        }
    }//增加数据源//修改数据源
    ngOnInit() {
        this.changeTitle(this.title);
    }//初始化

    changeTitle(title: Array<any>) {
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }
}