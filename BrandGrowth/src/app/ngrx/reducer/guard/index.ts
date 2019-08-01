
import * as guard from './../../action/guard';

const _ = require('lodash');

const initialState: any = {
  isBreadExist: false,
  isCampExist: false,
  isFilterExist: false,
  isLoadingExist: false,
  isNavExist: false,
  isTimeExist: false,
  isFilterTimeExist: false,
  isSpecialExist: false,
  breadNavList: null,
};

export function reducer(state: any = initialState, action: guard.Actions) {
  switch (action.type) {
    case guard.HIDE_BREAD: {
      return _.assign({}, state, {
        isBreadExist: false,
      })
    }

    case guard.SHOW_BREAD: {
      return _.assign({}, state, {
        isBreadExist: true,
        breadNavList: action.breadNavList
      });
    }

    case guard.HIDE_CAMP: {
      return _.assign({}, state, {
        isCampExist: false,
      })
    }

    case guard.SHOW_CAMP: {
      return _.assign({}, state, {
        isCampExist: true,
      });
    }

    case guard.HIDE_FILTER: {
      return _.assign({}, state, {
        isFilterExist: false,
      })
    }

    case guard.SHOW_FILTER: {
      return _.assign({}, state, {
        isFilterExist: true,
      });
    }

    case guard.HIDE_LOADING: {
      return _.assign({}, state, {
        isLoadingExist: false,
      })
    }

    case guard.SHOW_LOADING: {
      return _.assign({}, state, {
        isLoadingExist: true,
      });
    }

    case guard.HIDE_NAV: {
      return _.assign({}, state, {
        isNavExist: false,
      })
    }

    case guard.SHOW_NAV: {
      return _.assign({}, state, {
        isNavExist: true,
      });
    }

    case guard.SHOW_SPECIAL_TIME: {
      return _.assign({}, state, {
        isSpecialExist: true
      })
    }

    case guard.HIDE_SPECIAL_TIME: {
      return _.assign({}, state, {
        isSpecialExist: false
      })
    }

    case guard.HIDE_TIME: {
      return _.assign({}, state, {
        isTimeExist: false,
      })
    }

    case guard.SHOW_TIME: {
      return _.assign({}, state, {
        isTimeExist: true,
      });
    }

    case guard.HIDE_FILTER_TIME: {
      return _.assign({}, state, {
        isFilterTimeExist: false,
      })
    }

    case guard.SHOW_FILTER_TIME: {
      return _.assign({}, state, {
        isFilterTimeExist: true,
      });
    }

    default: {
      return state;
    }
  }
}
