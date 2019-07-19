/**
 * Selector for checking loading states
 */

import _ from 'lodash';

export const createLoadingSelector = (actions) => (state) => {
    // returns true only when all actions is not loading
    return _(actions)
        .some((action) => _.get(state, `loading.${action}`))
}