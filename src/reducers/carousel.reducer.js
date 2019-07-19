/**
 * Reducer for updating the Carousel Model. Because the Carousel data is complex
 * and consists of data from multiple apis and requires decoding and decompression,
 * we save all of it in one object and update it with new data from apis
 */

import { GET_ZIP_SUCCESS, GET_CAROUSEL_CURRENT_SUCCESS, GET_CAROUSEL_FORECAST_SUCCESS } from '../constants/types.constants'
import CarouselModel from '../models/carousel.model'
import { clone } from '../utils/helper.util'

export default (state = new CarouselModel(), action) => {
    const { type, payload } = action

    switch(type) {
        case GET_ZIP_SUCCESS:
        case GET_CAROUSEL_CURRENT_SUCCESS:
        case GET_CAROUSEL_FORECAST_SUCCESS:
            return clone(payload)
        default:
            return state;
    }
}
