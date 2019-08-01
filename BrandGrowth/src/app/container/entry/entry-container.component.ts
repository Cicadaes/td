import { Component } from '@angular/core';

// import Contants
import { MARKETING_CENTER_ITEM_LIST } from '../../constants/marketing-center';

@Component({
    selector: 'entry-container',
    templateUrl: './entry-container.component.html',
    styleUrls: [ './entry-container.component.less' ],
    host: {
      class: 'clearfix'
    }
})
export class EntryContainerComponent {
    itemList: any[] = MARKETING_CENTER_ITEM_LIST;
}






