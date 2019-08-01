import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LogoService } from "./logo.service";

import { Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})


export class LogoComponent implements OnInit {
  @Input() menuCollapsed: boolean;
  @Input() logo: any = {};
  // 跳转到详情页
  @Input() routerUrl: string = ''
  // private routerUrl: string = ''
  _menuCollapsed: boolean = false;
  isCollapsedMenu: boolean = false;

  constructor(private router: Router, private service: LogoService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuCollapsed) {
      this._menuCollapsed = changes.menuCollapsed.currentValue;
    }
  }

  ngOnInit(): void {
    this.isCollapsedMenu = false;

    // this.router.events.subscribe((data: any) => {
    //   this.routerUrl = data.url
    //   console.log(data)
    // })
  }

}
