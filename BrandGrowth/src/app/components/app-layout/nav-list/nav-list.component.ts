import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.less']
})
export class NavListComponent implements OnInit {
  @Input()
  itemList: any[];

  ngOnInit() {
  }

}
