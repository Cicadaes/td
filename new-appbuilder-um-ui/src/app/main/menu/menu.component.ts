import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { MenuService } from './menu.service';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})


export class MenuComponent implements OnInit {
    isOpenOne = true;
    @Input() menuCollapsed: boolean;
    url = '';
    @Input() set firstUrl(value: any) {
        this.url = value;
    }

    get firstUrl() {
        return this.url;
    }
    menus: any[];
    isCollapsed = false;
    _menuCollapsed = false;
    _path: string;

    toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }

    constructor(
        private location: Location,
        private service: MenuService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private domSanitizer: DomSanitizer
    ) {

    }

    getUrl(one: any) {
        console.log(one);
        return true;
    }

    getMenus(): void {
        if (this.menuCollapsed) {
            // this.menus = null;
            return;
        }
        this.service.getMenus().then(menus => {
            this.menus = menus;
            if (!this._menuCollapsed) {
                this.openAllMenu();
                // this.openCurrentMenu();
            }
        });
    }

    openCurrentMenu() {
        // this.closeAllMenu();
        setTimeout(() => {
            this._path = this.location.path();
            if (!this._menuCollapsed && this._path && this.menus && this.menus.length > 0) {
                for (let i = 0; i < this.menus.length; i++) {
                    for (let j = 0; j < this.menus[i].children.length; j++) {
                        if (this._path.indexOf(this.menus[i].children[j].uri) !== -1) {
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
                    // if(this.menus[i].icon != 'null') {
                    //     this.menus[i].icon = this.domSanitizer.bypassSecurityTrustUrl(this.menus[i].icon);
                    // }
                    if (this.menus[i].children && this.menus[i].children.length) {
                        for (let j = 0; j < this.menus[i].children.length; j++) {
                            if (this.menus[i].children[j].uri === this.firstUrl) {
                                this.menus[i].isOpen = true;
                            }
                        }
                    }
                }
            }
        }, 100);
    }

    closeAllMenu() {
        if (this.menus && this.menus.length > 0) {
            for (let i = 0; i < this.menus.length; i++) {
                this.menus[i].isOpen = true;
            }
        }
    }

    openChange(item: any) {
        this.closeAllMenu();
        item.isOpen = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getMenus();
        this._menuCollapsed = changes.menuCollapsed.currentValue;
        if (!changes.menuCollapsed.firstChange) {
            if (this._menuCollapsed) {
                this.closeAllMenu();
            } else {
                this.openAllMenu();
            }
            // this.openCurrentMenu();
        }
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.closeAllMenu();
        }, 500);
        // 升级前
        // this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
        //     this.getMenus();
        // });
        this.router.events.subscribe(Event => {
            if (Event instanceof NavigationEnd) {
                this.getMenus();
            }

        });

    }
}
