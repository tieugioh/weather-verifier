import { STORE_CURR_COMP, STORE_FORE_COMP } from '../constants/types.constants'

const INIT_STATE = {
    currentConditions: [],
    forecast: []
}

export default (state = INIT_STATE, action) => {
    const { type, payload } = action

    switch(type) {
        case STORE_CURR_COMP:
            return { ...state, currentConditions: payload }
        case STORE_FORE_COMP:
            return { ...state, forecast: payload }
        default:
            return state;
    }
}