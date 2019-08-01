import { Action } from '@ngrx/store';

export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';
export const SHOW_NAV = 'SHOW_NAV';
export const HIDE_NAV = 'HIDE_NAV';
export const SHOW_TIME = 'SHOW_TIME';
export const SHOW_SPECIAL_TIME = 'SHOW_SPECIAL_TIME';
export const HIDE_SPECIAL_TIME = 'HIDE_SPECIAL_TIME';
export const HIDE_TIME = 'HIDE_TIME';
export const SHOW_FILTER_TIME = 'SHOW_FILTER_TIME';
export const HIDE_FILTER_TIME = 'HIDE_FILTER_TIME';
export const SHOW_CAMP = 'SHOW_CAMP';
export const HIDE_CAMP = 'HIDE_CAMP';
export const SHOW_FILTER = 'SHOW_FILTER';
export const HIDE_FILTER = 'HIDE_FILTER';
export const SHOW_BREAD = 'SHOW_BREAD';
export const HIDE_BREAD = 'HIDE_BREAD';

export class ShowLoadingAction implements Action {
  readonly type = SHOW_LOADING;
}

export class HideLoadingAction implements Action {
  readonly type = HIDE_LOADING;
}

export class ShowNavAction implements Action {
  readonly type = SHOW_NAV;
}

export class HideNavAction implements Action {
  readonly type = HIDE_NAV;
}

export class ShowSpecialTimeAction implements Action {
  readonly type = SHOW_SPECIAL_TIME;
}

export class HideSpecialTimeAction implements Action {
  readonly type = HIDE_SPECIAL_TIME;
}

export class ShowTimeAction implements Action {
  readonly type = SHOW_TIME;
}

export class HideTimeAction implements Action {
  readonly type = HIDE_TIME;
}

export class ShowFilterTimeAction implements Action {
  readonly type = SHOW_FILTER_TIME;
}

export class HideFilterTimeAction implements Action {
  readonly type = HIDE_FILTER_TIME;
}

export class ShowCampAction implements Action {
  readonly type = SHOW_CAMP;
}

export class HideCampAction implements Action {
  readonly type = HIDE_CAMP;
}

export class ShowFilterAction implements Action {
  readonly type = SHOW_FILTER;
}

export class HideFilterAction implements Action {
  readonly type = HIDE_FILTER;
}

export class ShowBreadAction implements Action {
  readonly type = SHOW_BREAD;
  breadNavList: any = null;
}

export class HideBreadAction implements Action {
  readonly type = HIDE_BREAD;
}

export type Actions = (
  ShowLoadingAction
  | HideLoadingAction
  | ShowNavAction
  | HideNavAction
  | ShowTimeAction
  | ShowSpecialTimeAction
  | HideSpecialTimeAction
  | HideTimeAction
  | ShowCampAction
  | HideCampAction
  | ShowFilterAction
  | HideFilterAction
  | ShowBreadAction
  | HideBreadAction
  | ShowFilterTimeAction
  | HideFilterTimeAction
);
