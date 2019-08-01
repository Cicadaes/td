import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.less'],
  host: {
    style: 'flex: 1 0 auto;display: flex;align-items: flex-end;'
  }
})
export class AppFooterComponent implements OnInit {
  private _thisYear = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
  }

}
