import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../config/shared/shared.module';

// import Components
import { AppLayoutComponent } from './app-layout.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppContentComponent } from './app-content/app-content.component';
import { SelectBarComponent } from './app-header/select-bar/select-bar.component';
import { UserInfoComponent } from './app-header/user-info/user-info.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { SelectCampaignComponent } from './filter-bar/select-campaign/select-campaign.component';
import { SelectTimeComponent } from './filter-bar/select-time/select-time.component';
import { AppBreadcrumbComponent } from './app-breadcrumb/app-breadcrumb.component';
import { AppFooterComponent } from './app-footer/app-footer.component';

// import Services
import { UserSourceService } from '../../services/source/user.source.service';

@NgModule({
  declarations: [
    AppLayoutComponent,
    AppHeaderComponent,
    AppContentComponent,
    SelectBarComponent,
    UserInfoComponent,
    FilterBarComponent,
    NavListComponent,
    SelectCampaignComponent,
    SelectTimeComponent,
    AppBreadcrumbComponent,
    AppFooterComponent,
],
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    AppLayoutComponent,
    AppHeaderComponent,
    AppContentComponent,
    SelectBarComponent,
    UserInfoComponent,
    FilterBarComponent,
    NavListComponent,
    SelectCampaignComponent,
    SelectTimeComponent,
    AppBreadcrumbComponent,
    AppFooterComponent
  ],
  providers: [
    UserSourceService
  ]
})
export class AppLayoutModule { }
