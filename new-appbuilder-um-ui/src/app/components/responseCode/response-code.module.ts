import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { MoreSearchModule } from 'src/app/main/more-search/more-search.module';
import { ResponseCodeService } from './response-code.service';
import { ResponseCodeComponent } from './response-code.component';
import { AddCodeComponent } from './addCode/add-code.component';
import { DateFormatPipeModule } from 'src/app/pipes/dateFormat-pipe';
import { DetailCodeComponent } from './detailCode/detail-code.component';

const routes: Routes = [
    {
        path: '',
        component: ResponseCodeComponent
    }
];

@NgModule({
    declarations: [
        ResponseCodeComponent,
        AddCodeComponent,
        DetailCodeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        DateFormatPipeModule,
        MoreSearchModule,
        RouterModule.forChild(routes)
    ],
    providers: [ ResponseCodeService ],
    exports: [ ResponseCodeComponent ]
})
export class ResponseCodeModule { }
