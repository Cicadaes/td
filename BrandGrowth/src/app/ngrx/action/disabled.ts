import { Action } from '@ngrx/store';

export const SET_DISABLED_TIME = 'SET_DISABLED_TIME';

export class SetDisabledTimeAction implements Action {
  readonly type = SET_DISABLED_TIME;
  startDisabledTime: number;
  endDisabledTime: number;
}

export type Actions = (
  SetDisabledTimeAction
);
