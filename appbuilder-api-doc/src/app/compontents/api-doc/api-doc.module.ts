import { ApiDocService } from './api-doc.service';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TopModule } from 'src/app/main/top/top.module';
import { ApiDocComponent } from './api-doc.component';
import { SetValueLengthPipeModule } from 'src/app/pipes/setStringLength-pipe';
const routes: Routes = [
    {
        path: '',
        component: ApiDocComponent
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    TopModule,
    SetValueLengthPipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ApiDocComponent],
  providers: [ApiDocService]
})

export class ApiDocModule { }
