/**
 * TODO - THIS FILE HAS A LOT OF DUPE CODE, MUST FIX
 */
import { 
    GET_ZIP_REQUEST,
    GET_ZIP_SUCCESS,
    GET_ZIP_FAILURE,
    GET_CAROUSEL_CURRENT_REQUEST,
    GET_CAROUSEL_CURRENT_SUCCESS,
    GET_CAROUSEL_CURRENT_FAILURE,
    GET_CAROUSEL_FORECAST_REQUEST,
    GET_CAROUSEL_FORECAST_SUCCESS,
    GET_CAROUSEL_FORECAST_FAILURE,
    GET_WEATHER_CURRENT_REQUEST,
    GET_WEATHER_CURRENT_SUCCESS,
    GET_WEATHER_CURRENT_FAILURE,
    GET_WEATHER_TENDAY_REQUEST,
    GET_WEATHER_TENDAY_SUCCESS,
    GET_WEATHER_TENDAY_FAILURE,
    STORE_CURR_COMP,
    STORE_FORE_COMP,
    SELECT_WEATHER_TYPE
} from '../constants/types.constants'
import carConst from '../constants/carousel.constants'
import ZipService from '../apis/zip.service'
import currentService from '../apis/current.service'
import forecastService from '../apis/forecast.service'
import weatherService from '../apis/weather.service'
import carouselModel from '../models/carousel.model'
import compModel from '../models/comp.model'
import { addLeadingZeroes } from '../utils/helper.util'
import history from '../history'

/**
 * Action creator for loading in all zipcodes
 */
export const loadWeatherStationIDs = () => async dispatch => {
    dispatch({ type: GET_ZIP_REQUEST })

    try {
        const wsIDs = await ZipService.getAllZip()
        dispatch({ type: GET_ZIP_SUCCESS, payload: new carouselModel(wsIDs) })
    } catch(err) {
        dispatch({ type: GET_ZIP_FAILURE, payload: err })
    }
}

export const compareCurrentConditions = (start, end) => async (dispatch, getState) => {
    await dispatch(getCarouselCurrent(start, end))
    await dispatch(getWeatherCurrent(start, end))

    const carrCurrCons = getState().carousel.getCurrentConditions(start, end)
    const weathCurrCons = getState().weather.getCurrentConditions()

    let compList = []

    for(let zipcode in carrCurrCons) {
        const carCurrCon = carrCurrCons[zipcode]
        const weathCurrCon = weathCurrCons[zipcode]

        if(carCurrCon.compare(weathCurrCon)) {
            let comp = new compModel()
                comp.zipcode = zipcode
                comp.carousel = carCurrCon
                comp.weatherChannel = weathCurrCon

            compList.push(comp)
        }
    }
    
    dispatch({ type: STORE_CURR_COMP, payload: compList })
    history.push('/weather/current')
}

export const compareTenDayForecast = (start, end) => async (dispatch, getState) => {
    await dispatch(getCarouselForecast(start, end))
    await dispatch(getWeatherForecast(start, end))

    const carTenDays = getState().carousel.getTenDay(start, end)
    const weathTenDays = getState().weather.getTenDay()

    let compList = []

    for(let zipcode in carTenDays) {
        const carTenDay = carTenDays[zipcode]
        const weathTenDay = weathTenDays[zipcode]

        if(carTenDay.compare(weathTenDay)) {
            let comp = new compModel()
                comp.zipcode = zipcode
                comp.carousel = carTenDay
                comp.weatherChannel = weathTenDay

            compList.push(comp)
        }
    }
    
    dispatch({ type: STORE_FORE_COMP, payload: compList })
    history.push('/weather/forecast')
}

export const getCarouselCurrent = (start, end) => async (dispatch, getState) => {
    dispatch({ type: GET_CAROUSEL_CURRENT_REQUEST })
    const [ startWsId, endWsId ] = getState().carousel.getWeatherStationID(start, end)
    
    if(startWsId === 0) {
        dispatch({ type: GET_CAROUSEL_CURRENT_FAILURE, payload: { message: 'No valid weather station id for provided zipcodes'} })
        return
    }

    const currConReq = end ? currentService.getCurrentByWeatherStationID(startWsId, endWsId) : 
                                currentService.getCurrentByWeatherStationID(startWsId)

    const index = Math.floor(startWsId/carConst.WS2_EL_PER_FILE) * carConst.WS2_EL_PER_FILE + 1

    try {
        const currConData = await Promise.all(currConReq)
        let carousel = getState().carousel
            carousel.updateCurrentConditions(currConData, index)

        dispatch({ type: GET_CAROUSEL_CURRENT_SUCCESS, payload: carousel})
    } catch(err) {
        dispatch({ type: GET_CAROUSEL_CURRENT_FAILURE, payload: err })
    }
}

export const getCarouselForecast = (start, end) => async (dispatch, getState) => {
    dispatch({ type: GET_CAROUSEL_FORECAST_REQUEST })
    const [ startWsId, endWsId ] = getState().carousel.getWeatherStationID(start, end)

    if(startWsId === 0) {
        dispatch({ type: GET_CAROUSEL_CURRENT_FAILURE, payload: { message: 'No valid weather station id for provided zipcodes'} })
        return
    }

    const foreReq = end ? forecastService.getForecastByWeatherStationID(startWsId, endWsId) : 
                            forecastService.getForecastByWeatherStationID(startWsId)

    const index = Math.floor(startWsId/carConst.WS2_EL_PER_FILE) * carConst.WS2_EL_PER_FILE + 1

    try {
        const foreData = await Promise.all(foreReq)  
        let carousel = getState().carousel
            carousel.updateForecastConditions(foreData, index)
            carousel.setComparisonRange(start, end)

        dispatch({ type: GET_CAROUSEL_FORECAST_SUCCESS, payload: carousel})
    } catch(err) {
        dispatch({ type: GET_CAROUSEL_FORECAST_FAILURE, payload: err })
    }
}

export const getWeatherCurrent = (start, end) => async (dispatch, getState) => {
    dispatch({ type: GET_WEATHER_CURRENT_REQUEST })
    let requests = []
    let zipcodes = []
    
    for(let i=start; i<end+1; i++) {
        if(getState().carousel.isValidZipcode(i)) {
            const zipStr = addLeadingZeroes(i)
            zipcodes.push(i)
            requests.push(weatherService.getCurrent(zipStr))
        }
    }

    try {
        const data = await Promise.all(requests)
        let dataMap = {}

        for(let i=0; i< data.length; i++)
            dataMap[zipcodes[i]] = data[i]
    
        let weather = getState().weather
            weather.setCurrentConditions(dataMap)

        dispatch({ type: GET_WEATHER_CURRENT_SUCCESS, payload: weather})
    } catch(err) {
        dispatch({ type: GET_WEATHER_CURRENT_FAILURE, payload: err })
    }
}

export const getWeatherForecast = (start, end) => async (dispatch, getState) => {
    dispatch({ type: GET_WEATHER_TENDAY_REQUEST })
    let requests = []
    let zipcodes = []

    for(let i=start; i<end+1; i++) {
        if(getState().carousel.isValidZipcode(i)) {
            const zipStr = addLeadingZeroes(i)
            zipcodes.push(i)
            requests.push(weatherService.getTenDay(zipStr))
        }
    }

    try {
        const data = await Promise.all(requests)
        let dataMap = {}

        for(let i=0; i< data.length; i++)
            dataMap[zipcodes[i]] = data[i]
    
        let weather = getState().weather
            weather.setTenDay(dataMap)

        dispatch({ type: GET_WEATHER_TENDAY_SUCCESS, payload: weather})
    } catch(err) {
        dispatch({ type: GET_WEATHER_TENDAY_FAILURE, payload: err })
    }
}

export const selectWeatherType = btnName => {
    return { type: SELECT_WEATHER_TYPE, payload: btnName }
}