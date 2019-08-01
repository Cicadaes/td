import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

    constructor(private service: SettingsService) {

    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

}
