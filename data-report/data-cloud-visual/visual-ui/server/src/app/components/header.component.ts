import {Component, OnInit} from '@angular/core';
import '../../../public/css/styles.css';


@Component({
  selector: 'my-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
  providers: []
})
export class HeaderComponent implements OnInit {
  routerUrl:any;

  constructor() {

  }

  ngOnInit() {
    this.routerUrl = "/" + process.env.DIST
  }

}
