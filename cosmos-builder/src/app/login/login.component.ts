import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';
import { CmMessageService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
interface AppState {
    loginValidator: any;
}
@Component({
    selector: 'my-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [FormBuilder]
})
export class LoginComponent implements OnInit, OnDestroy {
    
    loginValidator$: any;
    validateForm: FormGroup;

    resetForm($event: MouseEvent) {
        $event.preventDefault();
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
        }
    }
    userNameAsyncValidator = (control: FormControl): any => {
        if (!control.value) {
            return { required: true };
        } else {
            return null;
        }

    };
    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }
    passwordValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else {
            return null;
        }
    };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _message: CmMessageService,
        private store: Store<AppState>) {
        this.validateForm = this.fb.group({
            userName: ['123456', [Validators.required,this.userNameAsyncValidator]],
            password: ['123456', [Validators.required,this.passwordValidator]]
        });
        this.loginValidator$ = store.select('loginValidator');
    }
      
    submitForm = ($event: any, value: any) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }   
    }
    push( value: any){
        if(value.userName == "123456" && value.password == "123456"){
            this.createMessage('success','欢迎登录')
            this.store.dispatch({ type: 'login'});
            this.router.navigateByUrl("main")           
        }else if(value.userName == "123456" && value.password !== "123456"){
            this.createMessage('error','密码错误');
        }else{
            this.createMessage('error','此用户名不存在')
        }
    }
    createMessage = (type:any, text:any) => {
        this._message.create(type, `${text}`);
    } 
    ngOnInit() {
    }

    ngOnDestroy() {

    }

}