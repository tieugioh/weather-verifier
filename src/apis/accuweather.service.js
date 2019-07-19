/**
 * Accuweather service file.
 * Documentation for usage and response types:
 * https://developer.accuweather.com/apis
 */

import axios from 'axios'

const API_KEY = '7OCYoLDGL3vcQ3nRjKG8Oy2AvcROb8AT'
const BASE_URL = 'http://dataservice.accuweather.com'
const ZIP_ROUTE = 'locations/v1/US/search'
const CURR_ROUTE = 'currentconditions/v1'
const FORE_ROUTE = 'forecasts/v1/daily'

/**
 * Get current conditions data from accuweather api
 * @param {number} zipcode - zipcode of area to check current conditions
 */
export const getAccuCurrent = async function(zipcode) {
    const locationKey = (await getLocationKey(zipcode))['data'][0]['Key']

    return axios.get(`${BASE_URL}/${CURR_ROUTE}/${locationKey}?apikey=${API_KEY}`)
}

/**
 * Get daiy forecast data from accuweather api
 * @param {number} zipcode - zipcode of area to check current conditions
 * @param {numbers} days - number of days for forecast (1,10,15)
 */
export const getAccuForecast = async function(zipcode, days = 10) {
    const locationKey = (await getLocationKey(zipcode))['data'][0]['Key']

    return axios.get(`${BASE_URL}/${FORE_ROUTE}/${days}day/${locationKey}?apikey=${API_KEY}`)
}

/**
 * Get location key for the passed in zipcode
 * @param {number} zipcode - zipcode of area to check current conditions
 */
function getLocationKey(zipcode) {
    return axios.get(`${BASE_URL}/${ZIP_ROUTE}?apikey=${API_KEY}&q=${zipcode}`)
}