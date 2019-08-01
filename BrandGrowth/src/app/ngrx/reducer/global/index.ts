
import * as global from './../../action/global';
import { MARKETING_CENTER_ITEM_LIST } from './../../../constants/marketing-center';

const _ = require('lodash');

const initialState: any = {
  startTime: new Date().getTime(),
  endTime: new Date().getTime(),
  activityKey: null,
  activityName: '',
  mediaExploreId: null,
  mediaExploreName: '',
  email: '',
  selectItem: MARKETING_CENTER_ITEM_LIST[0],
  routerUrl: '/entry'
};

export function reducer(state: any = initialState, action: global.Actions) {
  switch (action.type) {
    case global.SET_GLOBAL_TIME: {
      return _.assign({}, state, {
        startTime: action.startTime,
        endTime: action.endTime,
      })
    }

    case global.SET_GLOBAL_CAMPAIGN_OPTION: {
      return _.assign({}, state, {
        activityKey: action.activityKey,
        activityName: action.activityName
      })
    }

    case global.SET_GLOBAL_MEDIA_EXPLORE_OPTION: {
      return _.assign({}, state, {
        mediaExploreId: action.mediaExploreId,
        mediaExploreName: action.mediaExploreName,
      })
    }

    case global.SET_GLOBAL_AUTH_DATA_ACTION: {
      return _.assign({}, state, {
        email: action.email
      })
    }

    case global.SET_GLOBAL_CURRCENT_ITEM: {
      return _.assign({}, state, {
        selectItem: action.selectItem ? action.selectItem : initialState.selectItem
      })
    }

    case global.SET_GLOBAL_ROUTER_URL: {
      return _.assign({}, state, {
        routerUrl: action.routerUrl
      })
    }

    default: {
      return state;
    }
  }
}
