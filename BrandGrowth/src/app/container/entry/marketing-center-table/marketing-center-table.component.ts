import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'marketing-center-table',
    templateUrl: './marketing-center-table.component.html',
    styleUrls: ['./marketing-center-table.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketingCenterTableComponent {
    @Input()
    itemList: any[] = [];
}
