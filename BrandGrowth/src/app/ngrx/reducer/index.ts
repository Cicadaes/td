import * as guard from './guard';
import * as global from './global';
import * as disabled from './disabled';
import * as secondLevel from './secondLevel';

export interface State {
  guard: any;
  global: any;
  secondLevel: any;
  disabled: any;
}

export const reducer = {
  guard: guard.reducer,
  global: global.reducer,
  disabled: disabled.reducer,
  secondLevel: secondLevel.reducer
}