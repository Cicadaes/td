import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddTenantuserFormService } from "./add-tenantuser-form.service";
import { ActivatedRoute, Router } from "@angular/router";

// 校验相关
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { CheckRegExpppassword } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';

@Component({
    selector: 'add-tenantuser-form',
    templateUrl: './add-tenantuser-form.component.html',
    styleUrls: ['./add-tenantuser-form.component.css'],
    providers: [FormBuilder]
})

export class AddTenantUserFormComponent implements OnInit {
    @Input() needSubmit: boolean;
    @Input() user: any;
    @Input() tenantId: number;
    @Output() onSubmit = new EventEmitter<any>();
    @Input() isPage: boolean = false;
    status: boolean = false;
    gender: any;
    isInitFormValue: boolean = false;
    genderSelect: any;
    autoPassword: boolean = false;
    password_: string;
    existEmail: boolean;
    deptIds: any[];
    depts: any
    userId: number;
    deptId: number;

    validateForm: FormGroup;

    organizationSelect: any;
    emailErrorMsg: any;

    private isVisible: boolean = false  /** 控制弹窗树的显示 */
    private dialogCb: any = {   /** 弹窗的回调 */
        handleCancel: () => {
            this.isVisible = false
        }
    }
    private organizationTreeData: any = {  /** 弹窗树数据 */
        hasChecked: false,  //需要复选框
        needMenu: false  //需要菜单
    }
    private checkedOrg: string = ''   /** 当前选中的组织 */

    private emailList: any = []

    private validatorPwd: any = CheckRegExpppassword(this.regService.getenterpassword())
    private validatorEmail: any = CheckRegExp(this.regService.getEmail())

    // 刷新数据
    @Input() set _submit(_submit: EventEmitter<any>) {
        _submit && _submit.subscribe && _submit.subscribe(() => {
            this._submitForm()
        })
    }


    componentChange(value: any, fieldName: string) {
        if (this.checkHasFieldName(fieldName)) {
            if (fieldName == 'status') {
                if (value == 1) {
                    value = true;
                } else {
                    value = false;
                }
                this.status = value;
            }
            this.validateForm.controls[fieldName].setValue(value);
        }
        if (this.user) {
            this.checkAuto()
        } else {
            this.clearPasswordInput()
        }
    }

    checkHasFieldName(fieldName: string) {
        let has = false;
        for (let o in this.validateForm.controls) {
            if (fieldName && fieldName == o) {
                has = true;
                break;
            }
        }
        return has;
    }

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
        }
        if (this.validateForm.status == 'VALID') {
            this.onSubmit.emit(this.validateForm);
        }

        // setTimeout(() => {
        //   this.onSubmit.emit(this.validateForm);
        // }, 100);

    }
    constructor(private router: Router, private fb: FormBuilder, private service: AddTenantuserFormService, private route: ActivatedRoute, private regService: RegexpSService) {

    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(() => {
            this.validateForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    clearPasswordInput(e: any = 1) {
        let v = this.getFormControl('autoPassword') && this.getFormControl('autoPassword').value
        if (v) {
            this.validateForm.controls['password'].setValue('12345j');
            this.validateForm.controls['checkPassword'].setValue('12345j');
        } else {
            if (this.validateForm.controls['password'].value && this.validateForm.controls['password'].value !== '12345j') {
                this.password_ = this.validateForm.controls['password'].value;
            }
            this.validateForm.controls['password'].setValue(this.password_);
            this.validateForm.controls['checkPassword'].setValue(this.password_);
        }
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls['password'].value) {
            return { confirm: true, error: true };
        }
    };

    confirmationMobile = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else {
            if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.validateForm.controls['mobile'].value))) {
                return { required: true };
            }
        }
    };

    // confirmationEmail = (control: FormControl): { [s: string]: boolean } => {
    //   if (!control.value || !(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.validateForm.controls['email'].value))) {
    //     return { email: true };
    //   } else {
    //     let pamams = {};
    //     if (this.user) {
    //       pamams = {
    //         vid: this.user.id,
    //         vemail: control.value
    //       };
    //     } else {
    //       pamams = {
    //         vemail: control.value
    //       };
    //     }
    //     this.service.getUgUserList(pamams).then((data: any) => {
    //       if (data.total && data.total > 0) {
    //         this.existEmail = true;
    //       } else {
    //         this.existEmail = false;
    //       }
    //     })
    //   }
    // };


    checkRepeatEmail = async (control: FormControl): Promise<any> => {
        let emailRepeat: boolean = false
        let controlV = control.value
        controlV && (controlV = controlV.trim())
        if (this.tenantId) {
            return new Promise((resolve: any, reject: any) => {
                this.service.queryOneEmailById({ email: controlV, tenantId: this.tenantId }).then((data: any) => {
                    if (data.success == false) {
                        emailRepeat = true;
                        this.emailErrorMsg = data.msg;
                    } else {
                        emailRepeat = false;
                        this.emailErrorMsg = "";
                    }
                    // if (data.total && data.total > 0) {
                    //   emailRepeat = true;
                    // }
                    resolve(emailRepeat ? { 'emailRepeat': { value: control.value } } : null)
                })
            })
        } else {
            return (emailRepeat ? { 'emailRepeat': { value: control.value } } : null)
        }
    }


    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    initValidateForm() {
        if (this.validateForm) {
            return false;
        }
        if (this.user) {
            this.validateForm = this.fb.group({
                id: [null],
                // email: [null, [Validators.email, this.confirmationEmail]],
                email: [null, [Validators.required, this.validatorEmail, Validators.maxLength(256)], [this.checkRepeatEmail]],
                autoPassword2: [true],
                editAutoPwd: [false],
                name: [null, [Validators.required, Validators.maxLength(256)]],
                mobile: [null, [Validators.required, this.confirmationMobile]],
                password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), this.validatorPwd]],
                checkPassword: [null, [Validators.required, this.confirmationValidator]],
                phone: [null, [Validators.maxLength(50), this.checkedPhone]],
                wechat: [null, [this.checkedWechat]],
                title: [null, [Validators.maxLength(50), this.checkedtitle]],
                qq: [null, [this.checkedQq]],
                gender: [0],
                status: [true],
                deptId: [null],
                deptIdLabel: [null]
            });
        } else {
            this.validateForm = this.fb.group({
                id: [null],
                // email: [null, [Validators.email, this.confirmationEmail]],
                email: [null, [Validators.required, this.validatorEmail], [this.checkRepeatEmail]],
                password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), this.validatorPwd]],
                checkPassword: [null, [Validators.required, this.confirmationValidator]],
                autoPassword: [true, []],
                name: [null, [Validators.required]],
                mobile: [null, [Validators.required, this.confirmationMobile]],
                phone: [null, [Validators.maxLength(50), this.checkedPhone]],
                wechat: [null, [Validators.maxLength(50), this.checkedWechat]],
                title: [null],
                qq: [null, [Validators.maxLength(50), this.checkedQq]],
                gender: [0],
                status: [true],
                deptId: [null],
                deptIdLabel: [null]
            });
        }
        this.checkAuto()
    }

    // 校验是不是电话号码
    checkedPhone = (control: FormControl): { [key: string]: any } => {
        let phoneError = false;
        const controlV = control.value;
        const reg = /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{7,8}$)|(^[1][3,4,5,7,8][0-9]{9}$)/;
        if (reg.test(controlV)) {
            phoneError = false;
        } else if (!reg.test(controlV)) {
            phoneError = true;
        }
        if (controlV == null || controlV === '' || controlV === undefined) {
            phoneError = false;
        }
        return phoneError ? { 'phoneError': { value: control.value } } : null;
    }
    // 校验职位
    checkedtitle = (control: FormControl): { [key: string]: any } => {
        let titleError = false;
        const controlV = control.value;
        const reg = /^([\u4E00-\u9FA5]|[A-Za-z]|[ ])+$/;
        if (reg.test(controlV)) {
            titleError = false;
        } else if (!reg.test(controlV)) {
            titleError = true;
        }
        if (controlV == null || controlV === '' || controlV === undefined) {
            titleError = false;
        }
        return titleError ? { 'titleError': { value: control.value } } : null;
    }

    // 校验微信号是不是正确
    checkedWechat = (control: FormControl): { [key: string]: any } => {
        let wechatError = false;
        const controlV = control.value;
        const reg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
        if (reg.test(controlV)) {
            wechatError = false;
        } else if (!reg.test(controlV)) {
            wechatError = true;
        }
        if (controlV == null || controlV === '' || controlV === undefined) {
            wechatError = false;
        }
        return wechatError ? { 'wechatError': { value: control.value } } : null;
    }

    // 校验qq号是不是正确
    checkedQq = (control: FormControl): { [key: string]: any } => {
        let qqError = false;
        const controlV = control.value;
        const reg = /^\d{5,20}$/;
        if (reg.test(controlV)) {
            qqError = false;
        } else if (!reg.test(controlV)) {
            qqError = true;
        }
        if (controlV == null || controlV === '' || controlV === undefined) {
            qqError = false;
        }
        return qqError ? { 'qqError': { value: control.value } } : null;
    }

    queryOrganizations() {
        let params = { tenantId: this.route.snapshot.params['tenantId'] }
        if (!this.user) {
            this.status = true;
            //this.autoPassword = true;
            this.clearPasswordInput();
            // this.gender = 0;
            this.service.queryOrganizations(params).then((data: any) => {
                if (data.success == 200) {
                    this.organizationSelect = {
                        apiData: false,
                        apiUrl: '',
                        apiParam: {},
                        initValue: [],
                        selectOptions: data.result
                    };
                }
            })
        } else if (this.user) {
            this.gender = this.user.gender;
            this.service.queryOrganizations(params).then((data: any) => {
                if (data.success == 200) {
                    this.organizationSelect = {
                        apiData: false,
                        apiUrl: '',
                        apiParam: {},
                        initValue: this.depts,
                        selectOptions: data.result
                    };
                }
            })
        }
    }

    ngOnInit() {
        this.getUserInfo()
        // this.getOrganization()
        this.genderSelect = {
            id: 3,
            fieldName: 'gender',
            fieldLabel: '性别',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '1',
                label: '正常'
            }, {
                value: '0',
                label: '禁用'
            }]
        };
        this.queryOrganizations();
    }

    getFormControl(name: string) {
        return this.validateForm && this.validateForm.controls && this.validateForm.controls[name]
    }

    onSelectOrganizationSelect(data: any) {
        this.deptId = data[data.length - 1];
        this.deptIds = data;
        this.validateForm.controls['deptId'].setValue(this.deptId);
    }

    initUserFormData() {
        if (this.isInitFormValue) {
            return false;
        }
        this.isInitFormValue = true;
        if (this.user) {

            for (let o in this.user) {
                this.componentChange(this.user[o], o)
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.userId = this.route.snapshot.params['id'];
        this.needSubmit = changes.needSubmit.currentValue || false;
        if (changes.user) {
            this.user = changes.user.currentValue

        }
        if (this.needSubmit) {
            this._submitForm();
        } else {
            this.initValidateForm();
            this.initUserFormData();
        }

        if (this.user) {
            if (this.userId) {
                this.initDeptDetail().then((data: any) => {
                    this.getOrganization()
                })
            }
        }
        this.queryOrganizations();
        this.getOrganization()
    }

    initDeptDetail() {
        return new Promise((resolve: any, reject: any) => {
            let pamams = { userId: this.userId }
            this.service.queryOrganization(pamams).then((data: any) => {
                if (data.success) {
                    if (data.data) {
                        this.depts = data.data
                        resolve(data.data.value)
                    }
                    reject()
                }
                reject()
            }).catch((err: any) => {
                console.log(err)
                reject()
            })
        })
    }

    checkAuto(e: any = '') {
        if (this.getFormControl('autoPassword2')) {
            if (this.getFormControl('autoPassword2').value) {
                this.validateForm.controls['password'].setValue('12345j');
                this.validateForm.controls['checkPassword'].setValue('12345j');
            } else {
                if (this.validateForm.controls['password'].value && this.validateForm.controls['password'].value !== '12345j') {
                    this.password_ = this.validateForm.controls['password'].value;
                }
                this.validateForm.controls['password'].setValue(this.password_);
                this.validateForm.controls['checkPassword'].setValue(this.password_);
            }
        }
    }


    /**
     * 获取用户
     * @return {[type]} [description]
     */
    private getUserInfo() {
        let params: any = {};
        params.page = 1
        params.rows = 1000
        params.tenantId = this.tenantId;
        params.virtualRoleType = "ORG";
        this.service.getUsers(params).then((data: any) => {
            if (data && data.list && data.list.length) {
                this.emailList = data.list.map((item: any) => {
                    return item.email
                })
            }
        })
    }


    private checkEmail(data: any) {
        let emailRepeat = false
        this.service.getUgUserList({ vemail: data }).then((data: any) => {
            if (data.total && data.total > 0) {
                emailRepeat = true
            }
            return emailRepeat
        }).catch(() => {
            return false
        })
    }


    /**
     * 组织结构的弹窗显示
     * @return {[type]} [description]
     */
    private showOrganize() {
        this.isVisible = true;
    }

    /**
     * 修改弹窗treeData的处理
     * @return {[type]} [description]
     */
    private changeTreeData(e: any) {
        if (e.data && e.data.length && e.data[0].children && e.data[0].children.length && e.select && e.select.id) {
            this.checkedOrg = this.getCheckOrg(e.select.id, e.data[0].children) || ''
            this.validateForm.controls['deptId'].setValue(e.select.id)
            this.validateForm.controls['deptIdLabel'].setValue(this.checkedOrg)
            // this.isVisible = false;
        }
    }
    private handleCancel() {
        this.validateForm.controls['deptId'].setValue('');
        this.validateForm.controls['deptIdLabel'].setValue('');
        this.isVisible = false;
    }
    private handleOk() {
        this.isVisible = false;
    }
    /**
     * 获取组织机构树的数据
     * @return {[type]} [description]
     */
    private getOrganization() {
        this.service.getOrganizationList({
            tenantId: this.route.snapshot.params['tenantId']
        }).then((data: any) => {
            if (data.success == 200) {
                this.organizationTreeData.data = data.result
                this.changeTreeData({
                    data: this.organizationTreeData.data,
                    select: {
                        id: this.depts && this.depts[0].value
                    }
                })
            }
        }).catch((err: any) => {
            console.log(err)
        })
    }


    private getCheckOrg(id: number, data: any): string {
        let len: number = data.length
        for (let item of data) {
            let orgArr: any = []
            if (item.id === id) {
                return item.content
            }
            if (item && item.children && item.children.length) {
                const temp = this.getCheckOrg(id, item.children)
                if (temp) {
                    return item.content + ' / ' + temp
                }
            }
        }
    }


}
