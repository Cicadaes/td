import { Action } from '@ngrx/store';

export const SET_GLOBAL_TIME = 'SET_GLOBAL_TIME';
export const SET_GLOBAL_CAMPAIGN_OPTION = 'SET_GLOBAL_CAMPAIGN_OPTION';
export const SET_GLOBAL_MEDIA_EXPLORE_OPTION = 'SET_GLOBAL_MEDIA_EXPLORE_OPTION';
export const SET_GLOBAL_AUTH_DATA_ACTION = 'SET_GLOBAL_AUTH_DATA_ACTION';
export const SET_GLOBAL_CURRCENT_ITEM = 'SET_GLOBAL_CURRCENT_ITEM';
export const SET_GLOBAL_ROUTER_URL = 'SET_GLOBAL_ROUTER_URL';

export class SetGlobalTimeAction implements Action {
  readonly type = SET_GLOBAL_TIME;
  startTime: number;
  endTime: number;
}

export class SetGlobalCampaignOptionAction implements Action {
  readonly type = SET_GLOBAL_CAMPAIGN_OPTION;
  activityKey: (string | number);
  activityName: string;
}

export class SetGlobalMediaExploreOptionAction implements Action {
  readonly type = SET_GLOBAL_MEDIA_EXPLORE_OPTION;
  mediaExploreId: (string | number);
  mediaExploreName: string;
}

export class SetGlobalAuthDataAction implements Action {
  readonly type = SET_GLOBAL_AUTH_DATA_ACTION;
  email: string;
}

export class SetGlobalCurrcentItem implements Action {
  readonly type = SET_GLOBAL_CURRCENT_ITEM;
  selectItem: any;
}

export class SetGlobalRouterUrl implements Action {
  readonly type = SET_GLOBAL_ROUTER_URL;
  routerUrl: string;
}

export type Actions = (
  SetGlobalTimeAction
  | SetGlobalCampaignOptionAction
  | SetGlobalMediaExploreOptionAction
  | SetGlobalAuthDataAction
  | SetGlobalCurrcentItem
  | SetGlobalRouterUrl
);
