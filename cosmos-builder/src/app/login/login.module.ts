import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from 'ng-cosmos-td-common';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';


@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        CommonModule,
        FormModule,
        ButtonModule,
        InputModule
    ],
    providers: [LoginService],
    exports: [LoginComponent]
})
export class LoginModule {

}