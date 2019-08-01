import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// import Services
import { ShowFilterService } from '../../services/guard/show-filter.service';
import { HideFilterService } from '../../services/guard/hide-filter.service';
import { ShowNavService } from '../../services/guard/show-nav.service';
import { HideNavService } from '../../services/guard/hide-nav.service';
import { ShowTimeService } from '../../services/guard/show-time.service';
import { HideTimeService } from '../../services/guard/hide-time.service';
import { ShowCampService } from '../../services/guard/show-camp.service';
import { HideCampService } from '../../services/guard/hide-camp.service';
import { ShowBreadService } from '../../services/guard/show-bread.service';
import { HideBreadService } from '../../services/guard/hide-bread.service';
import { AdcampSourceService } from '../../services/source/adcamp.source.service';
import { ShowSpecialTimeService } from '../../services/guard/show-special-time.service';
import { HideSpecialTimeService } from '../../services/guard/hide-special-time.service';
import { HideFilterTimeService } from '../../services/guard/hide-filter-time.service';
import { ShowFilterTimeService } from '../../services/guard/show-filter-time.service';

// interceptor
// ----------------
import { ServerURLInterceptor, CommonService } from './../Interceptor/index';

import { InterceptorService } from 'ng2-interceptors';
import { XHRBackend, RequestOptions } from '@angular/http';
import { CmMessageService } from 'ng-cosmos-td-ui';

export function interceptorFactory(
  xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  serverURLInterceptor: ServerURLInterceptor) {
  // Add it here
  const service = new InterceptorService(xhrBackend, requestOptions);
  service.addInterceptor(serverURLInterceptor); // Add it here
  return service;
}
// ----------------

@NgModule({
  declarations: [

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    CommonService,
    ServerURLInterceptor,
    CmMessageService,
    {
      provide: InterceptorService,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions, ServerURLInterceptor]
      // Add it here, in the same order as the signature of interceptorFactory
    },
    ShowNavService,
    HideNavService,
    ShowFilterService,
    HideFilterService,
    ShowTimeService,
    HideTimeService,
    ShowCampService,
    HideCampService,
    ShowBreadService,
    HideBreadService,
    AdcampSourceService,
    ShowSpecialTimeService,
    HideSpecialTimeService,
    ShowFilterTimeService,
    HideFilterTimeService
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
