import {StageService} from './../services/stage.service';
import {Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
    selector: 'smart-configs',
    templateUrl: 'configs.component.html'
})

export class ConfigsComponent implements OnInit, AfterViewInit {

    public tabId: number = 3;

    constructor(private stageService: StageService) {
        let that = this;
        this.stageService.OnTabChart$.subscribe((b: any) => {
            that.tabId = b;
        })
    }

    ngOnInit() {

    }

    onTabChange(e: any) {
        this.tabId = e.index + 1;
    }

    ngAfterViewInit() {

    }
}