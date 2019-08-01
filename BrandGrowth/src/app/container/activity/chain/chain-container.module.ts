import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { ChainContainerComponent } from './chain-container.component';
import { FiltrateCardComponent } from './filtrate-card/filtrate-card.component';
import { ShowBreadService } from '../../../services/guard/show-bread.service';
import { HideBreadService } from '../../../services/guard/hide-bread.service';
import { MediaSourceService } from '../../../services/source/media.source.service';
import { DictSourceService } from '../../../services/source/dict.source.service';
import { IndicatorsSourceService } from '../../../services/source/indicators.source.service';

// import Constants
import { CHAIN_ROUTE } from './chain_route';

@NgModule({
  declarations: [
    ChainContainerComponent,
    FiltrateCardComponent,
],
  imports: [
    SharedModule,
    RouterModule.forChild(CHAIN_ROUTE),
    ClipboardModule
  ],
  exports: [
    ChainContainerComponent
  ],
  providers: [
    MediaSourceService,
    DictSourceService,
    IndicatorsSourceService,
  ]
})
export class ChainContainerModule { }
