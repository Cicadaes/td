
import * as secondLevel from './../../action/secondLevel';

const _ = require('lodash');

const initialState: any = {
  secondLevelId: null,
  secondLevelName: null
};

export function reducer(state: any = initialState, action: secondLevel.Actions) {
  switch (action.type) {
    case secondLevel.SET_SECOND_LEVEL_ID: {
      return _.assign({}, state, {
        secondLevelId: action.secondLevelId,
      })
    }

    case secondLevel.SET_SECOND_LEVEL_NAME: {
      return _.assign({}, state, {
        secondLevelName: action.secondLevelName,
      })
    }

    default: {
      return state;
    }
  }
}
