import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { InnerMenuService } from './inner-menu.service';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';

@Component({
    selector: 'inner-menu',
    templateUrl: './inner-menu.component.html',
    styleUrls: ['./inner-menu.component.css']
})


export class InnerMenuComponent implements OnInit, OnChanges {
    @Input() menuCollapsed: boolean;
    @Input() id: string;

    menus: any[];
    isCollapsed = false;
    _menuCollapsed = false;
    _path: string;
    tenantId: any;
    tenant: any = {};
    appLogo: any;

    // 租户URL
    private titleUrl = '';

    toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }

    constructor(private location: Location,
        private service: InnerMenuService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {

    }

    getMenus(): void {
        this.service.getMenus(this.tenantId).then(menus => {
            this.menus = menus;
            this.openAllMenu();
            // this.openCurrentMenu();
        });

        /*this.service.getInnerMenus( this.ajaxUrl,this.params).subscribe((data: any) => {
            this.menus = data;
            //this.openCurrentMenu();
        });*/

    }

    openCurrentMenu() {
        setTimeout(() => {
            this._path = this.location.path();
            if (!this._menuCollapsed && this._path && this.menus && this.menus.length > 0) {
                for (let i = 0; i < this.menus.length; i++) {
                    for (let j = 0; j < this.menus[i].childrens.length; j++) {
                        if (this._path.indexOf(this.menus[i].childrens[j].url) !== -1) {
                            this.menus[i].isOpen = true;
                            break;
                        }
                    }
                }
            }
        }, 100);
    }

    openAllMenu() {
        setTimeout(() => {
            if (this.menus && this.menus.length > 0) {
                for (let i = 0; i < this.menus.length; i++) {
                    this.menus[i].isOpen = true;
                }
            }
        }, 100);
    }

    openChange(item: any) {
        /*if(this.menus && this.menus.length > 0) {
            for (let i = 0; i < this.menus.length; i++) {
                this.menus[i].isOpen = false;
            }
        }
        item.isOpen = true;*/
    }

    ngOnChanges(changes: SimpleChanges) {


        if (changes.menuCollapsed) {
            this._menuCollapsed = changes.menuCollapsed.currentValue;
            if (!changes.menuCollapsed.firstChange) {
                // this.openCurrentMenu();
            }
        }

        /* if(changes.params){
             this.params = changes.params.currentValue;
         }else{
             this.params = {};
         }*/


    }

    getTenant() {
        this.service.getTenantById(this.tenantId).then(data => {
            this.tenant = data.data;
            this.getAppLogo();
        });
    }

    getAppLogo() {
        this.appLogo = {
            logo: '',
            name: this.tenant['companyName'] || this.tenant['contactName'] || ''
        };
    }

    ngOnInit(): void {
        this.tenantId = this.id || this.activatedRoute.snapshot.params['tenantId'];
        this.getTenant();
        this.getMenus();

        this.titleUrl = '/tenants/tenantDetail' + '/' + this.tenantId;
    }
}
