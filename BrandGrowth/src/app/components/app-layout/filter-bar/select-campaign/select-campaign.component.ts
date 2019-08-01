import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as reducer from './../../../../ngrx/reducer';
import * as global from './../../../../ngrx/action/global';

const _ = require('lodash');
 
@Component({
  selector: 'select-campaign',
  templateUrl: './select-campaign.component.html',
  styleUrls: ['./select-campaign.component.less']
})
export class SelectCampaignComponent implements OnInit, OnChanges, OnDestroy {
  selectedOption: { value: string, label: string } = {
    value: '',
    label: '',
  };
  searchOptions: { value: string, label: string }[] = [];

  subscription: any;

  moduleName: string; // 模块名
  moduleLabel: string = '';

  @Input()
  activityList: any;

  constructor(
    private store$: Store<reducer.State>,
  ) { 
    this.subscription = this.store$.select('global')
    .debounceTime(100)
    .distinctUntilChanged()
    .subscribe((data: any) => {
      if (data && data.routerUrl) {
        this.moduleName = data.routerUrl.split('/')[1];
      }

      if((this.moduleName === 'activity' || this.moduleName === 'effect') && localStorage.getItem("TD_BG_ACTIVITY_OPTION")) {
        this.moduleLabel = "应用名称";
        this.selectedOption = JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION"));
        if (this.selectedOption && this.selectedOption.value && this.selectedOption.label) {
          this.store$.dispatch({
            type: global.SET_GLOBAL_CAMPAIGN_OPTION,
            activityKey: this.selectedOption.value,
            activityName: this.selectedOption.label
          });
        }
      }

      if(this.moduleName === 'media-exploration' && localStorage.getItem("TD_BG_MEDIA_EXPLORE_OPTION")) {
        this.moduleLabel = "探索任务";
        this.selectedOption = JSON.parse(localStorage.getItem("TD_BG_MEDIA_EXPLORE_OPTION"));
        if (this.selectedOption && this.selectedOption.value && this.selectedOption.label) {
          this.store$.dispatch({
            type: global.SET_GLOBAL_MEDIA_EXPLORE_OPTION,
            mediaExploreId: this.selectedOption.value,
            mediaExploreName: this.selectedOption.label
          });
        }
      }
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.searchOptions = [];
    if(changes.activityList.previousValue !== changes.activityList.currentValue && changes.activityList.currentValue && changes.activityList.currentValue.length > 0) {
      changes.activityList.currentValue.map((el: any) => {
        this.searchOptions.push({
          value: el.id,
          label: el.name
        })
      })
    }
  }

  setGlobalCampaignOption(info: any) {
    const option = this.searchOptions.filter(x => (x.value === info))[0];
    if ((this.moduleName === 'activity' || this.moduleName === 'effect') && option && option.value && option.label) {
      this.store$.dispatch({
        type: global.SET_GLOBAL_CAMPAIGN_OPTION,
        activityKey: option.value,
        activityName: option.label
      });
      localStorage.setItem("TD_BG_ACTIVITY_OPTION", JSON.stringify(option));
    }
    if (this.moduleName === 'media-exploration' && option && option.value && option.label) {
      this.store$.dispatch({
        type: global.SET_GLOBAL_MEDIA_EXPLORE_OPTION,
        mediaExploreId: option.value,
        mediaExploreName: option.label
      });
      localStorage.setItem("TD_BG_MEDIA_EXPLORE_OPTION", JSON.stringify(option));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
