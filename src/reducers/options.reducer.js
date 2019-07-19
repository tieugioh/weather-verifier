import { SELECT_WEATHER_TYPE } from '../constants/types.constants'

const INIT_STATE = {
    typeSelected: 'Current Conditions',
    sourceSelected: 'Weather Channel',
    envSelected: 'PROD'
}

export default (state = INIT_STATE, action) => {
    const { type, payload } = action

    switch(type) {
        case SELECT_WEATHER_TYPE:
            return { ...state, typeSelected: payload }
        default:
            return state
    }
}