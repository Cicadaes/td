import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TopService } from "./top.service";
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";

@Component({
    selector: 'top',
    templateUrl: './top.component.html',
    styleUrls: ['./top.component.css']
})


export class TopComponent implements OnInit {
    @Output() menuCollapsed = new EventEmitter<boolean>();
    user: any;
    userName: string;
    logoutText: string;
    isCollapsed: boolean;

    constructor(private service: TopService, private router: Router, private activatedRoute: ActivatedRoute) {

    }

    getUser(): void {
        this.service.getUser().then(user => {
            this.user = user;
            this.userName = this.user.name;
        })
    }

    _changeMenuStatus() {
        this.isCollapsed = !this.isCollapsed;
        this.menuCollapsed.emit(this.isCollapsed);
    }

    logout() {
        this.service.logout().then((response: any) => {
            console.dir([response]);
            if (response && response.service) {
                const _url = response.service + window.location.origin + response.redirect + window.location.href;
                window.location.href = _url;
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.logoutText = '退出';
            this.getUser();
            // 升级前的方法 暂时保留
            // this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            //     this.getUser();
            // });
            this.router.events.subscribe(Event => {
                if (Event instanceof NavigationEnd) {
                    this.getUser();
                }
            });
        }, 300);

    }
}
