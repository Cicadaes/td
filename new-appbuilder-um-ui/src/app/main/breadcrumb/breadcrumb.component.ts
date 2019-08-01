import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";
// SERVICES
import { AppCommunicationService } from '../../@themes/communication-service/app-communication.service'

interface IBreadcrumb {
  label: string;
  params: Params;
  url: string;
}
@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  providers: []
})

export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadcrumb[];

  private appName: string = ''
  index: number;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appComService: AppCommunicationService) {
    this.breadcrumbs = [];
  }

  listenerRouterChange() {
    // 升级前
    // this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
    //   let root: ActivatedRoute = this.activatedRoute.root;
    //   this.breadcrumbs = this.getBreadcrumbs(root);
    //   this.breadcrumbs = this.breadcrumbs.reduce((x, y) => x.findIndex(e => e.label == y.label) < 0 ? [...x, y] : x, []);
    // });
    this.router.events.subscribe(Event => {
      if (Event instanceof NavigationEnd) {
        const root: ActivatedRoute = this.activatedRoute.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
        this.breadcrumbs = this.breadcrumbs.reduce((x, y) => x.findIndex(e => e.label === y.label) < 0 ? [...x, y] : x, []);
      }
    });
  }

  ngOnInit() {
    this.listenerRouterChange();
    this.appComService.appNameAnnounce$.subscribe((data: string)=>{
      // this.breadcrumbs[1].label = data
      
      // this.appName = data
      //
      // let appParam: IBreadcrumb = {
      //   label: data,
      //   params: null,
      //   url: ''
      // };
      // this.breadcrumbs.splice(this.breadcrumbs.length-1, 0, appParam)
      // console.log(this.breadcrumbs)
    })
  }


  private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = "title";

    let children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
      url += `/${routeURL}`;

      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);

      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
