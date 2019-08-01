import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {NavigationEnd} from '@angular/router';
import {BaseComponent} from '../base-component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent extends BaseComponent implements OnInit, OnChanges {

    routerList2: any;

    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.routerList2 = this.commonService.navList;

        const _that = this;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                _that.routerList2 = _that.commonService.navList;
            }
        });
    }

    jump(data: any, index: number) {

        const _that = this;

        if (_that.commonService.navList && _that.commonService.navList.length > 0 && index !== -1) {
            const tmp = _that.commonService.navList.slice(0, index + 1);
            _that.commonService.navList = tmp;
        }

        //解决从面包屑进入自定义标签页默认选中全部
        if(data.url.indexOf('manage/user-configured') !== -1){
            this.globals.setStorageLocal('user-configured-tag-category', "");
        }

        _that.router.navigateByUrl(data.url);

    }
}
