import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { PagePathAppComponent } from './page-path-app/page-path-app.component';
import { PagePathH5Component } from './page-path-h5/page-path-h5.component';
import { PagePathWebComponent } from './page-path-web/page-path-web.component';
import { PagePathService } from './page-path.service';
import { PagePathRoutingModule } from './page-path.routing';
import { PagePathComponent } from './page-path.component';
import { PagePathFilterComponent } from './page-path-filter/page-path-filter.component';
import { SelectGroupModule } from '../../main/select/select-group/select-group.module';
import { SelectSearchModule } from '../../main/select/select-search/select-search.module';
import { SelectCustomModule } from '../../main/select/select-custom/select-custom.module';
import { PagePathComModule } from './page-path-com/page-path-com.module';
import { SelectSearchMultipleModule } from '../../main/select/select-search-multiple/select-search-multiple.module';
import { TabListModule } from '../../common/tab-list/tab-list.module';
import { PagePathMiniProgramComponent } from './page-path-mini-program/page-path-mini-program.component';
import { PagePathDateFilterComponent } from './page-path-date-filter/page-path-date-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagePathRoutingModule,
    NgZorroAntdModule,
    SelectGroupModule,
    SelectSearchModule,
    SelectCustomModule,
    SelectSearchMultipleModule,
    PagePathComModule,
    TabListModule
  ],
  declarations: [
    PagePathComponent,
    PagePathAppComponent,
    PagePathH5Component,
    PagePathWebComponent,
    PagePathMiniProgramComponent,
    PagePathFilterComponent,
    PagePathDateFilterComponent
  ],
  providers: [PagePathService]
})
export class PagePathModule {}
