
import * as disabled from './../../action/disabled';

const _ = require('lodash');

const initialState: any = {
  startDisabledTime: new Date().getTime(),
  endDisabledTime: new Date().getTime(),
};

export function reducer(state: any = initialState, action: disabled.Actions) {
  switch (action.type) {
    case disabled.SET_DISABLED_TIME: {
      return _.assign({}, state, {
        startDisabledTime: action.startDisabledTime,
        endDisabledTime: action.endDisabledTime,
      })
    }

    default: {
      return state;
    }
  }
}
