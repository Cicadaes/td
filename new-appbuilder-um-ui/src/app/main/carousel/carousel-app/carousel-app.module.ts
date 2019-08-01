import { CarouselAppRoutingModule } from './carousel-app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CarouselAppService } from './carousel-app.service';
import { CarouselAppComponent } from './carousel-app.component';
import { CommonModule } from '@angular/common';
import {CheckboxTreeModule} from '../../checkbox/checkbox-tree/checkbox-tree.module';

@NgModule({
    declarations: [
        CarouselAppComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxTreeModule,
        NgZorroAntdModule
    ],
    providers: [CarouselAppService],
    exports: [CarouselAppComponent]
})
export class CarouselAppModule {

}
