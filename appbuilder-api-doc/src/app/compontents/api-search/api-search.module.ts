import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiSearchComponent } from './api-search.component';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TopModule } from 'src/app/main/top/top.module';
import { KeywordPipeModule } from 'src/app/pipes/keyword-pipe';
const routes: Routes = [
    {
        path: '',
        component: ApiSearchComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        TopModule,
        KeywordPipeModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ApiSearchComponent]
})

export class ApiSearchModule { }
