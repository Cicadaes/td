import { 
  Component, 
  OnInit, 
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducer from './../../ngrx/reducer';
import * as global from '../../ngrx/action/global';
import { Router, NavigationStart, ActivatedRoute, NavigationEnd } from '@angular/router';

// import Contants
import { CAMPAIGN_ACTIVITY_ITEM_LIST } from '../../constants/campaign-activity';
import { MARKETING_CENTER_ITEM_LIST } from '../../constants/marketing-center';
import { MANAGE_CENTER_ITEM_LIST } from '../../constants/manage-center';
import { MEDIA_EXPLORATION_ITEM_LIST } from './../../constants/media-exploration';
import { CAMPAIGN_GROWTH_ITEM_LIST } from './../../constants/campaign-growth';
import { MARKETING_EFFECT_ITEM_LIST } from '../../constants/marketing-effect';

// import Services
import { AdcampSourceService } from '../../services/source/adcamp.source.service';
import { MediaExploreSourceService } from '../../services/source/mediaExplore.source.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less'],
  providers: [ AdcampSourceService, MediaExploreSourceService]
})
export class AppLayoutComponent implements OnInit {
  guard$: Observable<any>;
  @ViewChild('appContent') appContent: ElementRef;

  private _activityList: any = [];

  navList: any[] = null;
  marketingCenterItemList: any[] = MARKETING_CENTER_ITEM_LIST;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<reducer.State>,
    private adcampSourceService: AdcampSourceService,
    private mediaExploreSourceService: MediaExploreSourceService,
  ) {
    this.guard$ = this.store.select('guard');
  }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        /* if (!!this.appContent.nativeElement) {
          setTimeout(() => {
            this.appContent.nativeElement.scrollTo(0, 0);
          }, 0);
        } */
        if (!!document.getElementById('app-content') && document.getElementById('app-content').scrollTop > 0) {
          setTimeout(() => {
            document.getElementById('app-content').scrollTop = 0;
            // document.getElementById('app-content').scrollTo(0, 0);
          }, 0);
        }
      }
      if (event instanceof NavigationEnd) {
        this.initialNavList();

        switch(this.activateRoute.firstChild.snapshot.routeConfig.path) {
          case 'effect':
          case 'activity': this.adcampSourceService.getActivityList().then((data: any) => {
            if(data && data.result) {
              this._activityList = data.result.map((item: any) => {
                return { id: item.activityKey, name: item.name }
              });
            }
          });
          break;
          case 'media-exploration': this.mediaExploreSourceService.getMediaExploreListAll().then((data: any) => {
            if(data && data.result ) {
              this._activityList = data.result.map((item: any) => {
                return { id: item.id, name: item.name }
              });
            }
          });
          break;
          default: break;
        }
      }
    });
  }

  initialNavList() {
    let routerUrl = this.activateRoute['firstChild']['routeConfig']['path']; // 获取url
    let urls = routerUrl.split('/');

    // /activity
    if(urls[0] === 'activity') { 
      this.navList = CAMPAIGN_ACTIVITY_ITEM_LIST;
    }

    // /manage-center
    if(urls[0] === 'manage-center') { 
      this.navList = MANAGE_CENTER_ITEM_LIST;
    }

    // /media-exploration
    if(urls[0] === 'media-exploration') { 
      this.navList = MEDIA_EXPLORATION_ITEM_LIST;
    }

    // /growth
    if(urls[0] === 'growth') { 
      this.navList = CAMPAIGN_GROWTH_ITEM_LIST;
    }

    // /effect
    if(urls[0] === 'effect') { 
      this.navList = MARKETING_EFFECT_ITEM_LIST;
    }
  }
}
