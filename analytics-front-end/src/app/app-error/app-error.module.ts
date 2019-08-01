import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorComponent } from './app-error.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppErrorDetailComponent } from './app-error-detail/app-error-detail.component';
import { AppErrorService } from './app-error.service';
import { OverviewModule } from '../common/overview/overview.module';
import { AppErrorTendModule } from './app-error-tend/app-error-tend.module';
import { AppErrorTopModule } from './app-error-top/app-error-top.module';
import { NumberToThousandsPipeModule } from 'src/pipes/number-to-thousands-pipe';
import { DateModule } from '../common/date/date.module';
import { AppSearchMoreModule } from './app-search-more/app-search-more.module';
import { ToBrPipeModule } from 'src/pipes/nToBr-pipe';

const appRoutes: Routes = [
  {
    path: '',
    component: AppErrorComponent
  },
  {
    path: 'detail',
    component: AppErrorDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NumberToThousandsPipeModule,
    ToBrPipeModule,
    DateModule,
    AppSearchMoreModule,
    OverviewModule,
    AppErrorTendModule,
    AppErrorTopModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [AppErrorComponent, AppErrorDetailComponent],
  providers: [AppErrorService]
})
export class AppErrorModule {}
