import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PaginatorModule} from 'primeng/primeng';

import { PagesComponent } from './pages/pages.component';
import { PaginatorComponent } from './paginator.component';


@NgModule({
    imports: [CommonModule, FormsModule, PaginatorModule],
    declarations: [PaginatorComponent, PagesComponent],
    exports:[PaginatorComponent],
    providers: []
})
export class PaginatorxModule {  }