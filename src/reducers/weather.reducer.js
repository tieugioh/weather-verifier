import { GET_WEATHER_CURRENT_SUCCESS, GET_WEATHER_TENDAY_SUCCESS } from '../constants/types.constants'
import WeatherModel from '../models/weather.model'
import { clone } from '../utils/helper.util'

export default (state = new WeatherModel(), action) => {
    const { type, payload } = action

    switch(type) {
        case GET_WEATHER_CURRENT_SUCCESS:
        case GET_WEATHER_TENDAY_SUCCESS:
            return clone(payload)
        default:
            return state;
    }
}